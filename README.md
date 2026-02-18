# 🔬 AI Research Insight Hub

A powerful full-stack application for managing, summarizing, and querying research papers using advanced AI.

**Live Demo:** [https://reserachinsigher.netlify.app/](https://reserachinsigher.netlify.app/)

---

## ✨ Features

- **PDF Parsing** — Client-side parsing for speed and privacy
- **AI Summarization** — Generates structured summaries (Abstract, Findings, Methodology, Limitations)
- **Technical Insights** — Extracts deep technical concepts, objectives, and conclusions
- **Semantic Search** — Ask natural language questions across your document library
- **Chat with AI** — Context-aware Q&A with your documents
- **Multi-language Support** — English, Hindi, Marathi, and Hinglish
- **Voice Interaction** — Speech-to-Text and Text-to-Speech capabilities
- **Dark Mode** — Beautiful UI with light/dark theme support
- **PDF Export** — Download summaries as PDF

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|----------|
| React | 19.2.3 | UI library for building interactive components |
| TypeScript | 5.8.2 | Type-safe JavaScript for better code quality |
| Vite | 6.2.0 | Fast build tool and dev server |
| Tailwind CSS | CDN | Utility-first CSS framework for styling |
| Firebase Auth | 12.9.0 | User authentication (Email/Password + Google) |
| PDF.js | 3.11.174 | Client-side PDF text extraction |
| jsPDF | 2.5.2 | Generate PDF exports |

### Backend
| Technology | Version | Purpose |
|------------|---------|----------|
| Python | 3.10+ | Backend programming language |
| Django | 4.2.7 | Web framework for REST API |
| Django REST Framework | 3.14.0 | Building REST APIs |
| Google Generative AI | - | Gemini AI for summarization |
| OpenRouter | - | Multi-model AI API access |
| pypdf | 3.17.1 | Server-side PDF processing |

### Database
| Technology | Purpose |
|------------|----------|
| LocalStorage | Client-side document storage (privacy-first) |
| Firebase | User authentication data |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT                               │
│  ┌─────────────┐                                                │
│  │   Node.js   │ ← Runs Vite (build tool only, NOT backend)     │
│  │   + Vite    │                                                │
│  └──────┬──────┘                                                │
│         │ compiles                                              │
│         ▼                                                       │
│  ┌─────────────┐         API Calls        ┌─────────────┐      │
│  │   React     │ ───────────────────────► │   Django    │      │
│  │  (Browser)  │                          │  (Server)   │      │
│  │  Frontend   │ ◄─────────────────────── │  Backend    │      │
│  └─────────────┘       JSON Response      └─────────────┘      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION                                │
│  ┌─────────────┐         API Calls        ┌─────────────┐      │
│  │   Static    │ ───────────────────────► │   Django    │      │
│  │   Files     │                          │    API      │      │
│  │  (Netlify)  │ ◄─────────────────────── │  (Render)   │      │
│  └─────────────┘       JSON Response      └─────────────┘      │
│                                                                 │
│  Note: No Node.js in production! Only static HTML/JS/CSS        │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

| Component | Why Used |
|-----------|----------|
| **Node.js** | Build tool only — compiles React/TypeScript into browser-ready files |
| **React** | Rich interactivity (chat, voice, real-time updates) not possible with Django templates |
| **Django** | Secure API for AI processing, keeps API keys safe on server |
| **LocalStorage** | Privacy — documents stay on user's device, not uploaded to server |

---

## 📦 Repository Structure

This project consists of **TWO separate repositories**:

| Repository | Purpose | URL |
|------------|---------|-----|
| `researchpapersummizer` | Frontend (React) | This repo |
| `researchpapersummizer_backend` | Backend (Django) | [Separate repo](https://github.com/your-username/researchpapersummizer_backend) |

**Note:** The frontend repository does NOT contain backend code. You need to clone the backend repository separately if you want to run locally.

---

## ⚙️ Backend Configuration

### Option A: Use Deployed Backend (Default)
The frontend is pre-configured to use the deployed backend:
```
https://researchpapersummizer-backend.onrender.com/api
```

**Pros:**
- No backend setup required
- Just run frontend and use

**Cons:**
- First request takes 30-60 seconds (Render free tier "wakes up" the server)
- Depends on external server availability
- Cannot debug backend issues

### Option B: Use Local Backend
If the deployed backend is slow or down, run backend locally.

**Step 1:** Change API URL in `services/geminiService.ts` (line 3):
```typescript
// Change FROM:
const API_BASE_URL = 'https://researchpapersummizer-backend.onrender.com/api';

// Change TO:
const API_BASE_URL = 'http://localhost:8000/api';
```

**Step 2:** Also update `components/ChatPage.tsx` (line 144) and `components/ResearchReadiness.tsx` (line 45) with the same localhost URL.

**Pros:**
- Instant responses (no wake-up delay)
- Full control and debugging
- Works offline

**Cons:**
- Need to run two terminals
- Requires Python setup

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Python** v3.10 or higher ([Download](https://python.org/))
- **Git** ([Download](https://git-scm.com/))

### API Keys Required
- **Gemini API Key** — Get from [Google AI Studio](https://makersuite.google.com/)
- **OpenRouter API Key** — Get from [OpenRouter](https://openrouter.ai/)

---

## 🚀 Installation & Setup

### Option 1: Using Command Prompt / PowerShell

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd researchpapersummizer
```

#### Step 2: Setup Frontend
```bash
# Install Node.js dependencies
npm install

# Create environment file
# Create a file named `.env` in root folder with:
# GEMINI_API_KEY=your_gemini_api_key
# OPENROUTER_API_KEY=your_openrouter_api_key

# Start development server
npm run dev
```
Frontend runs at: **http://localhost:1000/**

#### Step 3: Setup Backend (Choose One Option)

**Option A: Use Deployed Backend (Easiest)**
- No setup needed!
- Just wait 30-60 seconds on first AI request (server waking up)
- If it doesn't work after waiting, use Option B

**Option B: Run Backend Locally**

1. Clone the backend repository:
```bash
git clone https://github.com/your-username/researchpapersummizer_backend.git
cd researchpapersummizer_backend
```

2. Setup Python environment:
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

3. Create `.env` file in `research_backend` folder:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key
DEBUG=True
```

4. Run the backend:
```bash
cd research_backend
python manage.py migrate
python manage.py runserver
```
Backend runs at: **http://127.0.0.1:8000/**

5. **IMPORTANT:** Update frontend API URL (see "Backend Configuration" section above)

---

### Option 2: Using Anaconda Prompt

#### Step 1: Setup Python Environment
```bash
# Create conda environment
conda create -n research python=3.10
conda activate research

# Install Python dependencies
pip install -r requirements.txt
```

#### Step 2: Install Node.js in Conda
```bash
conda install -c conda-forge nodejs
```

#### Step 3: Verify Installation
```bash
python --version   # Should show Python 3.10+
node --version     # Should show v18+
npm --version      # Should show 9+
```

#### Step 4: Run the Project
```bash
# Terminal 1 - Frontend
cd researchpapersummizer
npm install
npm run dev

# Terminal 2 - Backend (if running locally)
cd researchpapersummizer_backend/research_backend
python manage.py runserver
```

---

## 🔄 Running Both Frontend & Backend Locally

If you want full local development:

### Terminal 1 - Backend
```bash
cd C:\Users\YourName\Downloads\researchpapersummizer_backend\research_backend
.\..\venv\Scripts\activate
python manage.py runserver
```
→ Runs at http://localhost:8000

### Terminal 2 - Frontend
```bash
cd C:\Users\YourName\Downloads\researchpapersummizer
npm run dev
```
→ Runs at http://localhost:1000

### Summary Table
| Terminal | Folder | Command | URL |
|----------|--------|---------|-----|
| 1 | `researchpapersummizer_backend/research_backend` | `python manage.py runserver` | http://localhost:8000 |
| 2 | `researchpapersummizer` | `npm run dev` | http://localhost:1000 |

---

## 📁 Project Structure

```
researchpapersummizer/
├── components/              # React UI components
│   ├── ChatPage.tsx        # AI chat interface
│   ├── Dashboard.tsx       # Document management
│   ├── InsightPage.tsx     # Technical insights viewer
│   ├── LandingPage.tsx     # Home page
│   ├── LoginPage.tsx       # Authentication
│   ├── SearchPage.tsx      # Semantic search
│   ├── Sidebar.tsx         # Navigation
│   ├── SummarizerPage.tsx  # AI summary generator
│   └── UploadPage.tsx      # PDF upload
│
├── config/
│   └── firebaseConfig.ts   # Firebase configuration
│
├── contexts/
│   └── ThemeContext.tsx    # Dark/Light mode
│
├── services/
│   ├── authService.ts      # Firebase authentication
│   ├── geminiService.ts    # AI API calls
│   └── pdfService.ts       # PDF text extraction
│
├── utils/
│   ├── pdfExport.ts        # PDF generation
│   └── uuid.ts             # Unique ID generator
│
├── App.tsx                  # Main application
├── index.tsx               # React entry point
├── index.html              # HTML template
├── types.ts                # TypeScript interfaces
├── package.json            # Node.js dependencies
├── requirements.txt        # Python dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

---

## 🔧 Available Scripts

### Frontend (npm)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend (Python)
```bash
python manage.py runserver   # Start Django server
python manage.py migrate     # Apply database migrations
```

---

## 🌐 API Endpoints

Base URL: `https://researchpapersummizer-backend.onrender.com/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/summarize/` | POST | Generate AI summary from text |
| `/insights/` | POST | Extract technical insights |
| `/search/` | POST | Semantic search query |
| `/chat/` | POST | Context-aware Q&A |

---

## 🎨 Key Features Explained

### Client-Side PDF Parsing
PDFs are parsed in the browser using PDF.js, ensuring:
- **Privacy** — Documents never leave your device
- **Speed** — No upload/download latency
- **Offline** — Works without internet (for parsing only)

### Multi-Language Chat
The AI assistant supports:
- English (en-US)
- Hindi (hi-IN)
- Marathi (mr-IN)
- Hinglish (mixed)

### Voice Interaction
- **Speech-to-Text** — Speak your questions
- **Text-to-Speech** — AI reads responses aloud

---

## 📄 License

This project is licensed under the MIT License.

---
