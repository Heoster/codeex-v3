'use server';

/**
 * Enhanced Problem Solver with Multi-Provider Support
 */

let z: any;
let generateWithFallback: any;

// Safe imports with fallbacks
try {
  const genkitModule = require('genkit');
  z = genkitModule.z || {
    object: (schema: any) => ({ parse: (data: any) => data }),
    string: () => ({ parse: (data: any) => String(data) }),
    enum: (values: any[]) => ({ parse: (data: any) => data }),
    optional: () => ({ parse: (data: any) => data })
  };
} catch (error) {
  console.warn('Failed to import genkit z:', error);
  z = {
    object: (schema: any) => ({ parse: (data: any) => data }),
    string: () => ({ parse: (data: any) => String(data) }),
    enum: (values: any[]) => ({ parse: (data: any) => data }),
    optional: () => ({ parse: (data: any) => data })
  };
}

try {
  const routerModule = require('../multi-provider-router');
  generateWithFallback = routerModule.generateWithFallback;
} catch (error) {
  console.error('Failed to import multi-provider-router:', error);
  generateWithFallback = async () => {
    throw new Error('AI service is not available. Please check your configuration.');
  };
}

const EnhancedSolveInputSchema = z.object({
  problem: z.string().describe('The problem or quiz to solve.'),
  tone: z.enum(['helpful', 'formal', 'casual']).optional(),
  technicalLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  preferredModel: z.string().optional(),
});

const EnhancedSolveOutputSchema = z.object({
  solution: z.string().describe('The solution to the problem.'),
  modelUsed: z.string().optional(),
});

export type EnhancedSolveInput = {
  problem: string;
  tone?: 'helpful' | 'formal' | 'casual';
  technicalLevel?: 'beginner' | 'intermediate' | 'expert';
  preferredModel?: string;
};

export type EnhancedSolveOutput = {
  solution: string;
  modelUsed?: string;
};

export async function enhancedSolve(input: EnhancedSolveInput): Promise<EnhancedSolveOutput> {
  // Validate input
  if (!input || !input.problem) {
    throw new Error('Problem is required');
  }

  const systemPrompt = `You are a world-class problem solver and educator, expert in mathematics, science, logic, programming, and general knowledge.

## Instructions
1. **Understand the Problem**: First, identify what type of problem this is (math, logic, coding, trivia, etc.)
2. **Show Your Work**: 
   - For math: Show step-by-step calculations with clear explanations
   - For coding: Provide working code with comments explaining the logic
   - For logic puzzles: Explain your reasoning process
   - For trivia/knowledge: Provide the answer with relevant context
3. **Format Your Response**:
   - Use markdown formatting for clarity
   - Use code blocks with language specification for any code
   - Use LaTeX notation (wrapped in $ or $$) for mathematical expressions when helpful
   - Number your steps for multi-step solutions
4. **Verify Your Answer**: Double-check calculations and logic before presenting
5. **Explain the Concept**: Briefly explain the underlying concept or method used

## Response Style
- Tone: ${input.tone || 'helpful and encouraging'}
- Technical Level: ${input.technicalLevel || 'intermediate'}`;

  const prompt = `Solve the following problem:\n\n${input.problem}`;

  try {
    // Check if generateWithFallback is available
    if (!generateWithFallback || typeof generateWithFallback !== 'function') {
      throw new Error('AI service is not properly configured. Please check your API keys.');
    }

    const response = await generateWithFallback({
      prompt,
      systemPrompt,
      preferredModelId: input.preferredModel,
      category: 'math',
      params: {
        temperature: 0.3,
        topP: 0.85,
        maxOutputTokens: 4096,
      },
    });

    if (!response || !response.text) {
      throw new Error('No response generated from AI service');
    }

    return {
      solution: response.text,
      modelUsed: response.modelUsed || 'unknown',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Enhanced solve error:', errorMessage);
    
    // Provide user-friendly error messages
    if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
      throw new Error('AI service is not properly configured. Please check your API key settings.');
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      throw new Error('Service is temporarily busy. Please try again in a moment.');
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error(`Unable to solve the problem at this time. Please try again later.`);
  }
}
