import { GoogleGenAI } from "@google/genai";
import { LandingPageFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLandingPage = async (data: LandingPageFormData): Promise<string> => {
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
    2.  **Styling**: Use Tailwind CSS via CDN.
        *   Include this script in head: \`<script src="https://cdn.tailwindcss.com"></script>\`
        *   Include a custom config script to define a professional color palette matching the product vibe.
    3.  **Responsiveness**: Fully responsive (Mobile, Tablet, Desktop).
    4.  **Icons**: Use FontAwesome: \`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\`
    5.  **Images**: Use high-quality placeholders from Unsplash Source or Picsum. 
        *   Example: \`https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80\` (Use relevant keywords for images).
    6.  **Structure**:
        *   **Header/Nav**: Logo (text), CTA button.
        *   **Hero Section**: Compelling Headline, Subheadline, Primary CTA, Hero Image/Graphic.
        *   **Social Proof**: "Trusted by" logos or Testimonials.
        *   **Features/Benefits**: Grid layout.
        *   **How it Works/Steps**: Clear breakdown.
        *   **FAQ Section**: Accordion style (using details/summary tags).
        *   **Footer**: Links, copyright.
    7.  **Content**: Write persuasive, professional copy based on the provided offer description. Do not use Lorem Ipsum unless absolutely necessary.

    **SEO Injection**:
    *   Title: ${data.pageName}
    *   Meta Description: ${data.metaDescription || `Best offer for ${data.pageName}`}
    *   Keywords: ${data.keywords || ''}

    **Constraint**: 
    Do not include markdown code blocks (like \`\`\`html). Return just the clean HTML string.
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
  } catch (error) {
    console.error("Error generating landing page:", error);
    throw new Error("Failed to generate landing page. Please check your API key and try again.");
  }
};