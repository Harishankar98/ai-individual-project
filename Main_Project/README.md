# AI Research Paper Summarizer & Extractor

A professional web application built with Django for AI-powered research paper processing, summarization, and extraction.

## Features

- 📄 **PDF Upload & Processing**: Upload research papers in PDF format
- 🤖 **AI-Powered Summarization**: Automatic extraction of summaries, abstracts, and key insights
- 🔍 **Semantic Search**: Search across all uploaded papers using semantic search
- 📊 **Detailed Analysis**: Extract keywords, authors, references, methodology, and conclusions
- 🎨 **Modern UI**: Professional and responsive user interface

## API Endpoints

1. **POST /api/upload/** - Upload a PDF research paper
2. **GET /api/papers/** - Get all papers or specific paper (use `?id=uuid`)
3. **POST /api/search/** - Semantic search across papers
4. **GET /api/result/{paper_id}/** - Get detailed results for a paper
5. **POST /api/push/** - Update paper metadata

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

4. Run the development server:
```bash
python manage.py runserver
```

5. Open your browser and navigate to `http://127.0.0.1:8000`

## Usage

1. **Upload a Paper**: Drag and drop or browse to upload a PDF file
2. **View Papers**: See all uploaded papers in the list
3. **Search**: Use semantic search to find relevant papers
4. **View Results**: Click on any paper to see detailed analysis including:
   - Summary
   - Abstract
   - Keywords
   - Authors
   - Methodology
   - Conclusions
   - References

## Technology Stack

- **Backend**: Django 4.2, Django REST Framework
- **PDF Processing**: pdfplumber, PyPDF2
- **AI Processing**: Custom extractive summarization algorithms
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: SQLite (default, can be changed)

## Project Structure

```
research_paper_ai/
├── api/                 # Main application
│   ├── models.py       # Database models
│   ├── views.py        # API views
│   ├── urls.py         # URL routing
│   ├── pdf_processor.py # PDF extraction logic
│   └── ai_processor.py  # AI summarization logic
├── templates/          # HTML templates
├── static/             # CSS, JS, images
├── media/              # Uploaded files
└── research_paper_ai/  # Project settings
```

## Notes

- Maximum file size: 10MB (configurable in settings.py)
- The application uses extractive summarization for accurate results
- All uploaded files are stored in the `media/papers/` directory
- The database is stored in `db.sqlite3`

## License

This project is open source and available for educational purposes.

