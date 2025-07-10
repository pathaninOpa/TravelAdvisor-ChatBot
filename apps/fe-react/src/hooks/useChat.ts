import { useState, useCallback } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import { chatApi } from '@/services/chatApi';
import { useToast } from '@/hooks/use-toast';

export const useChat = () => {
  const { toast } = useToast();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    error: null,
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addMessage = useCallback((message: string, isUser: boolean): ChatMessage => {
    const newMessage: ChatMessage = {
      id: generateId(),
      message,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage;
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    addMessage(message, true);

    // Set typing state
    setChatState(prev => ({
      ...prev,
      isTyping: true,
      error: null,
    }));

    try {
      const response = await chatApi.sendMessage(message);

      if (response.success) {
        // Add bot response
        addMessage(response.response, false);
      } else {
        // Handle API error
        setChatState(prev => ({
          ...prev,
          error: response.error || 'Failed to get response',
        }));

        toast({
          title: "Connection Error",
          description: response.error || "Failed to connect to TravelBuddy. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = 'Network error. Please check your connection.';
      setChatState(prev => ({
        ...prev,
        error: errorMessage,
      }));

      toast({
        title: "Network Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setChatState(prev => ({
        ...prev,
        isTyping: false,
      }));
    }
  }, [addMessage, toast]);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isTyping: false,
      error: null,
    });
  }, []);

  return {
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    error: chatState.error,
    sendMessage,
    clearChat,
  };
};