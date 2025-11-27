import React from 'react';
import { 
  BookOpen, 
  Mic, 
  Presentation, 
  MonitorPlay, 
  Video, 
  CalendarCheck, 
  Sparkles, 
  Bot, 
  UserCircle,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface SidebarProps {
  user?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const menuItems = [
    { label: 'Generator', icon: LayoutGrid, active: false },
    { label: 'Video Script Generator', icon: Video, active: false },
    { label: 'AI Image Generator', icon: Sparkles, active: false },
    { label: 'Book Studio', icon: BookOpen, active: false },
    { label: 'Podcast Studio', icon: Mic, active: false },
    { label: 'Stage Selling', icon: Presentation, active: false },
    { label: 'Keynote Studio', icon: MonitorPlay, active: false },
    { label: 'TED Talk Studio', icon: Video, active: false },
    { label: 'Events & Delivery', icon: CalendarCheck, active: false },
    { label: 'AI Reinforced Training', icon: Sparkles, active: false },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div className="w-64 bg-[#0B1019] text-gray-400 flex flex-col h-full border-r border-gray-800 flex-shrink-0">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-pink-500 text-xl font-bold tracking-wider">MODEL 3.3</h1>
        <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">Project Starlit</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button 
                className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white group ${item.active ? 'bg-gray-800 text-white border-l-4 border-pink-500' : ''}`}
              >
                <item.icon className="w-5 h-5 mr-3 group-hover:text-pink-400 transition-colors" />
                <span className="text-left">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 px-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Coaches</h3>
          <button className="w-full flex items-center py-2 text-sm font-medium hover:text-white transition-colors">
            <Bot className="w-5 h-5 mr-3" />
            AI Coaches
          </button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 bg-[#0f1520] border-t border-gray-800">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate w-full">
              {user?.email ? user.email.split('@')[0] : 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate w-full">
              {user?.email || 'No email'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center text-sm font-medium hover:text-white transition-colors text-gray-400"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};