import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Eye, 
  ExternalLink, 
  Pencil,
  Wand2,
  Loader2,
  Rocket,
  CheckCircle2,
  Globe,
  X,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ViewMode, LandingPageFormData } from '../types';
import { generateLandingPage } from '../services/geminiService';

export const LandingPageGenerator: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DESKTOP);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployStep, setDeployStep] = useState(0); // 0: Config, 1: Deploying, 2: Success
  const [liveUrl, setLiveUrl] = useState<string>("");
  const [showSeoSettings, setShowSeoSettings] = useState(false);
  
  const [formData, setFormData] = useState<LandingPageFormData>({
    pageName: '',
    pageType: 'General Sales',
    offerDescription: '',
    targetAudience: '',
    metaDescription: '',
    keywords: '',
    subdomain: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.offerDescription) {
        alert("Please enter a product description.");
        return;
    }

    setIsLoading(true);
    setGeneratedHtml(null); // Clear previous result to show loading state clearly
    try {
      const html = await generateLandingPage(formData);
      setGeneratedHtml(html);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeployModal = () => {
    if (!generatedHtml) return;
    // Generate a default subdomain if not set
    if (!formData.subdomain) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const sanitizedName = formData.pageName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'my-page';
      
      setFormData(prev => ({...prev, subdomain: `${sanitizedName}-${randomSuffix}`}));
    }
    setDeployStep(0);
    setShowDeployModal(true);
  };

  const confirmDeploy = () => {
    setDeployStep(1);

    // Simulate deployment process
    setTimeout(() => {
      // Create a Blob URL to simulate a hosted site for the "Visit" button
      const blob = new Blob([generatedHtml || ''], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setLiveUrl(url);
      setDeployStep(2);
    }, 2000);
  };

  const closeDeployModal = () => {
    setShowDeployModal(false);
    setDeployStep(0);
  };

  const handleLivePreview = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full relative">
      {/* Left Panel: Inputs */}
      <div className="w-[400px] bg-[#0B1019] text-gray-200 border-r border-gray-800 overflow-y-auto flex flex-col flex-shrink-0 custom-scrollbar">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start mb-2">
            <div className="bg-violet-600 p-2 rounded-lg mr-3 text-white shadow-lg shadow-violet-900/20">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">New Landing Page</h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Generate and build a high-converting landing page from scratch.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Page Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Page Name</label>
            <input
              type="text"
              name="pageName"
              value={formData.pageName}
              onChange={handleInputChange}
              placeholder="e.g., My First Sales Page"
              className="w-full px-4 py-3 bg-[#1e293b] border border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-sm text-white"
            />
          </div>

          {/* Page Type */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Landing Page Type</label>
            <div className="relative">
              <select
                name="pageType"
                value={formData.pageType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1e293b] border border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm text-white cursor-pointer"
              >
                <option>General Sales</option>
                <option>Webinar Registration</option>
                <option>Lead Magnet Opt-in</option>
                <option>Product Launch</option>
                <option>Waitlist</option>
                <option>Mobile App Showcase</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Offer / Product Description</label>
            <textarea
              name="offerDescription"
              value={formData.offerDescription}
              onChange={handleInputChange}
              rows={5}
              placeholder="e.g., A 6-week live coaching program for new freelance writers looking to scale their business..."
              className="w-full px-4 py-3 bg-[#1e293b] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none resize-none text-sm placeholder-gray-500 leading-relaxed"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Audience</label>
            <textarea
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g., Aspiring writers who want to quit their 9-5."
              className="w-full px-4 py-3 bg-[#1e293b] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none resize-none text-sm placeholder-gray-500"
            />
          </div>

          {/* SEO & Advanced Settings */}
          <div className="border border-gray-700 rounded-lg bg-[#161f32]">
             <button 
                onClick={() => setShowSeoSettings(!showSeoSettings)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-gray-300 uppercase tracking-wider hover:bg-[#1e293b] transition-colors rounded-lg"
             >
                <div className="flex items-center">
                   <Settings className="w-4 h-4 mr-2 text-gray-400" />
                   Advanced SEO & Metadata
                </div>
                {showSeoSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
             </button>
             
             {showSeoSettings && (
                <div className="px-4 pb-4 space-y-4 pt-2 border-t border-gray-700">
                   <div>
                      <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Brief summary for search engines..."
                        className="w-full px-3 py-2 bg-[#0B1019] text-white border border-gray-700 rounded focus:ring-1 focus:ring-violet-500 outline-none resize-none text-xs"
                      />
                   </div>
                   <div>
                      <label className="block text-xs text-gray-500 mb-1">Keywords (comma separated)</label>
                      <input
                        type="text"
                        name="keywords"
                        value={formData.keywords}
                        onChange={handleInputChange}
                        placeholder="marketing, sales, course..."
                        className="w-full px-3 py-2 bg-[#0B1019] text-white border border-gray-700 rounded focus:ring-1 focus:ring-violet-500 outline-none text-xs"
                      />
                   </div>
                </div>
             )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-violet-900/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Page...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Landing Page</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 bg-[#0f1520] p-6 flex flex-col overflow-hidden relative">
        
        {/* Preview Container Wrapper */}
        <div className="flex-1 bg-[#1e293b] rounded-xl flex flex-col border border-gray-800 overflow-hidden shadow-2xl relative">
          
          {/* Preview Toolbar */}
          <div className="h-14 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-4 z-10">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
            </div>

            <div className="flex items-center bg-[#1f2937] rounded-lg p-1 border border-gray-700">
              <button 
                onClick={() => setViewMode(ViewMode.DESKTOP)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.DESKTOP ? 'bg-violet-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.TABLET)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.TABLET ? 'bg-violet-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.MOBILE)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.MOBILE ? 'bg-violet-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
               <button 
                  onClick={handleLivePreview}
                  disabled={!generatedHtml}
                  className={`flex items-center px-3 py-1.5 transition-colors text-xs font-medium ${generatedHtml ? 'text-gray-300 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                  title="Open in new tab"
               >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Live Preview
               </button>
               <button 
                  onClick={openDeployModal}
                  disabled={!generatedHtml}
                  className={`flex items-center px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    generatedHtml 
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-white/10' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
               >
                  <Rocket className="w-3 h-3 mr-2" />
                  Deploy
               </button>
            </div>
          </div>

          {/* Editor Mode Bar */}
          <div className="bg-[#111827] py-1 text-center border-b border-gray-800">
             <div className="flex items-center justify-center text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                <Pencil className="w-3 h-3 mr-1.5" />
                Live Editor Mode
             </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-[#0f1520] relative overflow-hidden flex justify-center items-start pt-8 pb-8 custom-scrollbar overflow-y-auto w-full">
            
            {generatedHtml ? (
              <div 
                className={`transition-all duration-300 ease-in-out bg-white shadow-2xl ${
                  viewMode === ViewMode.MOBILE ? 'w-[375px] h-[667px] rounded-2xl border-[8px] border-gray-800' :
                  viewMode === ViewMode.TABLET ? 'w-[768px] h-[1024px] rounded-xl border-[8px] border-gray-800' :
                  'w-full h-full max-w-full rounded-none border-none'
                }`}
              >
                <iframe
                  title="Generated Preview"
                  srcDoc={generatedHtml}
                  className="w-full h-full bg-white"
                  sandbox="allow-scripts"
                  style={{ border: 'none' }}
                />
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center max-w-md">
                  {isLoading ? (
                     <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Wand2 className="w-6 h-6 text-violet-500" />
                          </div>
                        </div>
                        <p className="text-xl font-bold text-white mt-6">Generating Page...</p>
                        <p className="text-sm text-gray-400 mt-2">Writing code, optimizing layout, and styling...</p>
                     </div>
                  ) : (
                     <>
                       <div className="w-24 h-24 bg-[#1e293b] rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-gray-700">
                          <Rocket className="w-10 h-10 text-gray-500" />
                       </div>
                       <h3 className="text-xl font-semibold text-white mb-2">Ready to Build</h3>
                       <p className="text-gray-400 leading-relaxed">
                         Fill out the details on the left sidebar to generate a complete, high-converting landing page in seconds.
                       </p>
                     </>
                  )}
               </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-violet-500" />
                  Deploy to Web
                </h3>
                <button onClick={closeDeployModal} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 0: Configuration */}
              {deployStep === 0 && (
                <div className="py-2">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Custom Subdomain</label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleInputChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none border-t border-b border-gray-600 bg-[#0B1019] text-white focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                        placeholder="my-awesome-page"
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                        .starlit-pages.app
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Choose a unique address for your landing page.</p>
                  </div>
                  
                  <div className="bg-[#0f1520] p-4 rounded-lg border border-gray-700 mb-6">
                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Deploy Summary</h4>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">SEO Meta Tags</span>
                        <span className={formData.metaDescription ? "text-green-500" : "text-gray-600"}>{formData.metaDescription ? "Included" : "None"}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Environment</span>
                        <span className="text-white">Production Edge</span>
                     </div>
                  </div>

                  <div className="flex w-full space-x-3">
                    <button 
                      onClick={confirmDeploy}
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Publish Now
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Loading */}
              {deployStep === 1 && (
                <div className="py-10 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                     <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 rounded-full"></div>
                     <Loader2 className="w-16 h-16 text-violet-500 animate-spin relative z-10" />
                  </div>
                  <h4 className="text-white font-medium text-lg">Deploying to Global Edge...</h4>
                  <p className="text-gray-400 text-sm mt-2">Optimizing assets, verifying DNS, and propagating.</p>
                </div>
              )}

              {/* Step 2: Success */}
              {deployStep === 2 && (
                <div className="py-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-green-500/50">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-white font-bold text-xl">Deployment Successful!</h4>
                  <p className="text-gray-400 text-sm mt-2 mb-6">Your landing page is now live and accessible worldwide.</p>
                  
                  <div className="w-full bg-[#0f1520] p-4 rounded-lg border border-gray-700 flex items-center justify-between mb-6 group cursor-pointer hover:border-violet-500 transition-colors" onClick={() => window.open(liveUrl, '_blank')}>
                    <div className="flex flex-col items-start overflow-hidden mr-4">
                       <span className="text-xs text-gray-500 mb-1">Live URL</span>
                       <span className="text-violet-400 text-sm font-mono truncate w-full text-left">
                         https://{formData.subdomain || 'site'}.starlit-pages.app
                       </span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white" />
                  </div>

                  <div className="flex w-full space-x-3">
                    <button 
                      onClick={() => window.open(liveUrl, '_blank')}
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-violet-900/40"
                    >
                      Visit Live Site
                    </button>
                    <button 
                      onClick={closeDeployModal}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      Back to Editor
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {deployStep === 2 && (
              <div className="bg-[#111827] px-6 py-3 border-t border-gray-800 flex justify-between items-center">
                <p className="text-xs text-center text-gray-500 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Status: Operational
                </p>
                <span className="text-xs text-gray-600 font-mono">v1.0.0</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};