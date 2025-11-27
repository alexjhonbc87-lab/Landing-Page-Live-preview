import React from 'react';
import { Sparkles, Zap, Layout, ArrowRight, Check, Rocket, Code, Smartphone } from 'lucide-react';

interface HomePageProps {
  onEnterApp: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-violet-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Project Starlit</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </nav>

          <button
            onClick={onEnterApp}
            className="group bg-white text-[#0f172a] hover:bg-gray-100 px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-xl flex items-center"
          >
            Add AI Landing Page Builder
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-900/30 border border-violet-700/50 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-violet-400 mr-2 animate-pulse" />
            New: Model 3.3 Engine Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Build High-Converting <br className="hidden md:block" />
            Landing Pages with AI
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Generate production-ready landing pages, sales copy, and email sequences in seconds. 
            No coding required. Deployed globally instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl font-bold text-lg shadow-lg shadow-violet-900/40 transition-all flex items-center justify-center"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Launch Studio
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 rounded-xl font-semibold text-lg text-white transition-all">
              View Demo
            </button>
          </div>
          
          {/* UI Preview Mockup */}
          <div className="mt-20 rounded-2xl border border-gray-800 bg-[#0B1019] p-4 shadow-2xl shadow-violet-900/20 max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
             <div className="h-8 bg-[#1f2937] rounded-t-lg mb-2 flex items-center px-4 space-x-2 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
             </div>
             <div className="bg-[#0f172a] rounded-lg h-[300px] md:h-[400px] flex items-center justify-center border border-gray-800/50">
                <div className="text-center">
                   <Layout className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                   <p className="text-gray-500 font-medium">Model 3.3 Interface Preview</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Information / Features Section */}
      <section id="features" className="py-24 bg-[#0B1019]">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
              <p className="text-gray-400">From idea to deployed site in under 60 seconds.</p>
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
      <section id="pricing" className="py-24 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-400">Start for free, upgrade when you scale.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               <PricingCard 
                 title="Starter" 
                 price="$0" 
                 features={['3 Landing Pages', 'Basic AI Generation', 'Standard Templates', 'Community Support']} 
                 active={false}
               />
               <PricingCard 
                 title="Pro" 
                 price="$29" 
                 period="/mo"
                 features={['Unlimited Pages', 'Advanced AI Models', 'Custom Code Export', 'Priority Support', 'Remove Watermark']} 
                 active={true}
                 popular
               />
               <PricingCard 
                 title="Enterprise" 
                 price="Custom" 
                 features={['API Access', 'Custom AI Training', 'Team Collaboration', 'Dedicated Manager']} 
                 active={false}
               />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1019] border-t border-gray-800 py-12">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <span className="font-bold text-lg">Project Starlit</span>
               </div>
               <p className="text-gray-500 text-sm">
                  Empowering creators with next-gen AI tools for marketing and development.
               </p>
            </div>
            <div>
               <h4 className="font-bold mb-4">Product</h4>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Templates</a></li>
                  <li><a href="#" className="hover:text-white">Integrations</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Resources</h4>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">API Reference</a></li>
                  <li><a href="#" className="hover:text-white">Community</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Legal</h4>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-600 text-sm">
            © 2024 Project Starlit. All rights reserved.
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-6 rounded-2xl bg-[#161b26] border border-gray-800 hover:border-violet-500/50 transition-colors">
     <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-violet-400" />
     </div>
     <h3 className="text-xl font-bold mb-3">{title}</h3>
     <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const PricingCard = ({ title, price, period = "", features, active, popular }: { title: string, price: string, period?: string, features: string[], active: boolean, popular?: boolean }) => (
   <div className={`p-8 rounded-2xl border relative flex flex-col ${active ? 'bg-[#161b26] border-violet-500 shadow-xl shadow-violet-900/20' : 'bg-[#0f172a] border-gray-800'}`}>
      {popular && (
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
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
            <li key={i} className="flex items-center text-sm text-gray-300">
               <Check className={`w-4 h-4 mr-3 ${active ? 'text-violet-500' : 'text-gray-600'}`} />
               {feat}
            </li>
         ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold transition-all ${active ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
         Choose {title}
      </button>
   </div>
);
