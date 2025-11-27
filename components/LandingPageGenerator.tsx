import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
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
  ChevronUp,
  Download,
  Eye,
  Layout,
  Code,
  Share2,
  Copy,
  Check,
  AlertTriangle
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
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [formData, setFormData] = useState<LandingPageFormData>({
    pageName: '',
    pageType: 'General Sales',
    offerDescription: '',
    targetAudience: '',
    metaDescription: '',
    keywords: '',
    subdomain: ''
  });

  // Check for shared URL on mount
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const sharedData = url.searchParams.get('s');
      
      if (sharedData) {
        // Decode the state from the URL: Base64 -> URI Component -> JSON
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        
        // Update form state
        setFormData(prev => ({ ...prev, ...decoded }));
        
        // Auto-generate the page for the visitor
        generateWithData(decoded);
      }
    } catch (e) {
      console.error("Failed to parse shared data", e);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWithData = async (data: LandingPageFormData) => {
    setIsLoading(true);
    try {
      const html = await generateLandingPage(data);
      setGeneratedHtml(html);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.offerDescription) {
        alert("Please enter a product description.");
        return;
    }
    await generateWithData(formData);
  };

  const openDeployModal = () => {
    if (!generatedHtml) return;
    if (!formData.subdomain) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const sanitizedName = formData.pageName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'page';
      
      setFormData(prev => ({...prev, subdomain: `${sanitizedName}-${randomSuffix}`}));
    }
    setDeployStep(0);
    setShowDeployModal(true);
  };

  const confirmDeploy = () => {
    setDeployStep(1);

    // Simulate deployment process
    setTimeout(() => {
      // Create a Blob URL to simulate a hosted site for the user immediately
      const blob = new Blob([generatedHtml || ''], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setLiveUrl(url);
      setDeployStep(2);
    }, 2000);
  };

  const closeDeployModal = () => {
    setShowDeployModal(false);
    setDeployStep(0);
    setCopySuccess(false);
  };

  const handleLivePreview = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html'; // Save as index.html for easy GitHub Pages deployment
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate the shareable public link robustly
  const getShareUrl = () => {
    try {
      // Clean the current URL to just the base
      const url = new URL(window.location.href);
      
      // Remove any existing query params to start fresh
      url.search = '';
      url.hash = '';

      // Create the state string
      const stateString = JSON.stringify(formData);
      const encoded = btoa(encodeURIComponent(stateString));
      
      // Set the parameter
      url.searchParams.set('s', encoded);
      
      return url.toString();
    } catch (e) {
      return "Error generating link";
    }
  };

  const copyShareLink = () => {
    const url = getShareUrl();
    if (url && url !== "Error generating link") {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full relative bg-[#0B1019]">
      {/* Left Panel: Inputs */}
      <div className="w-[420px] bg-[#0B1019] border-r border-gray-800 overflow-y-auto flex flex-col flex-shrink-0 custom-scrollbar z-10 shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center mb-1">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">New Landing Page</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Generate and build a high-converting landing page from scratch.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 pb-24">
          {/* Page Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Page Name</label>
            <input
              type="text"
              name="pageName"
              value={formData.pageName}
              onChange={handleInputChange}
              placeholder="e.g., My First Sales Page"
              className="w-full px-4 py-3 bg-[#161b26] border border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-600 text-sm text-white"
            />
          </div>

          {/* Page Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Landing Page Type</label>
            <div className="relative">
              <select
                name="pageType"
                value={formData.pageType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#161b26] border border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none appearance-none text-sm text-white cursor-pointer"
              >
                <option>General Sales</option>
                <option>Webinar Registration</option>
                <option>Lead Magnet Opt-in</option>
                <option>Product Launch</option>
                <option>Waitlist</option>
                <option>Mobile App Showcase</option>
                <option>SaaS Pricing Page</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Your Offer / Product Description</label>
            <textarea
              name="offerDescription"
              value={formData.offerDescription}
              onChange={handleInputChange}
              rows={5}
              placeholder="e.g., A 6-week live coaching program for new freelance writers looking to scale their business..."
              className="w-full px-4 py-3 bg-[#161b26] text-white border border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm placeholder-gray-600 leading-relaxed"
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Target Audience</label>
            <textarea
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g., Aspiring writers who want to quit their 9-5."
              className="w-full px-4 py-3 bg-[#161b26] text-white border border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm placeholder-gray-600"
            />
          </div>

          {/* SEO & Advanced Settings */}
          <div className="border border-gray-700 rounded-lg bg-[#161b26] overflow-hidden">
             <button 
                onClick={() => setShowSeoSettings(!showSeoSettings)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wide hover:bg-[#1f2937] transition-colors"
             >
                <div className="flex items-center">
                   <Settings className="w-3.5 h-3.5 mr-2" />
                   Advanced SEO & Metadata
                </div>
                {showSeoSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
             </button>
             
             {showSeoSettings && (
                <div className="px-4 pb-4 space-y-4 pt-2 border-t border-gray-700 bg-[#0B1019]">
                   <div className="pt-2">
                      <label className="block text-xs text-gray-500 mb-1.5">Meta Description</label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Brief summary for search engines..."
                        className="w-full px-3 py-2 bg-[#161b26] text-white border border-gray-700 rounded focus:ring-1 focus:ring-blue-500 outline-none resize-none text-xs"
                      />
                   </div>
                   <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Keywords (comma separated)</label>
                      <input
                        type="text"
                        name="keywords"
                        value={formData.keywords}
                        onChange={handleInputChange}
                        placeholder="marketing, sales, course..."
                        className="w-full px-3 py-2 bg-[#161b26] text-white border border-gray-700 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                      />
                   </div>
                </div>
             )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 border border-blue-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Page...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Landing Page</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 bg-[#0f1520] p-6 flex flex-col h-full overflow-hidden relative">
        
        {/* Preview Container Wrapper */}
        <div className="flex-1 bg-[#1e293b] rounded-xl flex flex-col border border-gray-700 overflow-hidden shadow-2xl relative">
          
          {/* Mac-style Window Header */}
          <div className="h-12 bg-[#111827] border-b border-gray-700 flex items-center justify-between px-4 z-10 flex-shrink-0">
            <div className="flex items-center space-x-2 w-1/3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1 bg-[#1f2937] rounded-lg p-1 border border-gray-700">
              <button 
                onClick={() => setViewMode(ViewMode.DESKTOP)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.DESKTOP ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.TABLET)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.TABLET ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.MOBILE)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.MOBILE ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-end space-x-3 w-1/3">
               <button 
                  onClick={handleLivePreview}
                  disabled={!generatedHtml}
                  className={`flex items-center px-3 py-1.5 rounded text-xs font-medium transition-colors ${generatedHtml ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 cursor-not-allowed'}`}
               >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Preview
               </button>
               <button 
                  onClick={openDeployModal}
                  disabled={!generatedHtml}
                  className={`flex items-center px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
                    generatedHtml 
                    ? 'bg-white text-gray-900 border-white hover:bg-gray-100' 
                    : 'bg-transparent text-gray-600 border-gray-700 cursor-not-allowed'
                  }`}
               >
                  <Rocket className="w-3.5 h-3.5 mr-2" />
                  Deploy
               </button>
            </div>
          </div>

          {/* Editor Mode Bar */}
          <div className="bg-[#111827] py-1 text-center border-b border-gray-800 flex-shrink-0">
             <div className="flex items-center justify-center text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                <Pencil className="w-3 h-3 mr-1.5" />
                EDITOR MODE
             </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-[#0f1520] relative overflow-hidden flex flex-col">
            <div className={`flex-1 overflow-auto custom-scrollbar flex ${viewMode !== ViewMode.DESKTOP ? 'items-center justify-center py-8 bg-[#0f1520]' : 'items-stretch'}`}>
              {generatedHtml ? (
                <div 
                  className={`transition-all duration-300 ease-in-out bg-white shadow-2xl flex-shrink-0 mx-auto ${
                    viewMode === ViewMode.MOBILE ? 'w-[375px] h-[667px] rounded-2xl border-[8px] border-[#2d3748] ring-1 ring-black' :
                    viewMode === ViewMode.TABLET ? 'w-[768px] h-[1024px] rounded-xl border-[8px] border-[#2d3748] ring-1 ring-black' :
                    'w-full min-h-full rounded-none border-none'
                  }`}
                >
                  <iframe
                    title="Generated Preview"
                    srcDoc={generatedHtml}
                    className="w-full h-full bg-white rounded-[inherit]"
                    sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                    style={{ border: 'none', display: 'block' }}
                  />
                </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center max-w-md mx-auto">
                    {isLoading ? (
                       <div className="flex flex-col items-center">
                          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                          <p className="text-lg font-medium text-white">Generating your site...</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {window.location.search.includes('?s=') ? 'Loading shared page...' : 'Writing HTML, configuring Tailwind, and polishing content.'}
                          </p>
                       </div>
                    ) : (
                       <div className="opacity-50 flex flex-col items-center">
                         <Layout className="w-16 h-16 text-gray-600 mb-4" />
                         <p className="text-sm text-gray-500">Your live preview will appear here once content is generated.</p>
                       </div>
                    )}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-500" />
                  Deploy Landing Page
                </h3>
                <button onClick={closeDeployModal} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 0: Configuration */}
              {deployStep === 0 && (
                <div className="py-2">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subdomain Configuration</label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleInputChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none border-t border-b border-gray-600 bg-[#0B1019] text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                        .starlit.app
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-[#0f1520] p-4 rounded-lg border border-gray-700 mb-6">
                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Deployment Target</h4>
                     <div className="flex items-center justify-center text-center p-3 border border-gray-800 rounded bg-[#161b26] mb-2">
                        <Code className="w-5 h-5 text-gray-400 mb-1 mx-auto" />
                        <span className="text-white text-sm font-semibold">Standalone HTML5</span>
                        <p className="text-[10px] text-gray-500 mt-1">Universal Compatibility</p>
                     </div>
                     <p className="text-xs text-gray-500 mt-2 text-center">
                       Uses Tailwind CDN for instant deployment without build steps. Perfect for GitHub Pages or Netlify Drag & Drop.
                     </p>
                  </div>

                  <button 
                      onClick={confirmDeploy}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-blue-900/40"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Build & Deploy
                  </button>
                </div>
              )}

              {/* Step 1: Loading */}
              {deployStep === 1 && (
                <div className="py-12 flex flex-col items-center text-center">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                  <h4 className="text-white font-medium text-lg">Building...</h4>
                  <div className="w-64 bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
                     <div className="h-full bg-blue-500 animate-progress w-full origin-left"></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-3">Minifying assets • Verifying DNS • Propagating</p>
                </div>
              )}

              {/* Step 2: Success */}
              {deployStep === 2 && (
                <div className="py-2 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-green-500/50">
                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                  </div>
                  <h4 className="text-white font-bold text-xl">Ready for Launch!</h4>
                  <p className="text-gray-400 text-sm mt-2 mb-6 max-w-xs mx-auto">
                    Your page is live. Share the public link below or download the source code.
                  </p>
                  
                  {/* Shareable Link Section */}
                  <div className="w-full bg-[#0f1520] border border-gray-700 rounded-lg p-3 mb-4 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5 flex items-center justify-between">
                       <span className="flex items-center"><Share2 className="w-3 h-3 mr-1" /> Public Share Link</span>
                       <span className="text-blue-400 text-[10px] font-normal lowercase">auto-generates for visitors</span>
                    </label>
                    <div className="flex space-x-2">
                       <input 
                          readOnly 
                          value={getShareUrl()} 
                          className="flex-1 bg-[#161b26] border border-gray-700 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 truncate"
                       />
                       <button 
                          onClick={copyShareLink}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                       >
                          {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                       </button>
                    </div>
                    <div className="mt-2 flex items-start text-[10px] text-yellow-500/80">
                      <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                      <span>Note: This link works if <strong>this app</strong> is hosted publicly. If you are on a local/preview server, others may not be able to access it.</span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <button 
                      onClick={() => window.open(liveUrl, '_blank')}
                      className="w-full bg-[#1e293b] hover:bg-[#2d3b55] text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center border border-gray-600"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Local Preview (New Tab)
                    </button>
                    
                    <button 
                        onClick={handleDownload}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Code (GitHub Ready)
                    </button>
                  </div>
                  
                  <button onClick={closeDeployModal} className="mt-4 text-xs text-gray-500 hover:text-gray-300 underline">
                    Return to Editor
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};