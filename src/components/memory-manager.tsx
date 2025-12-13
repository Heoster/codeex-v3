'use client';

import { useState, useEffect } from 'react';
import { Brain, Filter, Trash2, Eye, Tag, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { getContextualMemory, type MemoryItem } from '@/lib/contextual-memory';

interface MemoryManagerProps {
  onClose?: () => void;
}

export function MemoryManager({ onClose }: MemoryManagerProps) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<MemoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stats, setStats] = useState<any>({});
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  const memorySystem = getContextualMemory();

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    filterMemories();
  }, [memories, searchQuery, typeFilter, categoryFilter]);

  const loadMemories = () => {
    const allMemories = memorySystem.getAllMemories();
    setMemories(allMemories);
    setStats(memorySystem.getMemoryStats());
  };

  const filterMemories = () => {
    let filtered = memories;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(memory =>
        memory.content.toLowerCase().includes(query) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query)) ||
        memory.category.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(memory => memory.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(memory => memory.category === categoryFilter);
    }

    // Sort by importance and recency
    filtered.sort((a, b) => {
      const importanceScore = b.importance - a.importance;
      if (Math.abs(importanceScore) > 1) return importanceScore;
      return b.lastAccessed.getTime() - a.lastAccessed.getTime();
    });

    setFilteredMemories(filtered);
  };

  const deleteMemory = (memoryId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this memory?');
    if (confirmed) {
      memorySystem.deleteMemory(memoryId);
      loadMemories();
      setSelectedMemory(null);
    }
  };

  const clearExpiredMemories = async () => {
    const cleared = await memorySystem.clearExpiredMemories();
    if (cleared > 0) {
      loadMemories();
      alert(`Cleared ${cleared} expired memories.`);
    } else {
      alert('No expired memories found.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fact': return '📚';
      case 'preference': return '⚙️';
      case 'project': return '📁';
      case 'task': return '✅';
      case 'config': return '🔧';
      case 'deadline': return '⏰';
      case 'conversation': return '💬';
      case 'insight': return '💡';
      default: return '📝';
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'text-red-600 bg-red-100';
    if (importance >= 6) return 'text-orange-600 bg-orange-100';
    if (importance >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Contextual Memory Manager</h2>
        </div>
        <p className="text-muted-foreground">
          View and manage your AI's adaptive memory system
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total || 0}</div>
                <div className="text-sm text-muted-foreground">Total Memories</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.avgImportance?.toFixed(1) || '0.0'}</div>
                <div className="text-sm text-muted-foreground">Avg Importance</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{Object.keys(stats.byType || {}).length}</div>
                <div className="text-sm text-muted-foreground">Memory Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{Object.keys(stats.byCategory || {}).length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fact">Facts</SelectItem>
                <SelectItem value="preference">Preferences</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="config">Configurations</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
                <SelectItem value="conversation">Conversations</SelectItem>
                <SelectItem value="insight">Insights</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.keys(stats.byCategory || {}).map(category => (
                  <SelectItem key={category} value={category}>
                    {category} ({stats.byCategory[category]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearExpiredMemories}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Expired
            </Button>
            <Button variant="outline" size="sm" onClick={loadMemories}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Memory List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Memories ({filteredMemories.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMemories.map((memory) => (
              <Card 
                key={memory.id} 
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedMemory?.id === memory.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMemory(memory)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(memory.type)}</span>
                      <Badge variant="outline" className="text-xs">
                        {memory.type}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getImportanceColor(memory.importance)}`}
                      >
                        {memory.importance}/10
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(memory.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-sm line-clamp-2 mb-2">
                    {memory.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {memory.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{memory.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredMemories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No memories found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Memory Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Memory Details</h3>
          
          {selectedMemory ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(selectedMemory.type)}</span>
                    <div>
                      <CardTitle className="text-lg">{selectedMemory.type}</CardTitle>
                      <CardDescription>{selectedMemory.category}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMemory(selectedMemory.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  <p className="text-sm bg-muted p-3 rounded">
                    {selectedMemory.content}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Importance:</span>
                    <Badge className={`ml-2 ${getImportanceColor(selectedMemory.importance)}`}>
                      {selectedMemory.importance}/10
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Access Count:</span>
                    <span className="ml-2">{selectedMemory.accessCount}</span>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <span className="ml-2">{formatDate(selectedMemory.timestamp)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Last Accessed:</span>
                    <span className="ml-2">{formatDate(selectedMemory.lastAccessed)}</span>
                  </div>
                </div>
                
                {selectedMemory.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMemory.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedMemory.context.project && (
                  <div>
                    <h4 className="font-medium mb-2">Context</h4>
                    <div className="text-sm space-y-1">
                      {selectedMemory.context.project && (
                        <div><span className="font-medium">Project:</span> {selectedMemory.context.project}</div>
                      )}
                      {selectedMemory.context.topic && (
                        <div><span className="font-medium">Topic:</span> {selectedMemory.context.topic}</div>
                      )}
                      {selectedMemory.context.intent && (
                        <div><span className="font-medium">Intent:</span> {selectedMemory.context.intent}</div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedMemory.relationships.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Related Memories</h4>
                    <div className="text-sm text-muted-foreground">
                      {selectedMemory.relationships.length} related memories
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a memory to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-center pt-4">
          <Button onClick={onClose}>
            Close Memory Manager
          </Button>
        </div>
      )}
    </div>
  );
}