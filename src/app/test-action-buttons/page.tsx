'use client';

import { useState } from 'react';
import { ChatMessage } from '@/components/chat/chat-message';
import { type Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function TestActionButtonsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'Hello! Can you help me with a coding problem?',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Of course! I\'d be happy to help you with your coding problem. Please share the details of what you\'re working on, and I\'ll do my best to assist you.\n\n**Here are some ways I can help:**\n\n- Debug existing code\n- Explain programming concepts\n- Suggest best practices\n- Help with algorithm design\n- Review code for improvements\n\nWhat specific challenge are you facing?',
      createdAt: new Date().toISOString(),
      modelUsed: 'gpt-4',
      autoRouted: false,
    },
    {
      id: '3',
      role: 'user',
      content: 'I\'m trying to implement a binary search algorithm in JavaScript. Can you show me an example?',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      role: 'assistant',
      content: 'Absolutely! Here\'s a clean implementation of binary search in JavaScript:\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) {\n      return mid; // Found the target\n    } else if (arr[mid] < target) {\n      left = mid + 1; // Search right half\n    } else {\n      right = mid - 1; // Search left half\n    }\n  }\n  \n  return -1; // Target not found\n}\n\n// Example usage:\nconst sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];\nconsole.log(binarySearch(sortedArray, 7)); // Output: 3\nconsole.log(binarySearch(sortedArray, 4)); // Output: -1\n```\n\n**Key points:**\n- The array must be sorted\n- Time complexity: O(log n)\n- Space complexity: O(1)\n\nWould you like me to explain any part of this algorithm?',
      createdAt: new Date().toISOString(),
      modelUsed: 'claude-3',
      autoRouted: true,
    },
  ]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    console.log('Deleted message:', messageId);
  };

  const resetMessages = () => {
    setMessages([
      {
        id: '1',
        role: 'user',
        content: 'Hello! Can you help me with a coding problem?',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Of course! I\'d be happy to help you with your coding problem. Please share the details of what you\'re working on, and I\'ll do my best to assist you.\n\n**Here are some ways I can help:**\n\n- Debug existing code\n- Explain programming concepts\n- Suggest best practices\n- Help with algorithm design\n- Review code for improvements\n\nWhat specific challenge are you facing?',
        createdAt: new Date().toISOString(),
        modelUsed: 'gpt-4',
        autoRouted: false,
      },
      {
        id: '3',
        role: 'user',
        content: 'I\'m trying to implement a binary search algorithm in JavaScript. Can you show me an example?',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        role: 'assistant',
        content: 'Absolutely! Here\'s a clean implementation of binary search in JavaScript:\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) {\n      return mid; // Found the target\n    } else if (arr[mid] < target) {\n      left = mid + 1; // Search right half\n    } else {\n      right = mid - 1; // Search left half\n    }\n  }\n  \n  return -1; // Target not found\n}\n\n// Example usage:\nconst sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];\nconsole.log(binarySearch(sortedArray, 7)); // Output: 3\nconsole.log(binarySearch(sortedArray, 4)); // Output: -1\n```\n\n**Key points:**\n- The array must be sorted\n- Time complexity: O(log n)\n- Space complexity: O(1)\n\nWould you like me to explain any part of this algorithm?',
        createdAt: new Date().toISOString(),
        modelUsed: 'claude-3',
        autoRouted: true,
      },
    ]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold">Action Buttons Test</h1>
        <p className="text-muted-foreground">
          Test the action buttons (copy, hear, delete) on AI responses. Hover over messages to see the action buttons.
        </p>
        <Button onClick={resetMessages} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset Messages
        </Button>
      </div>

      <div className="space-y-6 border rounded-lg p-6 bg-muted/20">
        <h2 className="text-xl font-semibold mb-4">Chat Messages with Action Buttons</h2>
        
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onDelete={handleDeleteMessage}
          />
        ))}

        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            All messages deleted! Click "Reset Messages" to restore them.
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Features to Test:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Copy Button:</strong> Click to copy message content to clipboard</li>
          <li>• <strong>Hear Button (AI only):</strong> Click to read AI responses aloud with enhanced TTS</li>
          <li>• <strong>Delete Button:</strong> Click the more menu (⋯) and select delete to remove messages</li>
          <li>• <strong>Hover Effects:</strong> Action buttons appear when hovering over messages</li>
          <li>• <strong>Tooltips:</strong> Hover over buttons to see helpful tooltips</li>
        </ul>
      </div>
    </div>
  );
}