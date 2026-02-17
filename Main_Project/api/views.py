from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import ResearchPaper, SearchQuery
from .pdf_processor import PDFProcessor
from .ai_processor import AIProcessor
import os


@api_view(['POST'])
def upload_paper(request):
    """
    API endpoint to upload a research paper PDF.
    POST /api/upload/
    """
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    file = request.FILES['file']
    
    # Validate file type
    if not file.name.endswith('.pdf'):
        return Response(
            {'error': 'Only PDF files are allowed'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create ResearchPaper instance
    paper = ResearchPaper(file=file)
    paper.save()
    
    try:
        # Process PDF
        pdf_path = paper.file.path
        processor = PDFProcessor()
        extracted_data = processor.extract_text(pdf_path)
        
        # Store extracted data
        paper.full_text = extracted_data.get('full_text', '')
        paper.title = extracted_data.get('title', file.name) or file.name
        paper.abstract = extracted_data.get('abstract', '')
        paper.keywords = extracted_data.get('keywords', [])
        paper.authors = extracted_data.get('authors', [])
        paper.references = extracted_data.get('references', [])
        paper.page_count = extracted_data.get('page_count', 0)
        paper.word_count = extracted_data.get('word_count', 0)
        
        # Generate AI summary
        ai_processor = AIProcessor()
        if paper.full_text:
            paper.summary = ai_processor.generate_summary(paper.full_text)
        
        paper.processed = True
        paper.save()
        
        return Response({
            'id': str(paper.id),
            'title': paper.title,
            'status': 'success',
            'message': 'Paper uploaded and processed successfully',
            'page_count': paper.page_count,
            'word_count': paper.word_count,
            'processed': paper.processed
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        paper.delete()  # Clean up if processing fails
        return Response(
            {'error': f'Error processing PDF: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_papers(request):
    """
    API endpoint to get all research papers or a specific paper.
    GET /api/papers/ - get all papers
    GET /api/papers/{id}/ - get specific paper
    """
    paper_id = request.GET.get('id')
    
    if paper_id:
        try:
            paper = get_object_or_404(ResearchPaper, id=paper_id)
            return Response({
                'id': str(paper.id),
                'title': paper.title,
                'uploaded_at': paper.uploaded_at.isoformat(),
                'processed': paper.processed,
                'page_count': paper.page_count,
                'word_count': paper.word_count,
                'authors': paper.authors,
                'keywords': paper.keywords,
                'abstract': paper.abstract[:500] if paper.abstract else '',
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        # Get all papers
        papers = ResearchPaper.objects.all()[:100]  # Limit to 100 most recent
        papers_data = [{
            'id': str(paper.id),
            'title': paper.title,
            'uploaded_at': paper.uploaded_at.isoformat(),
            'processed': paper.processed,
            'page_count': paper.page_count,
            'word_count': paper.word_count,
        } for paper in papers]
        
        return Response({
            'papers': papers_data,
            'count': len(papers_data)
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
def semantic_search(request):
    """
    API endpoint for semantic search across research papers.
    POST /api/search/
    Body: {"query": "search term", "limit": 10}
    """
    query_text = request.data.get('query', '')
    limit = int(request.data.get('limit', 10))
    
    if not query_text:
        return Response(
            {'error': 'Query parameter is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Get all processed papers
        papers = ResearchPaper.objects.filter(processed=True)
        
        # Prepare documents for search
        documents = []
        for paper in papers:
            documents.append({
                'id': str(paper.id),
                'title': paper.title,
                'text': paper.full_text[:5000],  # Limit text for performance
                'abstract': paper.abstract,
                'keywords': paper.keywords,
            })
        
        # Perform semantic search
        ai_processor = AIProcessor()
        search_results = ai_processor.semantic_search(query_text, documents, top_k=limit)
        
        # Format results
        results = []
        for result in search_results:
            doc = result['document']
            results.append({
                'id': doc['id'],
                'title': doc['title'],
                'abstract': doc.get('abstract', '')[:300],
                'relevance_score': result['relevance'],
                'keywords': doc.get('keywords', [])[:5],
            })
        
        # Save search query
        search_query = SearchQuery.objects.create(
            query=query_text,
            results=results
        )
        
        return Response({
            'query': query_text,
            'results': results,
            'count': len(results),
            'search_id': str(search_query.id)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Search error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_result(request, paper_id):
    """
    API endpoint to get detailed results for a specific paper.
    GET /api/result/{paper_id}/
    """
    try:
        paper = get_object_or_404(ResearchPaper, id=paper_id)
        
        if not paper.processed:
            return Response({
                'id': str(paper.id),
                'status': 'processing',
                'message': 'Paper is still being processed'
            }, status=status.HTTP_202_ACCEPTED)
        
        # Get AI insights
        ai_processor = AIProcessor()
        insights = ai_processor.extract_key_insights(paper.full_text)
        
        return Response({
            'id': str(paper.id),
            'title': paper.title,
            'uploaded_at': paper.uploaded_at.isoformat(),
            'summary': paper.summary,
            'abstract': paper.abstract,
            'full_text': paper.full_text[:10000],  # Limit for API response
            'keywords': paper.keywords,
            'authors': paper.authors,
            'references': paper.references[:20],  # Limit references
            'page_count': paper.page_count,
            'word_count': paper.word_count,
            'insights': insights,
            'metadata': {
                'processed': paper.processed,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def push_results(request):
    """
    API endpoint to update/save results for a paper.
    POST /api/push/
    Body: {"paper_id": "uuid", "updates": {...}}
    """
    paper_id = request.data.get('paper_id')
    
    if not paper_id:
        return Response(
            {'error': 'paper_id is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        paper = get_object_or_404(ResearchPaper, id=paper_id)
        updates = request.data.get('updates', {})
        
        # Update allowed fields
        allowed_fields = ['title', 'summary', 'keywords', 'abstract']
        for field in allowed_fields:
            if field in updates:
                setattr(paper, field, updates[field])
        
        paper.save()
        
        return Response({
            'id': str(paper.id),
            'status': 'success',
            'message': 'Paper updated successfully',
            'updated_fields': list(updates.keys())
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
