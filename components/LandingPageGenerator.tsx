
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
  AlertTriangle,
  AlertCircle,
  Cloud,
  Server,
  Terminal,
  Save
} from 'lucide-react';
import { ViewMode, LandingPageFormData } from '../types';
import { generateLandingPage } from '../services/geminiService';
import { saveLandingPage, publishLandingPage } from '../services/landingPageService';
import { auth } from '../services/firebase';

// The fixed production base URL as requested
const PRODUCTION_BASE_URL = 'https://landingpages-theta.vercel.app/';

export const LandingPageGenerator: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DESKTOP);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  
  // Deploy State
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployStep, setDeployStep] = useState(0); // 0: Config, 1: Deploying, 2: Success
  const [deploymentStatus, setDeploymentStatus] = useState<string>("");
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [liveUrl, setLiveUrl] = useState<string>("");
  
  const [showSeoSettings, setShowSeoSettings] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validation State
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  
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
        setFormData(prev => ({ ...prev, ...decoded }));
        generateWithData(decoded);
      }
    } catch (e) {
      console.error("Failed to parse shared data", e);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'subdomain') {
      const normalized = value.toLowerCase();
      const validCharsRegex = /^[a-z0-9-]*$/;
      let errorMsg = null;

      if (!validCharsRegex.test(normalized)) {
        errorMsg = "Only lowercase alphanumeric characters and hyphens are allowed.";
      } else if (normalized.startsWith('-')) {
        errorMsg = "Subdomain cannot start with a hyphen.";
      } else if (normalized.endsWith('-')) {
         errorMsg = "Subdomain cannot end with a hyphen.";
      } else if (normalized.length > 63) {
         errorMsg = "Subdomain cannot exceed 63 characters.";
      }

      setSubdomainError(errorMsg);
      setFormData(prev => ({ ...prev, [name]: normalized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError(null);
  };

  const generateWithData = async (data: LandingPageFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const html = await generateLandingPage(data);
      setGeneratedHtml(html);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.offerDescription) {
        setError("Please enter a product description to start.");
        return;
    }
    await generateWithData(formData);
  };

  const openDeployModal = () => {
    if (!generatedHtml) return;
    
    // Auto-fill subdomain if empty
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
    setSubdomainError(null);
    setShowDeployModal(true);
    setDeploymentLog([]);
  };

  const confirmDeploy = async () => {
    if (subdomainError || !formData.subdomain || !generatedHtml) return;
    if (!auth.currentUser) {
       setError("You must be logged in to deploy.");
       setShowDeployModal(false);
       return;
    }

    setDeployStep(1);
    setDeploymentStatus("Initializing...");
    setDeploymentLog(["Initializing build environment..."]);

    try {
        // Step 1: Save Draft to Firestore
        setDeploymentStatus("Saving to database...");
        setDeploymentLog(prev => [...prev, "> Saving page configuration...", "> Uploading HTML content..."]);
        
        const pageId = await saveLandingPage(formData, generatedHtml);
        setDeploymentLog(prev => [...prev, `> Page ID generated: ${pageId}`]);

        // Step 2: Publish (Make Public)
        setDeploymentStatus("Publishing...");
        setDeploymentLog(prev => [...prev, "> Configuring public access...", "> Setting security rules..."]);
        
        const publicUrl = await publishLandingPage(pageId);
        setDeploymentLog(prev => [...prev, `> Public URL active: ${publicUrl}`]);

        // Success
        setLiveUrl(publicUrl);
        setDeployStep(2);
        setDeploymentLog(prev => [...prev, "> Deployment successful!"]);

    } catch (err: any) {
        console.error("Deploy failed:", err);
        setError("Deployment failed: " + err.message);
        setShowDeployModal(false);
    }
  };

  const closeDeployModal = () => {
    setShowDeployModal(false);
    setDeployStep(0);
    setCopySuccess(false);
    setDeploymentLog([]);
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
    a.download = `${formData.subdomain || 'landing-page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate share link for editor state (not the finished page)
  const getShareUrl = () => {
    try {
      const url = new URL(PRODUCTION_BASE_URL);
      url.search = '';
      url.hash = '';
      const stateString = JSON.stringify(formData);
      const encoded = btoa(encodeURIComponent(stateString));
      url.searchParams.set('s', encoded);
      return url.toString();
    } catch (e) {
      return "Error generating link";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
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
          
          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start space-x-3">
               <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
               <div className="flex-1">
                 <h4 className="text-sm font-bold text-red-500">Operation Failed</h4>
                 <p className="text-xs text-red-300 mt-1 leading-relaxed">{error}</p>
               </div>
               <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">
                 <X className="w-4 h-4" />
               </button>
            </div>
          )}

          {/* Form Fields */}
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Your Offer / Product Description</label>
            <textarea
              name="offerDescription"
              value={formData.offerDescription}
              onChange={handleInputChange}
              rows={5}
              placeholder="e.g., A 6-week live coaching program for new freelance writers..."
              className="w-full px-4 py-3 bg-[#161b26] text-white border border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm placeholder-gray-600 leading-relaxed"
            />
          </div>

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

          {/* SEO Settings */}
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
                        className="w-full px-3 py-2 bg-[#161b26] text-white border border-gray-700 rounded focus:ring-1 focus:ring-blue-500 outline-none resize-none text-xs"
                      />
                   </div>
                   <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Keywords</label>
                      <input
                        type="text"
                        name="keywords"
                        value={formData.keywords}
                        onChange={handleInputChange}
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
        <div className="flex-1 bg-[#1e293b] rounded-xl flex flex-col border border-gray-700 overflow-hidden shadow-2xl relative">
          
          {/* Header */}
          <div className="h-12 bg-[#111827] border-b border-gray-700 flex items-center justify-between px-4 z-10 flex-shrink-0">
            <div className="flex space-x-2 w-1/3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
            </div>

            <div className="flex items-center justify-center space-x-1 bg-[#1f2937] rounded-lg p-1 border border-gray-700">
              {[ViewMode.DESKTOP, ViewMode.TABLET, ViewMode.MOBILE].map((mode) => (
                <button 
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded-md transition-all ${viewMode === mode ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {mode === ViewMode.DESKTOP && <Monitor className="w-4 h-4" />}
                  {mode === ViewMode.TABLET && <Tablet className="w-4 h-4" />}
                  {mode === ViewMode.MOBILE && <Smartphone className="w-4 h-4" />}
                </button>
              ))}
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

          <div className="bg-[#111827] py-1 text-center border-b border-gray-800 flex-shrink-0">
             <div className="flex items-center justify-center text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                <Pencil className="w-3 h-3 mr-1.5" />
                EDITOR MODE
             </div>
          </div>

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
                    title="Preview"
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
                       </div>
                    ) : (
                       <div className="opacity-50 flex flex-col items-center">
                         <Layout className="w-16 h-16 text-gray-600 mb-4" />
                         <p className="text-sm text-gray-500">Your live preview will appear here.</p>
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
                <button onClick={closeDeployModal} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 0: Config */}
              {deployStep === 0 && (
                <div className="py-2">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subdomain URL</label>
                    <div className="flex rounded-md shadow-sm relative">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                        /page/
                      </span>
                      <input
                        type="text"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleInputChange}
                        className={`flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-md border border-gray-600 bg-[#0B1019] text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${subdomainError ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {subdomainError && <p className="mt-2 text-xs text-red-400">{subdomainError}</p>}
                  </div>
                  
                  <div className="bg-[#0f1520] p-4 rounded-lg border border-gray-700 mb-6">
                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Target</h4>
                     <div className="flex items-center justify-center text-center p-3 border border-gray-800 rounded bg-[#161b26]">
                        <Cloud className="w-5 h-5 text-blue-400 mb-1 mx-auto" />
                        <span className="text-white text-sm font-semibold ml-2">Firestore Database</span>
                     </div>
                  </div>

                  <button 
                      onClick={confirmDeploy}
                      disabled={!!subdomainError || !formData.subdomain}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg disabled:opacity-50"
                    >
                      <Rocket className="w-4 h-4 mr-2 inline" />
                      Save & Publish
                  </button>
                </div>
              )}

              {/* Step 1: Deploying */}
              {deployStep === 1 && (
                <div className="py-6 flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                  <h4 className="text-white font-bold text-xl mb-2">Publishing Page</h4>
                  <p className="text-blue-400 text-sm font-mono mb-6">{deploymentStatus}</p>
                  <div className="w-full bg-[#0f1520] border border-gray-700 rounded-lg p-3 h-32 overflow-y-auto font-mono text-xs text-green-400">
                     {deploymentLog.map((log, i) => <div key={i}>{log}</div>)}
                  </div>
                </div>
              )}

              {/* Step 2: Success */}
              {deployStep === 2 && (
                <div className="py-2 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-green-500/50">
                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                  </div>
                  <h4 className="text-white font-bold text-xl">Published Successfully!</h4>
                  <p className="text-gray-400 text-sm mt-2 mb-6">
                    Your page is saved to the database and is publicly accessible.
                  </p>
                  
                  <div className="w-full bg-[#0B1019] border border-gray-700 rounded-lg p-4 mb-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Public URL</p>
                      <a href={liveUrl} target="_blank" rel="noreferrer" className="text-blue-400 font-mono text-sm font-bold hover:underline break-all">
                        {liveUrl}
                      </a>
                  </div>

                  <div className="flex space-x-2 w-full">
                     <button 
                        onClick={() => copyToClipboard(liveUrl)}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                     >
                        {copySuccess ? 'Copied!' : 'Copy Link'}
                     </button>
                     <button 
                        onClick={() => window.open(liveUrl, '_blank')}
                        className="px-4 py-2.5 bg-[#1e293b] text-white rounded-lg hover:bg-[#2d3b55] border border-gray-600"
                     >
                        <ExternalLink className="w-4 h-4" />
                     </button>
                  </div>
                  
                  <button onClick={closeDeployModal} className="mt-6 text-xs text-gray-500 hover:text-gray-300 underline">
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
