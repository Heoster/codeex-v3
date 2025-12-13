'use server';

import {analyzePdf} from '@/ai/flows/analyze-pdf';
import {sendWelcomeEmail} from '@/ai/flows/send-welcome-email';
import {solveImageEquation} from '@/ai/flows/solve-image-equation';
import {enhancedImageSolver} from '@/ai/flows/enhanced-image-solver';
import {enhancedPdfAnalyzer} from '@/ai/flows/enhanced-pdf-analyzer';
import type {
  AnalyzePdfInput,
  AnalyzePdfOutput,
  ProcessUserMessageInput,
  SolveImageEquationInput,
  SolveImageEquationOutput,
} from '@/lib/types';

function handleGenkitError(error: unknown): {error: string} {
  const message = error instanceof Error ? error.message : String(error);
  console.error('AI processing failed:', error);

  // Check for specific error types and provide helpful messages
  if (message.includes('API key') || message.includes('API_KEY')) {
    return {
      error: `AI processing failed. API key is missing or invalid. Please check your environment variables.`,
    };
  }
  
  if (message.includes('timeout') || message.includes('TIMEOUT')) {
    return {
      error: `AI processing timed out. The request took too long to complete. Please try again.`,
    };
  }
  
  if (message.includes('rate limit') || message.includes('quota')) {
    return {
      error: `AI service is temporarily busy due to high demand. Please try again in a moment.`,
    };
  }
  
  if (message.includes('All models failed')) {
    return {
      error: `All AI models are currently unavailable. This may be due to high demand or maintenance. Please try again later.`,
    };
  }
  
  if (message.includes('Network') || message.includes('fetch')) {
    return {
      error: `Network error occurred while connecting to AI services. Please check your connection and try again.`,
    };
  }

  return {error: `AI processing failed: ${message}`};
}



export async function generateResponse(
  input: ProcessUserMessageInput
): Promise<{content: string; modelUsed?: string; autoRouted?: boolean; routingReasoning?: string} | {error: string}> {
  try {
    // Import memory-aware processor for contextual intelligence
    const { getMemoryAwareProcessor } = await import('@/lib/memory-aware-processor');
    const memoryProcessor = getMemoryAwareProcessor();
    
    // Import and use the smart fallback directly instead of making HTTP calls
    // This avoids the localhost URL issue and is more efficient
    const { generateWithSmartFallback } = await import('@/ai/smart-fallback');
    
    // Add timeout for production serverless functions
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('AI request timeout after 25 seconds')), 25000);
    });
    
    // Process message with contextual memory
    let enhancedPrompt = input.message;
    let memoryContext = '';
    
    try {
      const memoryResult = await memoryProcessor.processMessage({
        message: input.message,
        timestamp: new Date(),
        // Extract intent from message or use general as fallback
        intent: input.message.toLowerCase().includes('plan') ? 'planning' :
               input.message.toLowerCase().includes('error') || input.message.toLowerCase().includes('bug') ? 'troubleshooting' :
               input.message.toLowerCase().includes('how') || input.message.toLowerCase().includes('what') ? 'learning' :
               input.message.toLowerCase().includes('create') || input.message.toLowerCase().includes('build') ? 'creating' :
               input.message.toLowerCase().includes('review') || input.message.toLowerCase().includes('status') ? 'reviewing' :
               'general'
      });
      
      enhancedPrompt = memoryResult.enhancedPrompt;
      memoryContext = memoryResult.memoryContext;
    } catch (memoryError) {
      console.warn('Memory processing failed, using basic prompt:', memoryError);
      // Continue with original message if memory processing fails
    }
    
    // Build system prompt based on settings
    const getToneInstructions = (tone: string) => {
      switch (tone) {
        case 'formal':
          return 'Use professional language, proper grammar, and a respectful tone. Avoid contractions and casual expressions.';
        case 'casual':
          return 'Be friendly and conversational. Use simple language, contractions are fine, and feel free to use appropriate emojis occasionally.';
        default:
          return 'Be warm, approachable, and supportive. Balance professionalism with friendliness.';
      }
    };

    const getTechnicalInstructions = (level: string) => {
      switch (level) {
        case 'beginner':
          return 'Explain concepts in simple terms. Avoid jargon, use analogies, and break down complex ideas into easy steps. Assume no prior knowledge.';
        case 'expert':
          return 'Use technical terminology freely. Provide in-depth explanations, include advanced concepts, and assume strong foundational knowledge.';
        default:
          return 'Balance technical accuracy with accessibility. Define specialized terms when first used and provide moderate detail.';
      }
    };

    let systemPrompt = `You are CODEEX AI, an intelligent and versatile assistant created by Heoster. You excel at helping users with coding, problem-solving, learning, and general questions.

## Your Personality & Communication Style
${getToneInstructions(input.settings.tone)}

## Technical Depth
${getTechnicalInstructions(input.settings.technicalLevel)}

## Core Capabilities
- **Coding Help**: Debug code, explain concepts, suggest best practices, and help with algorithms
- **Problem Solving**: Break down complex problems, provide step-by-step solutions
- **Learning**: Explain topics clearly, provide examples, and adapt to the user's level
- **General Knowledge**: Answer questions accurately and cite limitations when uncertain

## Response Guidelines
1. **Be Accurate**: If unsure, say so. Don't make up information.
2. **Be Concise**: Get to the point, but provide enough detail to be helpful.
3. **Use Formatting**: Use markdown for code blocks, lists, and emphasis when helpful.
4. **Stay Focused**: Address the user's actual question, not tangential topics.
5. **Be Proactive**: Anticipate follow-up questions and address them when relevant.

## Special Instructions
- For code: Always specify the language in code blocks, explain key parts, and mention potential edge cases.
- For math: Show your work step-by-step when solving problems.
- For errors: Explain what went wrong and how to fix it.
- Remember context from the conversation to provide coherent, continuous assistance.`;

    // Add memory context to system prompt if available
    if (memoryContext) {
      systemPrompt += `

## Contextual Memory
You have access to relevant memories from previous conversations:

${memoryContext}

Use this context to provide more personalized and contextually aware responses. Reference relevant memories when they help answer the current question, but don't force connections if they're not relevant.`;
    }

    // Convert history to the format expected by smart fallback
    const convertedHistory = input.history.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model' | 'assistant',
      content: msg.content
    }));

    // Determine preferred model
    let preferredModelId: string | undefined;
    if (input.settings.model && input.settings.model !== 'auto') {
      preferredModelId = input.settings.model;
    }

    // Use smart fallback system directly with timeout
    const aiPromise = generateWithSmartFallback({
      prompt: enhancedPrompt,
      systemPrompt,
      history: convertedHistory,
      preferredModelId,
      category: 'general',
      params: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      },
    });

    const result = await Promise.race([aiPromise, timeoutPromise]);

    // Store conversation in memory for future context
    try {
      await memoryProcessor.storeConversationMemory(
        input.message,
        result.response.text,
        {
          message: input.message,
          timestamp: new Date()
        }
      );
    } catch (memoryError) {
      console.warn('Failed to store conversation memory:', memoryError);
      // Don't fail the request if memory storage fails
    }

    return {
      content: result.response.text,
      modelUsed: result.modelUsed,
      autoRouted: result.fallbackTriggered,
      routingReasoning: result.fallbackTriggered ? 'Fallback triggered' : 'Direct model usage'
    };

  } catch (error) {
    console.error('generateResponse error:', error);
    return handleGenkitError(error);
  }
}

export async function solveEquationFromImage(
  input: SolveImageEquationInput
): Promise<SolveImageEquationOutput | {error: string}> {
  try {
    // Try enhanced solver first (with multi-provider fallback)
    const response = await enhancedImageSolver({
      imageDataUri: input.photoDataUri,
      problemType: 'math',
    });
    return {
      recognizedEquation: response.recognizedContent,
      solutionSteps: response.solution,
      isSolvable: response.isSolvable,
    };
  } catch (error) {
    console.error('Enhanced image solver failed, using fallback:', error);
    try {
      // Fallback to original solver
      const response = await solveImageEquation(input);
      return response;
    } catch (fallbackError) {
      return handleGenkitError(fallbackError);
    }
  }
}

export async function analyzeDocumentFromPdf(
  input: AnalyzePdfInput
): Promise<AnalyzePdfOutput | {error: string}> {
  try {
    // Try enhanced analyzer first (with multi-provider fallback)
    const response = await enhancedPdfAnalyzer({
      pdfDataUri: input.pdfDataUri,
      question: input.question,
    });
    return response;
  } catch (error) {
    console.error('Enhanced PDF analyzer failed, using fallback:', error);
    try {
      // Fallback to original analyzer
      const response = await analyzePdf(input);
      return response;
    } catch (fallbackError) {
      return handleGenkitError(fallbackError);
    }
  }
}

export async function triggerWelcomeEmail(input: {
  email: string;
  displayName: string;
}): Promise<void | {error: string}> {
  try {
    await sendWelcomeEmail(input);
  } catch (error) {
    return handleGenkitError(error);
  }
}
