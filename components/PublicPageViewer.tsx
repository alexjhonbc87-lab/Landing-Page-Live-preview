
import React, { useEffect, useState } from 'react';
import { getLandingPageById, LandingPageDocument } from '../services/landingPageService';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

interface PublicPageViewerProps {
  pageId: string;
}

export const PublicPageViewer: React.FC<PublicPageViewerProps> = ({ pageId }) => {
  const [page, setPage] = useState<LandingPageDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const doc = await getLandingPageById(pageId);
        if (doc && doc.isPublic) {
          setPage(doc);
        } else {
          setError("Page not found or is currently private.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load the page. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center text-center p-6">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">404 Not Found</h1>
        <p className="text-gray-400 max-w-md">{error || "The landing page you are looking for does not exist."}</p>
        <a href="/" className="mt-8 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
          Create your own page
        </a>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden relative">
      <iframe 
        title={page.title}
        srcDoc={page.htmlContent}
        className="flex-1 w-full h-full border-none"
        sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
      />
      
      {/* Branding Badge */}
      <a 
        href="/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-[#0f172a] text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center shadow-lg hover:bg-[#1e293b] transition-colors z-50 border border-gray-700"
      >
        <Sparkles className="w-3 h-3 text-violet-500 mr-2" />
        Built with Project Starlit
      </a>
    </div>
  );
};
