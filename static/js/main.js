const API_BASE_URL = '/api';

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadLink = document.getElementById('uploadLink');
const uploadBtn = document.getElementById('uploadBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const papersList = document.getElementById('papersList');
const refreshBtn = document.getElementById('refreshBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');
const closeResultsBtn = document.getElementById('closeResultsBtn');

let selectedFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPapers();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Upload area
    uploadLink.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Upload button
    uploadBtn.addEventListener('click', handleUpload);
    
    // Search
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Refresh
    refreshBtn.addEventListener('click', loadPapers);
    
    // Close results
    closeResultsBtn.addEventListener('click', () => {
        resultsSection.style.display = 'none';
    });
}

// File Selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        selectedFile = file;
        uploadArea.innerHTML = `
            <div class="upload-icon">📄</div>
            <p class="upload-text"><strong>${file.name}</strong></p>
            <p class="upload-hint">Ready to upload</p>
        `;
        uploadBtn.style.display = 'block';
    } else {
        alert('Please select a PDF file');
    }
}

// Drag and Drop
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        selectedFile = file;
        fileInput.files = e.dataTransfer.files;
        uploadArea.innerHTML = `
            <div class="upload-icon">📄</div>
            <p class="upload-text"><strong>${file.name}</strong></p>
            <p class="upload-hint">Ready to upload</p>
        `;
        uploadBtn.style.display = 'block';
    } else {
        alert('Please drop a PDF file');
    }
}

// Get CSRF token from cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getCsrfToken() {
    return getCookie('csrftoken');
}

// Upload
async function handleUpload() {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    uploadBtn.style.display = 'none';
    uploadProgress.style.display = 'block';
    progressFill.style.width = '30%';
    progressText.textContent = 'Uploading file...';
    
    try {
        const csrftoken = getCsrfToken();
        const headers = {};
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
        
        const response = await fetch(`${API_BASE_URL}/upload/`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });
        
        progressFill.style.width = '60%';
        progressText.textContent = 'Processing PDF...';
        
        const data = await response.json();
        
        if (response.ok) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Success! Paper processed.';
            
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                uploadBtn.style.display = 'none';
                uploadArea.innerHTML = `
                    <div class="upload-icon">📤</div>
                    <p class="upload-text">Drag & drop your PDF file here or <span class="upload-link">browse</span></p>
                    <p class="upload-hint">Supports PDF files up to 10MB</p>
                `;
                selectedFile = null;
                fileInput.value = '';
                loadPapers();
                showResults(data.id);
            }, 1000);
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    } catch (error) {
        progressText.textContent = `Error: ${error.message}`;
        progressFill.style.width = '0%';
        setTimeout(() => {
            uploadProgress.style.display = 'none';
            uploadBtn.style.display = 'block';
        }, 3000);
    }
}

// Load Papers
async function loadPapers() {
    try {
        const response = await fetch(`${API_BASE_URL}/papers/`);
        const data = await response.json();
        
        if (data.papers && data.papers.length > 0) {
            papersList.innerHTML = data.papers.map(paper => `
                <div class="paper-item" onclick="showResults('${paper.id}')">
                    <div class="paper-info">
                        <div class="paper-title">${escapeHtml(paper.title)}</div>
                        <div class="paper-meta">
                            <span>📄 ${paper.page_count} pages</span>
                            <span>📝 ${paper.word_count} words</span>
                            <span>🕒 ${formatDate(paper.uploaded_at)}</span>
                        </div>
                    </div>
                    <div class="paper-status ${paper.processed ? 'status-processed' : 'status-processing'}">
                        ${paper.processed ? '✓ Processed' : '⏳ Processing'}
                    </div>
                </div>
            `).join('');
        } else {
            papersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No papers uploaded yet. Upload your first PDF to get started!</p>';
        }
    } catch (error) {
        console.error('Error loading papers:', error);
        papersList.innerHTML = '<p style="text-align: center; color: var(--danger-color); padding: 2rem;">Error loading papers. Please refresh.</p>';
    }
}

// Search
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    searchResults.innerHTML = '<div class="spinner"></div>';
    
    try {
        const csrftoken = getCsrfToken();
        const headers = {
            'Content-Type': 'application/json',
        };
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
        
        const response = await fetch(`${API_BASE_URL}/search/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, limit: 10 }),
        });
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            searchResults.innerHTML = data.results.map(result => `
                <div class="search-result-item" onclick="showResults('${result.id}')">
                    <div class="search-result-title">${escapeHtml(result.title)}</div>
                    <div class="search-result-abstract">${escapeHtml(result.abstract || 'No abstract available')}</div>
                    <div class="search-result-meta">
                        <span class="relevance-badge">Relevance: ${result.relevance_score}%</span>
                        ${result.keywords && result.keywords.length > 0 ? 
                            `<span>Tags: ${result.keywords.map(k => escapeHtml(k)).join(', ')}</span>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            searchResults.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No results found. Try different keywords.</p>';
        }
    } catch (error) {
        console.error('Error searching:', error);
        searchResults.innerHTML = '<p style="text-align: center; color: var(--danger-color); padding: 2rem;">Error performing search. Please try again.</p>';
    }
}

// Show Results
async function showResults(paperId) {
    resultsSection.style.display = 'block';
    resultsContent.innerHTML = '<div class="spinner"></div>';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    try {
        const response = await fetch(`${API_BASE_URL}/result/${paperId}/`);
        const data = await response.json();
        
        if (response.status === 202) {
            resultsContent.innerHTML = `
                <div class="result-section">
                    <p style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Paper is still being processed. Please wait...
                    </p>
                </div>
            `;
            setTimeout(() => showResults(paperId), 3000);
            return;
        }
        
        resultsContent.innerHTML = `
            <div class="result-section">
                <h3 class="result-section-title">Title</h3>
                <div class="result-text">${escapeHtml(data.title)}</div>
            </div>
            
            ${data.authors && data.authors.length > 0 ? `
            <div class="result-section">
                <h3 class="result-section-title">Authors</h3>
                <div class="authors-list">
                    ${data.authors.map(author => `<span class="author-tag">${escapeHtml(author)}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.summary ? `
            <div class="result-section">
                <h3 class="result-section-title">Summary</h3>
                <div class="result-text">${escapeHtml(data.summary)}</div>
            </div>
            ` : ''}
            
            ${data.abstract ? `
            <div class="result-section">
                <h3 class="result-section-title">Abstract</h3>
                <div class="result-text">${escapeHtml(data.abstract)}</div>
            </div>
            ` : ''}
            
            ${data.keywords && data.keywords.length > 0 ? `
            <div class="result-section">
                <h3 class="result-section-title">Keywords</h3>
                <div class="keywords-list">
                    ${data.keywords.map(keyword => `<span class="keyword-tag">${escapeHtml(keyword)}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.insights && (data.insights.conclusions && data.insights.conclusions.length > 0) ? `
            <div class="result-section">
                <h3 class="result-section-title">Key Conclusions</h3>
                <ul class="insights-list">
                    ${data.insights.conclusions.map(conclusion => `<li class="insight-item">${escapeHtml(conclusion)}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${data.insights && data.insights.methodology ? `
            <div class="result-section">
                <h3 class="result-section-title">Methodology</h3>
                <div class="result-text">${escapeHtml(data.insights.methodology)}</div>
            </div>
            ` : ''}
            
            ${data.references && data.references.length > 0 ? `
            <div class="result-section">
                <h3 class="result-section-title">References (${data.references.length})</h3>
                <div class="result-text">
                    ${data.references.slice(0, 10).map(ref => `<p style="margin-bottom: 0.5rem;">${escapeHtml(ref)}</p>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="result-section">
                <h3 class="result-section-title">Paper Statistics</h3>
                <div class="result-text">
                    <p><strong>Pages:</strong> ${data.page_count}</p>
                    <p><strong>Word Count:</strong> ${data.word_count}</p>
                    <p><strong>Uploaded:</strong> ${formatDate(data.uploaded_at)}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading results:', error);
        resultsContent.innerHTML = '<p style="text-align: center; color: var(--danger-color); padding: 2rem;">Error loading results. Please try again.</p>';
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

