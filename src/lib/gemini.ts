import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateProposalContent(notes: string, clientName: string, modules: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

  const prompt = `
    You are an expert enterprise business consultant at Weblozy. 
    Based on the following meeting notes for the client "${clientName}" and the selected automation modules [${modules.join(", ")}], generate a professional, high-impact proposal content.
    
    MEETING NOTES:
    ${notes}
    
    Provide the output in JSON format with the following keys:
    1. problemStatement: A detailed, editorial-style analysis of the current business challenges and inefficiencies.
    2. proposedSolution: A futuristic, strategic explanation of how our automation approach solves these problems.
    3. businessImpact: A summary of the expected outcomes, focusing on growth and transformation.
    4. whyWeblozy: A compelling section on why Weblozy is the best partner for this automation journey.
    5. roiExplanation: A logical explanation of the ROI calculation and business value.
    
    Keep the tone premium, authoritative, and consulting-grade. Use bold language.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean up markdown if AI returns it
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw error;
  }
}
