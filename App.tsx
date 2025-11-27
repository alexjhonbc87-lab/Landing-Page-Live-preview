
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ToolsNavigation } from './components/ToolsNavigation';
import { LandingPageGenerator } from './components/LandingPageGenerator';
import { HomePage } from './components/HomePage';
import { AuthModal } from './components/AuthModal';
import { PublicPageViewer } from './components/PublicPageViewer';
import { auth } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Simple Route State
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [publicPageId, setPublicPageId] = useState<string | null>(null);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle URL Routing for Public Pages (/page/:id)
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      
      // Match /page/XYZ
      const match = path.match(/^\/page\/([a-zA-Z0-9-]+)$/);
      if (match && match[1]) {
        setPublicPageId(match[1]);
      } else {
        setPublicPageId(null);
      }
    };

    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  // Handle Shared Links for Unauthenticated Users (?s=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('s') && !loading && !user && !publicPageId) {
      setIsLoginView(true);
      setShowAuthModal(true);
    }
  }, [loading, user, publicPageId]);

  const handleEnterApp = () => {
    if (user) return;
    setIsLoginView(false);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  // 1. If it's a public page route, show the viewer (Auth not required)
  if (publicPageId) {
    return <PublicPageViewer pageId={publicPageId} />;
  }

  // 2. If NOT logged in, show Home Page
  if (!user) {
    return (
      <>
        <HomePage onEnterApp={handleEnterApp} />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          defaultIsLogin={isLoginView}
        />
      </>
    );
  }

  // 3. Protected Dashboard
  return (
    <div className="flex h-screen bg-[#0f172a] font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0f172a]">
        
        {/* Header / Banner Area */}
        <div className="bg-[#0f172a] px-8 pt-6 pb-2 flex-shrink-0">
           <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">Lead Gen & Content</h1>
              <div className="flex items-center space-x-3">
                 <button className="bg-[#1e293b] hover:bg-[#2d3b55] text-gray-300 px-4 py-1.5 rounded-md text-sm border border-gray-700 transition-colors">
                   Notebook
                 </button>
              </div>
           </div>
           
           {/* Purple Gradient Banner */}
           <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-lg p-4 text-white shadow-lg mb-2">
             <p className="font-medium text-sm">
               A unified workspace for lead generation and content creation. Build landing pages, generate content ideas, craft outreach sequences, and more.
             </p>
           </div>
        </div>

        {/* Tools Navigation Bar */}
        <ToolsNavigation />

        {/* Dynamic Tool Content */}
        <LandingPageGenerator />
        
      </div>
    </div>
  );
}
