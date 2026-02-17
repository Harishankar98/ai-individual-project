import { DocumentSummary, DocumentInsights } from "../types";

const API_BASE_URL = 'https://researchpapersummizer-backend.onrender.com/api';

// Enhanced fetch with timeout and better error handling
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
  const { timeout = 60000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The backend may be waking up (free tier can take 30-60 seconds for first request).');
    }
    throw error;
  }
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || response.statusText;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const generateSummary = async (text: string): Promise<DocumentSummary> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/summarize/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    timeout: 60000, // 60 seconds for wake-up
  });
  return handleResponse(response);
};

export const extractInsights = async (text: string): Promise<DocumentInsights> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/insights/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    timeout: 60000, // 60 seconds for wake-up
  });
  return handleResponse(response);
};

export const getEmbeddings = async (text: string): Promise<number[]> => {
  // Mock embeddings for now, or could implement a backend endpoint if needed.
  // Since SearchPage logic is changing to server-side search, this might not be needed
  // directly, but keeping it for type compatibility if used elsewhere.
  return Array.from({ length: 768 }, () => Math.random());
};

export const search = async (query: string): Promise<{ answer: string }> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/search/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    timeout: 60000, // 60 seconds for wake-up
  });

  return handleResponse(response);
}

export const refineSearchResults = async (query: string, results: string[]): Promise<string> => {
  // This function was used for client-side synthesis.
  // We can redirect it to the search endpoint or keep it as legacy
  // if we want to maintain signature but use the backend.
  // Ideally, SearchPage should call search() directly.
  const result = await search(query);
  return result.answer;
};
