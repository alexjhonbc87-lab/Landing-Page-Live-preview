import { GoogleGenAI } from "@google/genai";
import { LandingPageFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLandingPage = async (data: LandingPageFormData): Promise<string> => {
  const modelId = "gemini-2.5-flash"; // Efficient for code generation
  
  const prompt = `
    You are an expert frontend web developer and conversion rate optimization specialist.
    Create a complete, single-file HTML landing page using Tailwind CSS (via CDN) based on the following specifications.
    
    IMPORTANT: The output must be a valid, standalone HTML file starting with <!DOCTYPE html>.

    - Page Name: ${data.pageName}
    - Type: ${data.pageType}
    - Product/Offer: ${data.offerDescription}
    - Target Audience: ${data.targetAudience}
    ${data.metaDescription ? `- Meta Description: ${data.metaDescription}` : ''}
    ${data.keywords ? `- Meta Keywords: ${data.keywords}` : ''}

    Requirements:
    1. Start with <!DOCTYPE html> and <html lang="en">.
    2. Use <script src="https://cdn.tailwindcss.com"></script> in the head.
    3. Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> for proper mobile responsiveness.
    4. Add <title>${data.pageName}</title> in the head.
    5. IF provided, include <meta name="description" content="..."> and <meta name="keywords" content="..."> in the head.
    6. The design MUST be modern, high-converting, and visually stunning. Use a dark or light theme based on what fits the product best.
    7. Ensure the body has 'min-h-screen' to take up full height.
    8. Include these sections: 
       - Hero Section (Headline, Subheadline, CTA Button)
       - Features/Benefits Grid
       - Social Proof / Testimonials (use placeholders)
       - FAQ Section
       - Final CTA Footer
    9. Use FontAwesome via CDN for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    10. Use https://picsum.photos/800/600?random=1 (increment random number) for placeholder images.
    11. Return ONLY the raw HTML code. Do not wrap it in markdown code blocks (like \`\`\`html). Do not include any explanation text. Just the HTML.
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