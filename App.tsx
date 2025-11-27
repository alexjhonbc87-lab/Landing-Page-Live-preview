import React from 'react';
import { Sidebar } from './components/Sidebar';
import { ToolsNavigation } from './components/ToolsNavigation';
import { LandingPageGenerator } from './components/LandingPageGenerator';

export default function App() {
  return (
    <div className="flex h-screen bg-[#0f172a] font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0f172a]">
        
        {/* Header / Banner Area */}
        <div className="bg-[#0f172a] px-8 pt-6 pb-2 flex-shrink-0">
           <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">Lead Gen & Content</h1>
              <button className="bg-[#1e293b] hover:bg-[#2d3b55] text-gray-300 px-4 py-1.5 rounded-md text-sm border border-gray-700 transition-colors">
                Notebook
              </button>
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