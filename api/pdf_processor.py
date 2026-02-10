import pdfplumber
import PyPDF2
from typing import Dict, List, Tuple
import re


class PDFProcessor:
    """Process PDF files to extract text and metadata."""
    
    @staticmethod
    def extract_text(pdf_path: str) -> Dict[str, any]:
        """
        Extract text and metadata from PDF file.
        Returns a dictionary with extracted information.
        """
        result = {
            'full_text': '',
            'pages': [],
            'page_count': 0,
            'metadata': {},
            'abstract': '',
            'title': '',
            'authors': [],
            'keywords': [],
            'references': []
        }
        
        try:
            # Extract text using pdfplumber (better for structured content)
            with pdfplumber.open(pdf_path) as pdf:
                result['page_count'] = len(pdf.pages)
                
                # Extract metadata
                if pdf.metadata:
                    result['metadata'] = pdf.metadata
                    result['title'] = pdf.metadata.get('Title', '')
                    if pdf.metadata.get('Author'):
                        result['authors'] = [author.strip() for author in pdf.metadata.get('Author', '').split(',')]
                
                # Extract text from all pages
                full_text = []
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text() or ''
                    full_text.append(text)
                    result['pages'].append({
                        'page_number': i + 1,
                        'text': text
                    })
                
                result['full_text'] = '\n\n'.join(full_text)
                
        except Exception as e:
            print(f"Error with pdfplumber: {e}")
            # Fallback to PyPDF2
            try:
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    result['page_count'] = len(pdf_reader.pages)
                    
                    if pdf_reader.metadata:
                        result['metadata'] = pdf_reader.metadata
                        result['title'] = pdf_reader.metadata.get('/Title', '')
                    
                    full_text = []
                    for i, page in enumerate(pdf_reader.pages):
                        text = page.extract_text() or ''
                        full_text.append(text)
                    
                    result['full_text'] = '\n\n'.join(full_text)
            except Exception as e2:
                print(f"Error with PyPDF2: {e2}")
                return result
        
        # Post-process extracted text
        if result['full_text']:
            # Extract abstract (usually after title, before introduction)
            abstract_match = re.search(r'(?i)(abstract|summary)[:\s]*\n(.*?)(?=\n\s*(introduction|1\.|keywords|references))', 
                                     result['full_text'], re.DOTALL)
            if abstract_match:
                result['abstract'] = abstract_match.group(2).strip()[:2000]  # Limit length
            
            # Extract keywords (look for "Keywords:" section)
            keywords_match = re.search(r'(?i)keywords?[:\s]*\n([^\n]+)', result['full_text'])
            if keywords_match:
                keywords_text = keywords_match.group(1)
                result['keywords'] = [kw.strip() for kw in re.split(r'[,;]', keywords_text) if kw.strip()]
            
            # Extract references (look for references section)
            refs_match = re.search(r'(?i)references?\s*\n(.*)', result['full_text'], re.DOTALL)
            if refs_match:
                refs_text = refs_match.group(1)
                # Split references by common patterns
                refs = re.split(r'\n\s*\[\d+\]|\n\s*\d+\.', refs_text)
                result['references'] = [ref.strip() for ref in refs if len(ref.strip()) > 10][:50]  # Limit to 50
            
            # If title not in metadata, try to extract from first page
            if not result['title']:
                first_page = result['full_text'].split('\n\n')[0][:500]
                lines = [line.strip() for line in first_page.split('\n') if len(line.strip()) > 10]
                if lines:
                    result['title'] = lines[0][:200]
        
        # Calculate word count
        result['word_count'] = len(result['full_text'].split())
        
        return result

