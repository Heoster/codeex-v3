/**
 * Memory-Aware Message Processor
 * Integrates contextual memory with AI responses for intelligent, context-aware conversations
 */

import { getContextualMemory, type RecallContext, type MemoryItem } from './contextual-memory';

export interface MessageContext {
  message: string;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  intent?: 'planning' | 'troubleshooting' | 'learning' | 'creating' | 'reviewing' | 'general';
  entities?: string[];
  project?: string;
  topic?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface EnhancedResponse {
  response: string;
  relevantMemories: MemoryItem[];
  memoryInsights: string;
  suggestedFollowUps: string[];
  contextualEnhancements: string[];
}

export class MemoryAwareProcessor {
  private memory = getContextualMemory();

  /**
   * Process a message with contextual memory awareness
   */
  async processMessage(context: MessageContext): Promise<{
    enhancedPrompt: string;
    memoryContext: string;
    recallResults: any;
  }> {
    // Extract intent and entities from the message
    const intent = this.detectIntent(context.message);
    const entities = this.extractEntities(context.message);
    const project = this.detectProject(context.message);
    const topic = this.extractTopic(context.message);
    const urgency = this.detectUrgency(context.message);

    // Create recall context
    const recallContext: RecallContext = {
      query: context.message,
      intent: context.intent || intent,
      timeframe: this.determineTimeframe(context.message, intent),
      project: context.project || project,
      topic: context.topic || topic,
      urgency: context.urgency || urgency,
      entities: context.entities || entities
    };

    // Perform adaptive recall
    const recallResults = await this.memory.adaptiveRecall(recallContext);

    // Generate memory context for AI
    const memoryContext = this.formatMemoryForAI(recallResults);

    // Create enhanced prompt
    const enhancedPrompt = this.createEnhancedPrompt(context.message, memoryContext, recallResults);

    return {
      enhancedPrompt,
      memoryContext,
      recallResults
    };
  }

  /**
   * Store conversation and insights as memories
   */
  async storeConversationMemory(
    userMessage: string,
    aiResponse: string,
    context: MessageContext
  ): Promise<void> {
    // Store user message as conversation memory
    await this.memory.storeMemory(
      userMessage,
      'conversation',
      {
        project: context.project,
        topic: context.topic,
        intent: context.intent,
        sentiment: this.detectSentiment(userMessage)
      },
      {
        source: 'user',
        confidence: 0.9,
        verified: true
      }
    );

    // Extract and store insights from AI response
    const insights = this.extractInsights(aiResponse);
    for (const insight of insights) {
      await this.memory.storeMemory(
        insight.content,
        insight.type,
        {
          project: context.project,
          topic: context.topic,
          intent: context.intent
        },
        {
          source: 'ai',
          confidence: insight.confidence,
          verified: false
        }
      );
    }

    // Store any mentioned deadlines, configs, or tasks
    await this.storeSpecializedMemories(userMessage, aiResponse, context);
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(message: string): RecallContext['intent'] {
    const lowerMessage = message.toLowerCase();

    // Planning indicators
    if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || 
        lowerMessage.includes('deadline') || lowerMessage.includes('when') ||
        lowerMessage.includes('timeline') || lowerMessage.includes('roadmap')) {
      return 'planning';
    }

    // Troubleshooting indicators
    if (lowerMessage.includes('error') || lowerMessage.includes('bug') ||
        lowerMessage.includes('issue') || lowerMessage.includes('problem') ||
        lowerMessage.includes('fix') || lowerMessage.includes('debug') ||
        lowerMessage.includes('not working') || lowerMessage.includes('broken')) {
      return 'troubleshooting';
    }

    // Learning indicators
    if (lowerMessage.includes('how') || lowerMessage.includes('what') ||
        lowerMessage.includes('why') || lowerMessage.includes('explain') ||
        lowerMessage.includes('learn') || lowerMessage.includes('understand') ||
        lowerMessage.includes('teach') || lowerMessage.includes('show me')) {
      return 'learning';
    }

    // Creating indicators
    if (lowerMessage.includes('create') || lowerMessage.includes('build') ||
        lowerMessage.includes('make') || lowerMessage.includes('generate') ||
        lowerMessage.includes('design') || lowerMessage.includes('develop')) {
      return 'creating';
    }

    // Reviewing indicators
    if (lowerMessage.includes('review') || lowerMessage.includes('check') ||
        lowerMessage.includes('summary') || lowerMessage.includes('status') ||
        lowerMessage.includes('progress') || lowerMessage.includes('update')) {
      return 'reviewing';
    }

    return 'general';
  }

  /**
   * Extract entities from message
   */
  private extractEntities(message: string): string[] {
    const entities = [];

    // Extract capitalized words (potential proper nouns)
    const capitalizedWords = message.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    entities.push(...capitalizedWords);

    // Extract technical terms
    const technicalTerms = message.match(/\b\w+[._-]\w+\b/g) || [];
    entities.push(...technicalTerms);

    // Extract file extensions
    const fileExtensions = message.match(/\.\w{2,4}\b/g) || [];
    entities.push(...fileExtensions);

    // Extract URLs
    const urls = message.match(/https?:\/\/[^\s]+/g) || [];
    entities.push(...urls);

    // Extract dates
    const dates = message.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g) || [];
    entities.push(...dates);

    // Extract version numbers
    const versions = message.match(/v?\d+\.\d+(?:\.\d+)?/g) || [];
    entities.push(...versions);

    return [...new Set(entities)];
  }

  /**
   * Detect project from message
   */
  private detectProject(message: string): string | undefined {
    // Common project indicators
    const projectKeywords = [
      'project', 'app', 'website', 'system', 'platform', 'service',
      'api', 'dashboard', 'frontend', 'backend', 'database'
    ];

    for (const keyword of projectKeywords) {
      const regex = new RegExp(`\\b(\\w+)\\s+${keyword}\\b`, 'i');
      const match = message.match(regex);
      if (match) {
        return match[1];
      }
    }

    // Look for capitalized project names
    const projectNames = message.match(/\b[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*\b/g) || [];
    return projectNames[0];
  }

  /**
   * Extract topic from message
   */
  private extractTopic(message: string): string | undefined {
    // Remove common words and extract meaningful terms
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'can', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);

    const words = message.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    return words.slice(0, 3).join(' ');
  }

  /**
   * Detect urgency from message
   */
  private detectUrgency(message: string): RecallContext['urgency'] {
    const lowerMessage = message.toLowerCase();

    // High urgency indicators
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') ||
        lowerMessage.includes('immediately') || lowerMessage.includes('critical') ||
        lowerMessage.includes('emergency') || lowerMessage.includes('now') ||
        lowerMessage.includes('quickly') || lowerMessage.includes('deadline')) {
      return 'high';
    }

    // Medium urgency indicators
    if (lowerMessage.includes('soon') || lowerMessage.includes('today') ||
        lowerMessage.includes('important') || lowerMessage.includes('priority')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Determine appropriate timeframe for memory recall
   */
  private determineTimeframe(message: string, intent: RecallContext['intent']): RecallContext['timeframe'] {
    const lowerMessage = message.toLowerCase();

    // Explicit timeframe indicators
    if (lowerMessage.includes('recent') || lowerMessage.includes('lately') ||
        lowerMessage.includes('today') || lowerMessage.includes('yesterday')) {
      return 'recent';
    }

    if (lowerMessage.includes('history') || lowerMessage.includes('past') ||
        lowerMessage.includes('before') || lowerMessage.includes('previously')) {
      return 'historical';
    }

    if (lowerMessage.includes('now') || lowerMessage.includes('current') ||
        lowerMessage.includes('immediate')) {
      return 'immediate';
    }

    // Intent-based timeframe
    switch (intent) {
      case 'troubleshooting':
        return 'recent'; // Recent issues are most relevant
      case 'planning':
        return 'all'; // Need both historical context and recent updates
      case 'reviewing':
        return 'recent'; // Focus on recent progress
      default:
        return 'all';
    }
  }

  /**
   * Format memory context for AI consumption
   */
  private formatMemoryForAI(recallResults: any): string {
    if (!recallResults.memories || recallResults.memories.length === 0) {
      return '';
    }

    const sections: string[] = [];

    // Group memories by type
    const memoryGroups = recallResults.memories.reduce((groups: any, memory: MemoryItem) => {
      if (!groups[memory.type]) groups[memory.type] = [];
      groups[memory.type].push(memory);
      return groups;
    }, {});

    // Format each group
    Object.entries(memoryGroups).forEach(([type, memories]: [string, any]) => {
      sections.push(`## ${type.charAt(0).toUpperCase() + type.slice(1)} Context:`);
      memories.forEach((memory: MemoryItem, index: number) => {
        const age = Math.floor((Date.now() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24));
        sections.push(`${index + 1}. ${memory.content} (${age} days ago, importance: ${memory.importance}/10)`);
      });
      sections.push('');
    });

    return sections.join('\n');
  }

  /**
   * Create enhanced prompt with memory context
   */
  private createEnhancedPrompt(originalMessage: string, memoryContext: string, recallResults: any): string {
    if (!memoryContext) {
      return originalMessage;
    }

    return `Based on our conversation history and your memory of relevant context:

${memoryContext}

Memory Recall Reasoning: ${recallResults.reasoning}

Current Question: ${originalMessage}

Please provide a response that:
1. Acknowledges relevant context from memory when applicable
2. Builds upon previous conversations and established facts
3. References specific details that demonstrate continuity
4. Suggests connections to related topics or projects when helpful

Your response should feel natural and contextually aware, as if you truly remember our previous interactions.`;
  }

  /**
   * Detect sentiment from message
   */
  private detectSentiment(message: string): 'positive' | 'negative' | 'neutral' {
    const lowerMessage = message.toLowerCase();

    const positiveWords = ['good', 'great', 'excellent', 'awesome', 'perfect', 'love', 'like', 'happy', 'excited'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'frustrated', 'angry', 'problem', 'issue', 'error'];

    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract insights from AI response
   */
  private extractInsights(response: string): Array<{
    content: string;
    type: MemoryItem['type'];
    confidence: number;
  }> {
    const insights: Array<{
      content: string;
      type: MemoryItem['type'];
      confidence: number;
    }> = [];

    // Extract code snippets as config memories
    const codeBlocks = response.match(/```[\s\S]*?```/g) || [];
    codeBlocks.forEach(code => {
      insights.push({
        content: code,
        type: 'config' as const,
        confidence: 0.8
      });
    });

    // Extract key facts (sentences with "is", "are", "means", etc.)
    const factPatterns = /([^.!?]*(?:is|are|means|refers to|defined as)[^.!?]*[.!?])/gi;
    const facts = response.match(factPatterns) || [];
    facts.forEach(fact => {
      insights.push({
        content: fact.trim(),
        type: 'fact' as const,
        confidence: 0.7
      });
    });

    // Extract important insights (sentences with "important", "key", "note", etc.)
    const insightPatterns = /([^.!?]*(?:important|key|note|remember|crucial|essential)[^.!?]*[.!?])/gi;
    const keyInsights = response.match(insightPatterns) || [];
    keyInsights.forEach(insight => {
      insights.push({
        content: insight.trim(),
        type: 'insight' as const,
        confidence: 0.9
      });
    });

    return insights;
  }

  /**
   * Store specialized memories (deadlines, configs, tasks)
   */
  private async storeSpecializedMemories(
    userMessage: string,
    aiResponse: string,
    context: MessageContext
  ): Promise<void> {
    const combinedText = `${userMessage} ${aiResponse}`;

    // Extract and store deadlines
    const deadlinePatterns = /(?:deadline|due|by|before)\s+([^.!?]*(?:date|time|day|week|month)[^.!?]*)/gi;
    const deadlines = combinedText.match(deadlinePatterns) || [];
    for (const deadline of deadlines) {
      await this.memory.storeMemory(
        deadline.trim(),
        'deadline',
        { project: context.project, topic: context.topic },
        { source: 'ai', confidence: 0.8, verified: false }
      );
    }

    // Extract and store configuration details
    const configPatterns = /(?:config|configuration|setting|parameter|option):\s*([^.!?\n]*)/gi;
    const configs = combinedText.match(configPatterns) || [];
    for (const config of configs) {
      await this.memory.storeMemory(
        config.trim(),
        'config',
        { project: context.project, topic: context.topic },
        { source: 'ai', confidence: 0.8, verified: false }
      );
    }

    // Extract and store tasks
    const taskPatterns = /(?:task|todo|action|step):\s*([^.!?\n]*)/gi;
    const tasks = combinedText.match(taskPatterns) || [];
    for (const task of tasks) {
      await this.memory.storeMemory(
        task.trim(),
        'task',
        { project: context.project, topic: context.topic },
        { source: 'ai', confidence: 0.7, verified: false }
      );
    }
  }
}

// Singleton instance
let processorInstance: MemoryAwareProcessor | null = null;

export function getMemoryAwareProcessor(): MemoryAwareProcessor {
  if (!processorInstance) {
    processorInstance = new MemoryAwareProcessor();
  }
  return processorInstance;
}