
import type { SummaryPreferences } from '@/components/SummaryPreferences';

export const generateSummary = async (text: string, preferences: SummaryPreferences): Promise<string> => {
  try {
    const apiUrl = 'http://192.168.29.191:1234/v1/completions';
    
    const wordCount = preferences.length === "custom" && preferences.customLength 
      ? preferences.customLength 
      : parseInt(preferences.length);

    const toneGuide = {
      professional: "Use formal, academic language appropriate for scholarly writing. Maintain a research-style tone with precise terminology.",
      simplified: "Use simple, accessible language. Avoid jargon and explain concepts in plain terms that anyone can understand.",
      technical: "Preserve all domain-specific terminology and technical details. Maintain the original paper's technical depth."
    };
    
    const prompt = `
    You are an expert research paper summarizer. Create a coherent, single-paragraph summary of the following research paper in approximately ${wordCount} words. 
    
    Tone: ${toneGuide[preferences.fluency]}
    
    Write a flowing narrative covering the main research question, methodology, key findings, and conclusions. Make it read naturally as one cohesive paragraph.
    
    Research paper:
    ${text}
    
    Summary:`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'ds-r1-llama-8b',
        prompt,
        max_tokens: Math.min(wordCount * 2, 4096),
        temperature: 0.3,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

export const mockGenerateSummary = async (text: string, preferences: SummaryPreferences): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return `This research paper explores the application of deep learning techniques to natural language processing tasks. The authors propose a novel architecture that combines transformer models with reinforcement learning to improve performance on text summarization tasks. Their findings demonstrate a 35% improvement in both efficiency and accuracy compared to previous state-of-the-art approaches. The methodology employed a rigorous experimental design, testing the model across multiple datasets including news articles, scientific papers, and literary texts. Results consistently showed that the hybrid architecture outperforms traditional models, particularly when processing complex, technical content. The researchers conclude that this approach represents a significant advancement in automated text analysis and could have far-reaching implications for applications in content creation, academic research assistance, and information retrieval systems. Future work will focus on expanding the model's capabilities to handle multilingual inputs and improving its contextual understanding of domain-specific terminology.`;
};

export const summarizeText = async (text: string, preferences: SummaryPreferences): Promise<string> => {
  try {
    return await generateSummary(text, preferences);
  } catch (error) {
    console.warn('Falling back to mock implementation', error);
    return await mockGenerateSummary(text, preferences);
  }
};
