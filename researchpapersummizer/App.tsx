
import React, { useState, useEffect } from 'react';
import { AppView, ResearchDocument } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import SummarizerPage from './components/SummarizerPage';
import InsightPage from './components/InsightPage';
import SearchPage from './components/SearchPage';
import ChatPage from './components/ChatPage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResearchReadiness from './components/ResearchReadiness';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import authService from './services/authService';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  uid: string;
  username: string;
  email: string;
  photoURL?: string | null;
}

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is logged in
        const userData: User = {
          uid: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL
        };
        setUser(userData);
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        // User is logged out
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Load documents from local storage
  useEffect(() => {
    const saved = localStorage.getItem('research_docs');
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save documents to local storage
  useEffect(() => {
    localStorage.setItem('research_docs', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (doc: ResearchDocument) => {
    setDocuments(prev => [...prev, doc]);
    setCurrentView(AppView.DASHBOARD);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDocId === id) setSelectedDocId(null);
  };

  const updateDocument = (updatedDoc: ResearchDocument) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  const handleLogin = (firebaseUser: FirebaseUser) => {
    const userData: User = {
      uid: firebaseUser.uid,
      username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL
    };
    setUser(userData);
    setIsAuthenticated(true);
    setShowLogin(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView(AppView.LANDING);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentView(AppView.DASHBOARD);
    } else {
      setShowLogin(true);
    }
  };

  const selectedDocument = documents.find(d => d.id === selectedDocId) || null;

  // Show loading while checking auth state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600 dark:text-blue-400 mb-4"></i>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if user clicks "Get Started" and not authenticated
  if (showLogin && !isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show landing page if not authenticated and haven't clicked "Get Started"
  if (!isAuthenticated && currentView === AppView.LANDING) {
    return <LandingPage onStart={handleGetStarted} />;
  }

  // Show landing page if authenticated and on landing view
  if (currentView === AppView.LANDING) {
    return <LandingPage onStart={handleGetStarted} />;
  }


  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Top Header */}
        <HeaderWithTheme
          currentView={currentView}
          documentsCount={documents.length}
          user={user}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
          {currentView === AppView.DASHBOARD && (
            <Dashboard
              documents={documents}
              onDelete={deleteDocument}
              onSelect={(id) => {
                setSelectedDocId(id);
                setCurrentView(AppView.SUMMARIZER);
              }}
              onUploadClick={() => setCurrentView(AppView.UPLOAD)}
            />
          )}

          {currentView === AppView.UPLOAD && (
            <UploadPage onUploadComplete={addDocument} />
          )}

          {currentView === AppView.SUMMARIZER && (
            <SummarizerPage
              documents={documents}
              selectedDocId={selectedDocId}
              onSelectDoc={setSelectedDocId}
              onUpdateDoc={updateDocument}
            />
          )}

          {currentView === AppView.INSIGHTS && (
            <InsightPage
              documents={documents}
              selectedDocId={selectedDocId}
              onSelectDoc={setSelectedDocId}
              onUpdateDoc={updateDocument}
            />
          )}

          {currentView === AppView.SEARCH && (
            <SearchPage documents={documents} />
          )}

          {currentView === AppView.CHAT && (
            <ChatPage
              documents={documents}
              selectedDocId={selectedDocId}
              onSelectDoc={setSelectedDocId}
              onUpdateDoc={updateDocument}
            />
          )}

          {currentView === AppView.RESEARCH_READINESS && (
            <ResearchReadiness
              document={selectedDocument}
              documents={documents}
              onSelectDoc={setSelectedDocId}
              onBack={() => setCurrentView(AppView.DASHBOARD)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// Header component with theme toggle
const HeaderWithTheme: React.FC<{
  currentView: AppView;
  documentsCount: number;
  user: User | null;
  onToggleSidebar: () => void;
  onLogout: () => void;
}> = ({ currentView, documentsCount, user, onToggleSidebar, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm z-10 shrink-0 transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 transition-colors"
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate transition-colors">
          {currentView.charAt(0) + currentView.slice(1).toLowerCase()}
        </h1>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <span className="hidden md:inline text-sm text-slate-500 dark:text-slate-400">
          {documentsCount} Papers Tracked
        </span>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110 group"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <i className="fa-solid fa-moon text-slate-700 group-hover:text-blue-600 transition-colors"></i>
          ) : (
            <i className="fa-solid fa-sun text-yellow-400 group-hover:text-yellow-500 transition-colors"></i>
          )}
        </button>

        {/* User Menu */}
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 cursor-pointer hover:scale-110 transition-transform">
            {user?.username.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user?.username}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main App wrapped in ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
