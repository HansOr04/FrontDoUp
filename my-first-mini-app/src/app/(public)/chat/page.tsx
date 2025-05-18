'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

interface ChatSuggestion {
  text: string;
  action?: string;
}

interface ChatResponse {
  type: 'text' | 'search_results';
  message: string;
  suggestions?: ChatSuggestion[];
  categories?: any[];
  services?: any[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/chat/suggestions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setSuggestions(data.data.suggestions.map((text: string) => ({ text })));
          
          // Add welcome message
          setMessages([
            {
              id: 'welcome',
              type: 'assistant',
              message: '¡Hola! Soy el asistente virtual del Marketplace de Servicios. ¿En qué puedo ayudarte hoy?',
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchSuggestions();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Send message to API
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const chatResponse: ChatResponse = data.data;
        
        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          message: chatResponse.message,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        
        // Update suggestions
        if (chatResponse.suggestions) {
          setSuggestions(chatResponse.suggestions.map(suggestion => 
            typeof suggestion === 'string' 
              ? { text: suggestion } 
              : suggestion
          ));
        }
        
        // Handle search results
        if (chatResponse.type === 'search_results') {
          // In a real app, you might want to display the categories and services
          // For this example, we'll just log them
          console.log('Categories:', chatResponse.categories);
          console.log('Services:', chatResponse.services);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        message: 'Lo siento, ocurrió un error. Por favor, intenta de nuevo más tarde.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    handleSendMessage(suggestion.text);
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading chat assistant...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chat Assistant</h1>
          <p className="text-gray-600 mt-2">Ask questions about services or get help finding what you need</p>
        </div>
        
        <Card className="p-4 mb-6">
          <div className="flex flex-col h-[60vh]">
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              {suggestions.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full transition-colors"
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={!input.trim() || loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        </Card>
        
        <div className="text-center text-sm text-gray-600">
          <p>Need more specific help? Browse our <Link href="/categories" className="text-blue-600 hover:underline">service categories</Link> or <Link href="/services" className="text-blue-600 hover:underline">search for services</Link>.</p>
        </div>
      </div>
    </div>
  );
}