import React from 'react';
import { PenTool, Layout, Type, Mail, Megaphone, Send, BarChart2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export const ToolsNavigation: React.FC = () => {
  const tools = [
    { id: 'landing', name: 'New Landing Page', icon: PenTool, active: true },
    { id: 'pages', name: 'My Pages', icon: Layout, active: false },
    { id: 'headline', name: 'Headline Generator', icon: Type, active: false },
    { id: 'email', name: 'Email Sequence Writer', icon: Mail, active: false },
    { id: 'ad', name: 'Ad Copy Generator', icon: Megaphone, active: false },
    { id: 'outreach', name: 'Outreach Assistant', icon: Send, active: false },
    { id: 'dashboard', name: 'Lead Dashboard', icon: BarChart2, active: false },
    { id: 'content', name: 'Content Planner', icon: FileText, active: false },
  ];

  return (
    <div className="w-full bg-[#0f172a] border-b border-gray-800 py-4 px-6 relative">
      <div className="flex items-center text-gray-500 text-xs font-bold tracking-wider mb-3 uppercase">
        Tools
      </div>
      
      <div className="relative group">
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`
                flex items-center px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all border
                ${tool.active 
                  ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-900/50' 
                  : 'bg-[#1e293b] text-gray-300 border-gray-700 hover:bg-[#2d3b55] hover:border-gray-600'}
              `}
            >
              <tool.icon className="w-4 h-4 mr-2" />
              {tool.name}
            </button>
          ))}
        </div>
        
        {/* Scroll Indicators (Visual only for this demo) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0f172a] to-transparent pointer-events-none md:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none md:hidden" />
      </div>
      
      {/* Scroll Bar Visual */}
      <div className="w-full bg-gray-800 h-2 rounded-full mt-3 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gray-500 rounded-full" />
      </div>
    </div>
  );
};
