import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateProposalContent(notes: string, clientName: string, modules: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are a Strategic Solutions Architect at Weblozy.
    Based on the following meeting notes for the client "${clientName}" and the selected modules [${modules.join(", ")}], generate a McKinsey-style professional proposal content.
    
    MEETING NOTES:
    ${notes}
    
    Provide the output in JSON format with the following keys:
    1. problemStatement: Deep analytical deep-dive.
    2. proposedSolution: Futuristic roadmap.
    3. businessImpact: Quantifiable outcomes.
    4. whyWeblozy: Expertise summary.
    5. roiExplanation: Financial impact.
    
    Tone: Authoritative, Visionary.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return {
      content: JSON.parse(jsonStr),
      tokens: usage?.totalTokenCount || 0
    };
  } catch (error: any) {
    console.error("Error generating AI content:", error);
    return {
      content: {
        problemStatement: "Currently experiencing operational friction and technical debt.",
        proposedSolution: "Implementing an automated architectural ecosystem.",
        businessImpact: "Significant increase in scalability and efficiency.",
        whyWeblozy: "Our expertise in high-end automation.",
        roiExplanation: "Strategic value creation through automation."
      },
      tokens: 0
    };
  }
}

export async function generateModuleFeatures(moduleName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    As a Senior Business Automation Expert at Weblozy, analyze the module named "${moduleName}".
    Identify 6-8 comprehensive, high-value enterprise features.
    Output MUST be a JSON array of strings.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return {
      features: JSON.parse(jsonStr),
      tokens: usage?.totalTokenCount || 0
    };
  } catch (error: any) {
    console.error("Error generating module features:", error);
    return { 
      features: [
        "Advanced Data Integration Framework",
        "Real-time Analytics Dashboard",
        "Automated Workflow Optimization",
        "Enterprise-grade Security Protocol",
        "Scalable Cloud Infrastructure Sync"
      ], 
      tokens: 0 
    };
  }
}

export async function extractModulesFromContext(context: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Analyze the following business context and identify automation modules.
    CONTEXT: ${context}
    Output MUST be a JSON array of objects:
    [{"name": "Module Name", "description": "Summary", "features": ["F1", "F2", "F3"]}]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return {
      modules: JSON.parse(jsonStr),
      tokens: usage?.totalTokenCount || 0
    };
  } catch (error: any) {
    console.error("Error extracting modules:", error);
    return { modules: [], tokens: 0 };
  }
}
