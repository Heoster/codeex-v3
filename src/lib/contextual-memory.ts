/**
 * Contextual Memory with Adaptive Recall System
 * Intelligently stores, indexes, and retrieves information based on relevance and timing
 */

export interface MemoryItem {
  id: string;
  content: string;
  type: 'fact' | 'preference' | 'project' | 'task' | 'config' | 'deadline' | 'conversation' | 'insight';
  category: string;
  tags: string[];
  timestamp: Date;
  lastAccessed: Date;
  accessCount: number;
  importance: number; // 1-10 scale
  context: {
    project?: string;
    topic?: string;
    intent?: string;
    entities?: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
  };
  relationships: string[]; // IDs of related memories
  metadata: {
    source: 'user' | 'ai' | 'system';
    confidence: number;
    verified: boolean;
    expires?: Date;
  };
}

export interface RecallContext {
  query: string;
  intent: 'planning' | 'troubleshooting' | 'learning' | 'creating' | 'reviewing' | 'general';
  timeframe: 'immediate' | 'recent' | 'historical' | 'all';
  project?: string;
  topic?: string;
  urgency: 'low' | 'medium' | 'high';
  entities: string[];
}

export interface RecallResult {
  memories: MemoryItem[];
  reasoning: string;
  confidence: number;
  suggestions: string[];
}

export class ContextualMemorySystem {
  private memories: Map<string, MemoryItem> = new Map();
  private indexes: {
    byType: Map<string, Set<string>>;
    byCategory: Map<string, Set<string>>;
    byTag: Map<string, Set<string>>;
    byProject: Map<string, Set<string>>;
    byEntity: Map<string, Set<string>>;
    temporal: Map<string, Set<string>>; // by time periods
  };

  constructor() {
    this.indexes = {
      byType: new Map(),
      byCategory: new Map(),
      byTag: new Map(),
      byProject: new Map(),
      byEntity: new Map(),
      temporal: new Map()
    };
    this.loadFromStorage();
  }

  /**
   * Store a new memory with intelligent categorization
   */
  async storeMemory(
    content: string,
    type: MemoryItem['type'],
    context: Partial<MemoryItem['context']> = {},
    metadata: Partial<MemoryItem['metadata']> = {}
  ): Promise<string> {
    const id = this.generateId();
    const now = new Date();
    
    // Extract entities and topics from content
    const entities = this.extractEntities(content);
    const category = this.categorizeContent(content, type);
    const tags = this.generateTags(content, type, context);
    const importance = this.calculateImportance(content, type, context);

    const memory: MemoryItem = {
      id,
      content,
      type,
      category,
      tags,
      timestamp: now,
      lastAccessed: now,
      accessCount: 0,
      importance,
      context: {
        entities,
        ...context
      },
      relationships: [],
      metadata: {
        source: 'user',
        confidence: 0.8,
        verified: false,
        ...metadata
      }
    };

    // Store memory
    this.memories.set(id, memory);
    
    // Update indexes
    this.updateIndexes(memory);
    
    // Find and establish relationships
    await this.establishRelationships(memory);
    
    // Persist to storage
    this.saveToStorage();
    
    return id;
  }

  /**
   * Adaptive recall based on context and relevance
   */
  async adaptiveRecall(context: RecallContext): Promise<RecallResult> {
    const startTime = Date.now();
    
    // Phase 1: Initial filtering based on context
    let candidateMemories = this.getInitialCandidates(context);
    
    // Phase 2: Relevance scoring
    const scoredMemories = candidateMemories.map(memory => ({
      memory,
      score: this.calculateRelevanceScore(memory, context)
    }));
    
    // Phase 3: Temporal relevance adjustment
    const temporallyAdjusted = scoredMemories.map(item => ({
      ...item,
      score: this.adjustForTemporal(item.memory, item.score, context)
    }));
    
    // Phase 4: Intent-based prioritization
    const intentPrioritized = this.prioritizeByIntent(temporallyAdjusted, context);
    
    // Phase 5: Relationship expansion
    const expanded = await this.expandWithRelationships(intentPrioritized, context);
    
    // Phase 6: Final ranking and selection
    const finalMemories = expanded
      .sort((a, b) => b.score - a.score)
      .slice(0, this.getMaxResults(context))
      .map(item => {
        // Update access statistics
        item.memory.lastAccessed = new Date();
        item.memory.accessCount++;
        return item.memory;
      });

    // Generate reasoning and suggestions
    const reasoning = this.generateReasoning(finalMemories, context);
    const suggestions = this.generateSuggestions(finalMemories, context);
    const confidence = this.calculateConfidence(finalMemories, context);

    const processingTime = Date.now() - startTime;
    console.log(`Adaptive recall completed in ${processingTime}ms, found ${finalMemories.length} relevant memories`);

    return {
      memories: finalMemories,
      reasoning,
      confidence,
      suggestions
    };
  }

  /**
   * Get initial candidate memories based on context
   */
  private getInitialCandidates(context: RecallContext): MemoryItem[] {
    const candidates = new Set<string>();
    
    // Search by entities
    context.entities.forEach(entity => {
      const entityMemories = this.indexes.byEntity.get(entity.toLowerCase());
      if (entityMemories) {
        entityMemories.forEach(id => candidates.add(id));
      }
    });
    
    // Search by project
    if (context.project) {
      const projectMemories = this.indexes.byProject.get(context.project);
      if (projectMemories) {
        projectMemories.forEach(id => candidates.add(id));
      }
    }
    
    // Search by topic keywords
    if (context.topic) {
      const topicWords = context.topic.toLowerCase().split(' ');
      topicWords.forEach(word => {
        const tagMemories = this.indexes.byTag.get(word);
        if (tagMemories) {
          tagMemories.forEach(id => candidates.add(id));
        }
      });
    }
    
    // Fallback: get recent memories if no specific matches
    if (candidates.size === 0) {
      const recentMemories = this.getRecentMemories(20);
      recentMemories.forEach(memory => candidates.add(memory.id));
    }
    
    return Array.from(candidates)
      .map(id => this.memories.get(id))
      .filter((memory): memory is MemoryItem => memory !== undefined);
  }

  /**
   * Calculate relevance score for a memory given the context
   */
  private calculateRelevanceScore(memory: MemoryItem, context: RecallContext): number {
    let score = 0;
    
    // Base importance score
    score += memory.importance * 10;
    
    // Entity matching
    const memoryEntities = memory.context.entities || [];
    const entityMatches = context.entities.filter(entity => 
      memoryEntities.some(memEntity => 
        memEntity.toLowerCase().includes(entity.toLowerCase()) ||
        entity.toLowerCase().includes(memEntity.toLowerCase())
      )
    ).length;
    score += entityMatches * 20;
    
    // Project matching
    if (context.project && memory.context.project === context.project) {
      score += 30;
    }
    
    // Topic matching
    if (context.topic && memory.context.topic) {
      const topicSimilarity = this.calculateTextSimilarity(context.topic, memory.context.topic);
      score += topicSimilarity * 25;
    }
    
    // Content relevance
    const contentSimilarity = this.calculateTextSimilarity(context.query, memory.content);
    score += contentSimilarity * 15;
    
    // Tag matching
    const tagMatches = memory.tags.filter(tag => 
      context.query.toLowerCase().includes(tag.toLowerCase())
    ).length;
    score += tagMatches * 10;
    
    // Access frequency bonus
    score += Math.min(memory.accessCount * 2, 20);
    
    return score;
  }

  /**
   * Adjust score based on temporal relevance
   */
  private adjustForTemporal(memory: MemoryItem, score: number, context: RecallContext): number {
    const now = new Date();
    const memoryAge = now.getTime() - memory.timestamp.getTime();
    const daysSinceCreated = memoryAge / (1000 * 60 * 60 * 24);
    const daysSinceAccessed = (now.getTime() - memory.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
    
    let temporalMultiplier = 1;
    
    switch (context.timeframe) {
      case 'immediate':
        // Heavily favor very recent memories
        if (daysSinceCreated < 1) temporalMultiplier = 1.5;
        else if (daysSinceCreated < 7) temporalMultiplier = 1.2;
        else temporalMultiplier = 0.7;
        break;
        
      case 'recent':
        // Favor recent but not too heavily
        if (daysSinceCreated < 7) temporalMultiplier = 1.3;
        else if (daysSinceCreated < 30) temporalMultiplier = 1.1;
        else temporalMultiplier = 0.9;
        break;
        
      case 'historical':
        // Favor older, established memories
        if (daysSinceCreated > 30) temporalMultiplier = 1.2;
        else temporalMultiplier = 0.8;
        break;
        
      case 'all':
        // No temporal bias, but slight recency bonus
        if (daysSinceAccessed < 7) temporalMultiplier = 1.1;
        break;
    }
    
    // Decay factor for very old, unaccessed memories
    if (daysSinceAccessed > 90) {
      temporalMultiplier *= 0.8;
    }
    
    return score * temporalMultiplier;
  }

  /**
   * Prioritize memories based on intent
   */
  private prioritizeByIntent(
    scoredMemories: Array<{ memory: MemoryItem; score: number }>,
    context: RecallContext
  ): Array<{ memory: MemoryItem; score: number }> {
    return scoredMemories.map(item => {
      let intentBonus = 0;
      
      switch (context.intent) {
        case 'planning':
          if (item.memory.type === 'deadline' || item.memory.type === 'task') intentBonus = 30;
          if (item.memory.tags.includes('timeline') || item.memory.tags.includes('schedule')) intentBonus += 20;
          break;
          
        case 'troubleshooting':
          if (item.memory.type === 'config' || item.memory.type === 'insight') intentBonus = 30;
          if (item.memory.tags.includes('error') || item.memory.tags.includes('solution')) intentBonus += 20;
          break;
          
        case 'learning':
          if (item.memory.type === 'fact' || item.memory.type === 'insight') intentBonus = 25;
          if (item.memory.tags.includes('concept') || item.memory.tags.includes('explanation')) intentBonus += 15;
          break;
          
        case 'creating':
          if (item.memory.type === 'preference' || item.memory.type === 'config') intentBonus = 25;
          if (item.memory.tags.includes('template') || item.memory.tags.includes('example')) intentBonus += 15;
          break;
          
        case 'reviewing':
          if (item.memory.type === 'conversation' || item.memory.type === 'project') intentBonus = 20;
          if (item.memory.tags.includes('summary') || item.memory.tags.includes('progress')) intentBonus += 15;
          break;
      }
      
      return {
        ...item,
        score: item.score + intentBonus
      };
    });
  }

  /**
   * Expand results with related memories
   */
  private async expandWithRelationships(
    scoredMemories: Array<{ memory: MemoryItem; score: number }>,
    context: RecallContext
  ): Promise<Array<{ memory: MemoryItem; score: number }>> {
    const expanded = [...scoredMemories];
    const addedIds = new Set(scoredMemories.map(item => item.memory.id));
    
    // Add related memories with reduced scores
    for (const item of scoredMemories.slice(0, 5)) { // Only expand top 5
      for (const relatedId of item.memory.relationships) {
        if (!addedIds.has(relatedId)) {
          const relatedMemory = this.memories.get(relatedId);
          if (relatedMemory) {
            expanded.push({
              memory: relatedMemory,
              score: item.score * 0.7 // Related memories get 70% of original score
            });
            addedIds.add(relatedId);
          }
        }
      }
    }
    
    return expanded;
  }

  /**
   * Generate reasoning for why these memories were selected
   */
  private generateReasoning(memories: MemoryItem[], context: RecallContext): string {
    if (memories.length === 0) {
      return "No relevant memories found for this context.";
    }
    
    const reasons = [];
    
    // Analyze what made these memories relevant
    const types = [...new Set(memories.map(m => m.type))];
    const projects = [...new Set(memories.map(m => m.context.project).filter(Boolean))];
    const recentCount = memories.filter(m => 
      (Date.now() - m.timestamp.getTime()) < (7 * 24 * 60 * 60 * 1000)
    ).length;
    
    if (context.intent === 'planning' && types.includes('deadline')) {
      reasons.push("surfaced deadline information for planning context");
    }
    
    if (context.intent === 'troubleshooting' && types.includes('config')) {
      reasons.push("prioritized configuration details for troubleshooting");
    }
    
    if (projects.length > 0) {
      reasons.push(`focused on ${projects[0]} project context`);
    }
    
    if (recentCount > memories.length * 0.6) {
      reasons.push("emphasized recent information for relevance");
    }
    
    if (context.entities.length > 0) {
      reasons.push(`matched entities: ${context.entities.slice(0, 3).join(', ')}`);
    }
    
    return `Retrieved ${memories.length} memories by ${reasons.join(', ')}.`;
  }

  /**
   * Generate suggestions for follow-up queries
   */
  private generateSuggestions(memories: MemoryItem[], context: RecallContext): string[] {
    const suggestions = [];
    
    // Suggest related projects
    const projects = [...new Set(memories.map(m => m.context.project).filter(Boolean))];
    if (projects.length > 1) {
      suggestions.push(`Tell me about ${projects[1]} project`);
    }
    
    // Suggest related topics
    const topics = [...new Set(memories.flatMap(m => m.tags))];
    const relevantTopics = topics.filter(tag => 
      !context.query.toLowerCase().includes(tag.toLowerCase())
    ).slice(0, 2);
    
    relevantTopics.forEach(topic => {
      suggestions.push(`What do you remember about ${topic}?`);
    });
    
    // Intent-specific suggestions
    switch (context.intent) {
      case 'planning':
        if (memories.some(m => m.type === 'task')) {
          suggestions.push("What are my upcoming deadlines?");
        }
        break;
      case 'troubleshooting':
        if (memories.some(m => m.type === 'config')) {
          suggestions.push("Show me similar issues I've encountered");
        }
        break;
    }
    
    return suggestions.slice(0, 3);
  }

  /**
   * Helper methods for text processing and similarity
   */
  private extractEntities(text: string): string[] {
    // Simple entity extraction - could be enhanced with NLP
    const entities = [];
    
    // Extract capitalized words (potential proper nouns)
    const capitalizedWords = text.match(/\b[A-Z][a-z]+\b/g) || [];
    entities.push(...capitalizedWords);
    
    // Extract technical terms (words with dots, underscores, etc.)
    const technicalTerms = text.match(/\b\w+[._-]\w+\b/g) || [];
    entities.push(...technicalTerms);
    
    // Extract dates
    const dates = text.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g) || [];
    entities.push(...dates);
    
    return [...new Set(entities)];
  }

  private categorizeContent(content: string, type: MemoryItem['type']): string {
    const lowerContent = content.toLowerCase();
    
    if (type === 'project') return 'project';
    if (type === 'deadline') return 'time-sensitive';
    if (type === 'config') return 'technical';
    
    // Content-based categorization
    if (lowerContent.includes('error') || lowerContent.includes('bug')) return 'troubleshooting';
    if (lowerContent.includes('plan') || lowerContent.includes('schedule')) return 'planning';
    if (lowerContent.includes('learn') || lowerContent.includes('understand')) return 'learning';
    if (lowerContent.includes('create') || lowerContent.includes('build')) return 'development';
    
    return 'general';
  }

  private generateTags(content: string, type: MemoryItem['type'], context: Partial<MemoryItem['context']>): string[] {
    const tags = [];
    const lowerContent = content.toLowerCase();
    
    // Type-based tags
    tags.push(type);
    
    // Context-based tags
    if (context.project) tags.push(context.project);
    if (context.topic) tags.push(...context.topic.split(' '));
    
    // Content-based tags
    const keywords = [
      'deadline', 'config', 'error', 'solution', 'plan', 'schedule',
      'meeting', 'task', 'bug', 'feature', 'api', 'database',
      'frontend', 'backend', 'design', 'testing', 'deployment'
    ];
    
    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    return [...new Set(tags)];
  }

  private calculateImportance(content: string, type: MemoryItem['type'], context: Partial<MemoryItem['context']>): number {
    let importance = 5; // Base importance
    
    // Type-based importance
    switch (type) {
      case 'deadline': importance = 9; break;
      case 'config': importance = 7; break;
      case 'project': importance = 8; break;
      case 'insight': importance = 7; break;
      case 'preference': importance = 6; break;
      case 'task': importance = 6; break;
      case 'fact': importance = 5; break;
      case 'conversation': importance = 4; break;
    }
    
    // Content-based adjustments
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('critical') || lowerContent.includes('urgent')) importance += 2;
    if (lowerContent.includes('important') || lowerContent.includes('key')) importance += 1;
    if (lowerContent.includes('note') || lowerContent.includes('remember')) importance += 1;
    
    return Math.min(importance, 10);
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple word overlap similarity
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private async establishRelationships(memory: MemoryItem): Promise<void> {
    // Find related memories based on content similarity and shared entities
    const allMemories = Array.from(this.memories.values());
    
    for (const otherMemory of allMemories) {
      if (otherMemory.id === memory.id) continue;
      
      let relationshipScore = 0;
      
      // Entity overlap
      const sharedEntities = (memory.context.entities || []).filter(entity =>
        (otherMemory.context.entities || []).includes(entity)
      );
      relationshipScore += sharedEntities.length * 10;
      
      // Project match
      if (memory.context.project && memory.context.project === otherMemory.context.project) {
        relationshipScore += 20;
      }
      
      // Tag overlap
      const sharedTags = memory.tags.filter(tag => otherMemory.tags.includes(tag));
      relationshipScore += sharedTags.length * 5;
      
      // Content similarity
      const contentSimilarity = this.calculateTextSimilarity(memory.content, otherMemory.content);
      relationshipScore += contentSimilarity * 15;
      
      // Establish relationship if score is high enough
      if (relationshipScore > 25) {
        if (!memory.relationships.includes(otherMemory.id)) {
          memory.relationships.push(otherMemory.id);
        }
        if (!otherMemory.relationships.includes(memory.id)) {
          otherMemory.relationships.push(memory.id);
        }
      }
    }
  }

  private updateIndexes(memory: MemoryItem): void {
    // Update type index
    if (!this.indexes.byType.has(memory.type)) {
      this.indexes.byType.set(memory.type, new Set());
    }
    this.indexes.byType.get(memory.type)!.add(memory.id);
    
    // Update category index
    if (!this.indexes.byCategory.has(memory.category)) {
      this.indexes.byCategory.set(memory.category, new Set());
    }
    this.indexes.byCategory.get(memory.category)!.add(memory.id);
    
    // Update tag indexes
    memory.tags.forEach(tag => {
      if (!this.indexes.byTag.has(tag)) {
        this.indexes.byTag.set(tag, new Set());
      }
      this.indexes.byTag.get(tag)!.add(memory.id);
    });
    
    // Update project index
    if (memory.context.project) {
      if (!this.indexes.byProject.has(memory.context.project)) {
        this.indexes.byProject.set(memory.context.project, new Set());
      }
      this.indexes.byProject.get(memory.context.project)!.add(memory.id);
    }
    
    // Update entity indexes
    (memory.context.entities || []).forEach(entity => {
      const key = entity.toLowerCase();
      if (!this.indexes.byEntity.has(key)) {
        this.indexes.byEntity.set(key, new Set());
      }
      this.indexes.byEntity.get(key)!.add(memory.id);
    });
    
    // Update temporal index
    const timeKey = this.getTimeKey(memory.timestamp);
    if (!this.indexes.temporal.has(timeKey)) {
      this.indexes.temporal.set(timeKey, new Set());
    }
    this.indexes.temporal.get(timeKey)!.add(memory.id);
  }

  private getTimeKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private getRecentMemories(limit: number): MemoryItem[] {
    return Array.from(this.memories.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private getMaxResults(context: RecallContext): number {
    switch (context.urgency) {
      case 'high': return 3;
      case 'medium': return 5;
      case 'low': return 8;
      default: return 5;
    }
  }

  private calculateConfidence(memories: MemoryItem[], context: RecallContext): number {
    if (memories.length === 0) return 0;
    
    const avgImportance = memories.reduce((sum, m) => sum + m.importance, 0) / memories.length;
    const avgConfidence = memories.reduce((sum, m) => sum + m.metadata.confidence, 0) / memories.length;
    const entityMatchRatio = context.entities.length > 0 ? 
      memories.filter(m => 
        (m.context.entities || []).some(entity => 
          context.entities.includes(entity)
        )
      ).length / memories.length : 0.5;
    
    return Math.min((avgImportance / 10 * 0.4 + avgConfidence * 0.4 + entityMatchRatio * 0.2), 1);
  }

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const data = {
          memories: Array.from(this.memories.entries()),
          timestamp: Date.now()
        };
        localStorage.setItem('contextual_memory', JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save contextual memory:', error);
      }
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('contextual_memory');
        if (stored) {
          const data = JSON.parse(stored);
          this.memories = new Map(data.memories.map(([id, memory]: [string, any]) => [
            id,
            {
              ...memory,
              timestamp: new Date(memory.timestamp),
              lastAccessed: new Date(memory.lastAccessed),
              metadata: {
                ...memory.metadata,
                expires: memory.metadata.expires ? new Date(memory.metadata.expires) : undefined
              }
            }
          ]));
          
          // Rebuild indexes
          this.memories.forEach(memory => this.updateIndexes(memory));
        }
      } catch (error) {
        console.warn('Failed to load contextual memory:', error);
      }
    }
  }

  /**
   * Public methods for memory management
   */
  
  async clearExpiredMemories(): Promise<number> {
    const now = new Date();
    let cleared = 0;
    
    for (const [id, memory] of this.memories.entries()) {
      if (memory.metadata.expires && memory.metadata.expires < now) {
        this.memories.delete(id);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      // Rebuild indexes
      this.indexes = {
        byType: new Map(),
        byCategory: new Map(),
        byTag: new Map(),
        byProject: new Map(),
        byEntity: new Map(),
        temporal: new Map()
      };
      
      this.memories.forEach(memory => this.updateIndexes(memory));
      this.saveToStorage();
    }
    
    return cleared;
  }

  getMemoryStats(): {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    avgImportance: number;
  } {
    const memories = Array.from(this.memories.values());
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    
    memories.forEach(memory => {
      byType[memory.type] = (byType[memory.type] || 0) + 1;
      byCategory[memory.category] = (byCategory[memory.category] || 0) + 1;
    });
    
    const avgImportance = memories.length > 0 
      ? memories.reduce((sum, m) => sum + m.importance, 0) / memories.length 
      : 0;
    
    return {
      total: memories.length,
      byType,
      byCategory,
      avgImportance
    };
  }

  getAllMemories(): MemoryItem[] {
    return Array.from(this.memories.values());
  }

  deleteMemory(memoryId: string): boolean {
    const deleted = this.memories.delete(memoryId);
    if (deleted) {
      // Rebuild indexes after deletion
      this.indexes = {
        byType: new Map(),
        byCategory: new Map(),
        byTag: new Map(),
        byProject: new Map(),
        byEntity: new Map(),
        temporal: new Map()
      };
      
      this.memories.forEach(memory => this.updateIndexes(memory));
      this.saveToStorage();
    }
    return deleted;
  }
}

// Singleton instance
let memorySystem: ContextualMemorySystem | null = null;

export function getContextualMemory(): ContextualMemorySystem {
  if (!memorySystem) {
    memorySystem = new ContextualMemorySystem();
  }
  return memorySystem;
}