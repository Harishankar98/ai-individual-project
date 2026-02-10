from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_paper, name='upload_paper'),
    path('papers/', views.get_papers, name='get_papers'),
    path('search/', views.semantic_search, name='semantic_search'),
    path('result/<uuid:paper_id>/', views.get_result, name='get_result'),
    path('push/', views.push_results, name='push_results'),
]

