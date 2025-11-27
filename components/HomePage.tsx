import React from 'react';
import { Sparkles, Zap, Layout, ArrowRight, Check, Rocket, Code, Smartphone, ChevronRight } from 'lucide-react';

interface HomePageProps {
  onEnterApp: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-violet-500/30 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-800/50 supports-[backdrop-filter]:bg-[#0f172a]/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Project Starlit</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#demo" className="hover:text-white transition-colors duration-200">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </nav>

          <button
            onClick={onEnterApp}
            className="group bg-white text-[#0f172a] hover:bg-gray-100 px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-xl shadow-white/10 flex items-center"
          >
            Add AI Landing Page Builder
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none opacity-60" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-8 hover:bg-violet-900/40 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-violet-400 mr-2 animate-pulse" />
            New: Model 3.3 Engine Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-sm">
            Build High-Converting <br className="hidden md:block" />
            Landing Pages with AI
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Generate production-ready landing pages, sales copy, and email sequences in seconds. 
            No coding required. Deployed globally instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl font-bold text-lg shadow-lg shadow-violet-900/40 transition-all flex items-center justify-center group"
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
              Launch Studio
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700 hover:border-gray-600 backdrop-blur-sm rounded-xl font-semibold text-lg text-white transition-all flex items-center justify-center">
              View Demo
            </button>
          </div>
          
          {/* UI Preview Mockup */}
          <div className="mt-20 rounded-2xl border border-gray-800 bg-[#0B1019] p-2 shadow-2xl shadow-violet-900/20 max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-700">
             <div className="rounded-xl overflow-hidden border border-gray-800/50 bg-[#0f172a]">
               <div className="h-10 bg-[#1f2937] border-b border-gray-700 flex items-center px-4 space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="mx-auto bg-black/20 px-32 py-1.5 rounded-md">
                    <div className="h-2 w-20 bg-gray-600/50 rounded-full"></div>
                  </div>
               </div>
               <div className="relative h-[400px] md:h-[500px] flex items-center justify-center bg-[#0f1520]">
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-0 grid grid-cols-12 gap-4 p-6 opacity-50">
                     <div className="col-span-3 h-full bg-gray-800/20 rounded-lg border border-gray-800/50"></div>
                     <div className="col-span-9 h-full bg-gray-800/20 rounded-lg border border-gray-800/50 flex flex-col p-6">
                        <div className="w-32 h-8 bg-gray-700/50 rounded mb-8"></div>
                        <div className="w-full h-64 bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-700/50 flex items-center justify-center">
                           <Layout className="w-12 h-12 text-gray-600" />
                        </div>
                     </div>
                  </div>
                  <div className="relative z-10 text-center bg-[#1f2937]/90 backdrop-blur-md p-8 rounded-2xl border border-gray-600/50 shadow-2xl">
                     <Sparkles className="w-12 h-12 text-violet-500 mx-auto mb-4 animate-pulse" />
                     <h3 className="text-xl font-bold text-white mb-2">Model 3.3 Active</h3>
                     <p className="text-gray-400 text-sm mb-6">AI Agent is ready to generate your site.</p>
                     <button onClick={onEnterApp} className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                        Enter Dashboard
                     </button>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Information / Features Section */}
      <section id="features" className="py-32 bg-[#0B1019] relative">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to scale</h2>
              <p className="text-xl text-gray-400">From idea to deployed site in under 60 seconds.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Zap}
                title="Lightning Fast Generation"
                description="Powered by Gemini 2.5 Flash, generating complete layouts and copy faster than you can blink."
              />
              <FeatureCard 
                icon={Code}
                title="Clean HTML5 & Tailwind"
                description="Export production-ready code. No lock-in. Host anywhere including Vercel, Netlify, or GitHub Pages."
              />
              <FeatureCard 
                icon={Smartphone}
                title="Mobile Responsive"
                description="Every page is automatically optimized for mobile, tablet, and desktop views."
              />
           </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" className="py-32 relative bg-[#0f172a]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-400">Start for free, upgrade when you scale.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               <PricingCard 
                 title="Starter" 
                 price="$0" 
                 features={['3 Landing Pages', 'Basic AI Generation', 'Standard Templates', 'Community Support']} 
                 active={false}
                 onSelect={onEnterApp}
               />
               <PricingCard 
                 title="Pro" 
                 price="$29" 
                 period="/mo"
                 features={['Unlimited Pages', 'Advanced AI Models', 'Custom Code Export', 'Priority Support', 'Remove Watermark']} 
                 active={true}
                 popular
                 onSelect={onEnterApp}
               />
               <PricingCard 
                 title="Enterprise" 
                 price="Custom" 
                 features={['API Access', 'Custom AI Training', 'Team Collaboration', 'Dedicated Manager']} 
                 active={false}
                 onSelect={onEnterApp}
               />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1019] border-t border-gray-800 py-16">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <span className="font-bold text-lg">Project Starlit</span>
               </div>
               <p className="text-gray-500 text-sm leading-relaxed">
                  Empowering creators with next-gen AI tools for marketing and development. Built with ❤️ for builders.
               </p>
            </div>
            <div>
               <h4 className="font-bold text-white mb-6">Product</h4>
               <ul className="space-y-4 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Templates</a></li>
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Integrations</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-white mb-6">Resources</h4>
               <ul className="space-y-4 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-violet-400 transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Community</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-white mb-6">Legal</h4>
               <ul className="space-y-4 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
            <p>© 2024 Project Starlit. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-gray-400">Twitter</a>
               <a href="#" className="hover:text-gray-400">GitHub</a>
               <a href="#" className="hover:text-gray-400">Discord</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group p-8 rounded-2xl bg-[#161b26] border border-gray-800 hover:border-violet-500/50 hover:bg-[#1c2230] transition-all duration-300">
     <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors">
        <Icon className="w-6 h-6 text-violet-400" />
     </div>
     <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
     <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const PricingCard = ({ title, price, period = "", features, active, popular, onSelect }: { title: string, price: string, period?: string, features: string[], active: boolean, popular?: boolean, onSelect: () => void }) => (
   <div className={`p-8 rounded-2xl border relative flex flex-col h-full transform transition-transform hover:-translate-y-1 ${active ? 'bg-[#161b26] border-violet-500 shadow-xl shadow-violet-900/20' : 'bg-[#0f172a] border-gray-800 hover:border-gray-700'}`}>
      {popular && (
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
            Most Popular
         </div>
      )}
      <h3 className="text-lg font-medium text-gray-400 mb-2">{title}</h3>
      <div className="mb-6 flex items-baseline">
         <span className="text-4xl font-bold text-white">{price}</span>
         <span className="text-gray-500 ml-1">{period}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
         {features.map((feat, i) => (
            <li key={i} className="flex items-start text-sm text-gray-300">
               <Check className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${active ? 'text-violet-500' : 'text-gray-600'}`} />
               {feat}
            </li>
         ))}
      </ul>
      <button 
        onClick={onSelect}
        className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center ${active ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
      >
         Choose {title}
         <ChevronRight className="w-4 h-4 ml-1" />
      </button>
   </div>
);