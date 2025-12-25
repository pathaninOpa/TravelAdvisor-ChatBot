import axios from 'axios';
import { ChatApiResponse } from '@/types/chat';

// Configure your Flask backend URL here
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 30 seconds timeout for travel recommendations
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatApiResponse> => {
    try {
      const response = await api.post('/chat', { message });
      
      return {
        response: response.data.response || response.data.message || 'No response received',
        success: true,
      };
    } catch (error) {
      console.error('Chat API error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            response: '',
            success: false,
            error: 'Request timed out. Please try again.',
          };
        }
        
        if (error.response?.status === 404) {
          return {
            response: '',
            success: false,
            error: 'Chat service not available. Please check your backend connection.',
          };
        }
        
        return {
          response: '',
          success: false,
          error: error.response?.data?.error || 'Failed to connect to travel advisor.',
        };
      }
      
      return {
        response: '',
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  },
};