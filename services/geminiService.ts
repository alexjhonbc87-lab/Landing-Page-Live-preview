import { GoogleGenAI } from "@google/genai";
import { LandingPageFormData } from "../types";

// Retrieve API key from various possible environment variable sources.
// This supports standard Node/Webpack (process.env) and Vite (import.meta.env).
const getApiKey = (): string | undefined => {
  // Check process.env (standard)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Check Vite specific (import.meta.env)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_KEY) {
    return (import.meta as any).env.VITE_API_KEY;
  }
  return undefined;
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey || '' }); // Initialize with empty string if missing to allow error handling downstream

export const generateLandingPage = async (data: LandingPageFormData): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set 'API_KEY' or 'VITE_API_KEY' in your Vercel/Netlify Environment Variables.");
  }

  const modelId = "gemini-2.5-flash"; 
  
  const prompt = `
    You are an elite frontend web developer and conversion optimization expert.
    Create a high-converting, single-file HTML landing page for a "${data.pageType}" named "${data.pageName}".

    **Product/Offer Context**:
    ${data.offerDescription}

    **Target Audience**:
    ${data.targetAudience}

    **Technical Requirements**:
    1.  **Output Format**: Return ONLY valid, raw HTML code. Start with \`<!DOCTYPE html>\`.
    2.  **Meta & Head Structure**:
        *   Include \`<meta charset="UTF-8">\` and \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\`.
        *   **CRITICAL**: Include this script block FIRST in the head to suppress warnings:
            \`\`\`html
            <script>
              (function() {
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) return;
                  originalWarn.apply(console, args);
                };
              })();
            </script>
            \`\`\`
        *   **CRITICAL**: Load Tailwind CSS v3.4.5 specifically: \`<script src="https://cdn.tailwindcss.com/3.4.5"></script>\`
        *   **CRITICAL**: Include the config script AFTER the tailwind script:
            \`\`\`html
            <script>
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: '#2563eb',
                      secondary: '#1e40af',
                    }
                  }
                }
              }
            </script>
            \`\`\`
    3.  **Styling & Design**: 
        *   Use Tailwind CSS utility classes for EVERYTHING.
        *   Ensure a modern, clean, and trustworthy aesthetic (Stripe or Linear style).
        *   Use \`min-h-screen\` on the body.
        *   Ensure responsive design (use md: and lg: classes).
    4.  **Icons**: Use FontAwesome: \`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\`
    5.  **Images**: Use high-quality placeholders from Unsplash Source.
        *   Format: \`https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1200&q=80\`
        *   Select realistic IDs for business/tech/lifestyle images.
    6.  **Structure**:
        *   **Navbar**: Sticky, Logo, CTA.
        *   **Hero**: Big bold headline, subhead, primary CTA, hero image.
        *   **Social Proof**: Logos of companies or stats.
        *   **Features**: Grid of 3 columns with icons.
        *   **How it Works**: Step-by-step.
        *   **Testimonials**: specific to the target audience.
        *   **CTA Section**: Final push.
        *   **Footer**: Links.
    7.  **Content**: Write persuasive, professional copy based on the provided offer description.

    **SEO Injection**:
    *   Title Tag: ${data.pageName}
    *   Meta Description: ${data.metaDescription || `Best offer for ${data.pageName}`}

    **Constraint**: 
    Do not include markdown code blocks (like \`\`\`html). Return just the clean HTML string. Ensure the HTML is well-formed.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    let html = response.text || "";
    
    // Clean up if the model accidentally wraps in markdown
    html = html.replace(/```html/g, '').replace(/```/g, '').trim();
    
    return html;
  } catch (error: any) {
    console.error("Error generating landing page:", error);
    
    // Check for Rate Limit / Quota Exceeded error
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
       throw new Error("API Quota Exceeded. The API key in your Vercel/Netlify Environment Variables is exhausted. Please update it with a new key in your hosting dashboard.");
    }
    
    throw new Error(error.message || "Failed to generate landing page. Please check your API key and try again.");
  }
};