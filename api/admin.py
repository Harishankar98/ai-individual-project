from django.contrib import admin
from .models import ResearchPaper, SearchQuery


@admin.register(ResearchPaper)
class ResearchPaperAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploaded_at', 'processed', 'page_count', 'word_count']
    list_filter = ['processed', 'uploaded_at']
    search_fields = ['title', 'full_text']
    readonly_fields = ['id', 'uploaded_at']


@admin.register(SearchQuery)
class SearchQueryAdmin(admin.ModelAdmin):
    list_display = ['query', 'created_at']
    list_filter = ['created_at']
    search_fields = ['query']
    readonly_fields = ['id', 'created_at']
