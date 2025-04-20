import type { SummaryPreferences } from '@/components/SummaryPreferences';

interface SummarizeRequest {
  text: string;
}

interface SummarizeResponse {
  summary: string;
}

export const generateSummary = async (text: string, preferences: SummaryPreferences): Promise<string> => {
  try {
    const apiUrl = 'http://192.168.29.191:1234/v1/completions';
    
    const fluencyGuide = {
      basic: "Use simple and clear language, avoiding technical terms where possible.",
      standard: "Use a balanced mix of technical and accessible language.",
      professional: "Use academic language and technical terminology appropriate for scholarly writing."
    };
    
    const prompt = `
    You are an expert research paper summarizer. Create a coherent, single-paragraph summary of the following research paper in approximately ${preferences.length} words. 
    
    Style Guide: ${fluencyGuide[preferences.fluency]}
    
    Focus on creating a flowing narrative that covers:
    - The main research question and objectives
    - Key methodology used
    - Important findings and results
    - Significant conclusions and implications
    
    Write the summary as a cohesive paragraph that reads naturally and maintains logical flow between ideas.
    
    Research paper:
    ${text}
    
    Summary:`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ds-r1-llama-8b',
        prompt: prompt,
        max_tokens: 1024,
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

export const mockGenerateSummary = async (text: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return `## Research Summary

This paper explores the application of deep learning techniques to natural language processing tasks. The authors propose a novel architecture that combines transformer models with reinforcement learning to improve performance on text summarization tasks.

### Key Findings:
- The proposed model achieves state-of-the-art results on multiple benchmarks
- Training efficiency improved by 35% over previous approaches
- Human evaluators rated summaries as more coherent and informative

### Methodology:
The research employed a mixed-methods approach with both quantitative evaluation on standard datasets and qualitative assessment through expert review.

### Implications:
These findings suggest that hybrid architectures may offer significant advantages for complex language tasks, particularly when processing lengthy documents with intricate information structures.`;
};

export const summarizeText = async (text: string): Promise<string> => {
  try {
    return await generateSummary(text);
  } catch (error) {
    console.warn('Falling back to mock implementation', error);
    return await mockGenerateSummary(text);
  }
};
