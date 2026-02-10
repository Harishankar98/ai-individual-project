from django.db import models
import uuid


class ResearchPaper(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    file = models.FileField(upload_to='papers/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    
    # Extracted content
    full_text = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    keywords = models.JSONField(default=list, blank=True)
    abstract = models.TextField(blank=True)
    authors = models.JSONField(default=list, blank=True)
    references = models.JSONField(default=list, blank=True)
    
    # Metadata
    page_count = models.IntegerField(default=0)
    word_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return self.title or f"Paper {self.id}"


class SearchQuery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    query = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    results = models.JSONField(default=list, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.query[:50]
