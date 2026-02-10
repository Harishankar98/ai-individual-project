from typing import Dict, List
import re


class AIProcessor:
    """AI-powered summarization and extraction using rule-based and pattern matching."""
    
    @staticmethod
    def generate_summary(text: str, max_length: int = 500) -> str:
        """
        Generate a summary of the research paper text.
        Uses extractive summarization approach.
        """
        if not text or len(text) < 100:
            return "Unable to generate summary. Text too short."
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        if not sentences:
            return text[:max_length] + "..." if len(text) > max_length else text
        
        # Simple scoring: prefer sentences with keywords, important terms
        keywords = ['method', 'result', 'conclusion', 'objective', 'aim', 'study', 
                   'research', 'analysis', 'findings', 'significant', 'important']
        
        scored_sentences = []
        for i, sentence in enumerate(sentences):
            score = 0
            # Higher score for sentences with keywords
            lower_sentence = sentence.lower()
            for keyword in keywords:
                if keyword in lower_sentence:
                    score += 1
            
            # Prefer sentences from introduction and conclusion sections
            if i < len(sentences) * 0.1 or i > len(sentences) * 0.9:
                score += 0.5
            
            # Prefer longer sentences (but not too long)
            if 30 < len(sentence) < 200:
                score += 0.5
            
            scored_sentences.append((score, sentence))
        
        # Sort by score and take top sentences
        scored_sentences.sort(key=lambda x: x[0], reverse=True)
        summary_sentences = scored_sentences[:max(5, len(sentences) // 10)]
        summary_sentences.sort(key=lambda x: sentences.index(x[1]))  # Maintain order
        
        summary = '. '.join([s[1] for s in summary_sentences])
        
        # If summary is too long, truncate
        if len(summary) > max_length:
            summary = summary[:max_length].rsplit('.', 1)[0] + '.'
        
        return summary or text[:max_length]
    
    @staticmethod
    def extract_key_insights(text: str) -> Dict[str, any]:
        """
        Extract key insights, findings, and important information from the paper.
        """
        insights = {
            'main_findings': [],
            'methodology': '',
            'conclusions': [],
            'important_numbers': [],
            'key_claims': []
        }
        
        if not text:
            return insights
        
        # Extract methodology section
        method_match = re.search(r'(?i)(methodology|methods?|approach)[:\s]*\n(.*?)(?=\n\s*(results?|findings|discussion|conclusion))', 
                                text, re.DOTALL)
        if method_match:
            insights['methodology'] = method_match.group(2).strip()[:1000]
        
        # Extract conclusions
        concl_match = re.search(r'(?i)(conclusion|conclusions?)[:\s]*\n(.*?)(?=\n\s*(references?|acknowledgment))', 
                               text, re.DOTALL)
        if concl_match:
            concl_text = concl_match.group(2)
            concl_sentences = re.split(r'[.!?]+', concl_text)
            insights['conclusions'] = [s.strip() for s in concl_sentences if len(s.strip()) > 30][:5]
        
        # Extract numbers/statistics (patterns like "X%", "p < 0.05", etc.)
        number_patterns = [
            r'\d+\.\d+%',  # Percentages
            r'p\s*[<>=]\s*0\.\d+',  # P-values
            r'\d+\s*±\s*\d+',  # Mean ± SD
            r'r\s*=\s*[-]?\d+\.\d+',  # Correlations
        ]
        for pattern in number_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            insights['important_numbers'].extend(matches[:10])
        
        # Extract key claims (sentences with strong language)
        strong_words = ['significantly', 'important', 'demonstrates', 'proves', 
                       'shows', 'indicates', 'suggests', 'found that']
        sentences = re.split(r'[.!?]+', text)
        for sentence in sentences:
            if any(word in sentence.lower() for word in strong_words) and len(sentence.strip()) > 30:
                insights['key_claims'].append(sentence.strip()[:200])
                if len(insights['key_claims']) >= 5:
                    break
        
        return insights
    
    @staticmethod
    def semantic_search(query: str, documents: List[Dict], top_k: int = 5) -> List[Dict]:
        """
        Perform semantic search on documents.
        Uses keyword matching and relevance scoring.
        """
        if not query or not documents:
            return []
        
        query_lower = query.lower()
        query_terms = set(query_lower.split())
        
        scored_docs = []
        for doc in documents:
            score = 0
            text = doc.get('text', '').lower()
            title = doc.get('title', '').lower()
            
            # Title matches are weighted higher
            for term in query_terms:
                if term in title:
                    score += 5
                if term in text:
                    score += 1
            
            # Exact phrase matching bonus
            if query_lower in text or query_lower in title:
                score += 10
            
            # Length normalization (prefer shorter, more focused matches)
            if text:
                score = score / (1 + len(text) / 10000)
            
            if score > 0:
                scored_docs.append({
                    'document': doc,
                    'score': score,
                    'relevance': min(100, int(score * 10))
                })
        
        # Sort by score and return top_k
        scored_docs.sort(key=lambda x: x['score'], reverse=True)
        return scored_docs[:top_k]

