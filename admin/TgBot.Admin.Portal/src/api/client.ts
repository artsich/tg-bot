import { USE_MOCKS, API_URL, API_ENDPOINTS } from '../config/api';
import { mockApi } from './mocks';
import type { GlobalSettings, ChatInfo, ChatSettings, ApiResponse, ApiError } from '../types';

// Реальный API клиент (будет использоваться когда бэкенд готов)
const realApi = {
  async getGlobalSettings(): Promise<ApiResponse<GlobalSettings>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.globalSettings}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateGlobalSettings(settings: Partial<GlobalSettings>): Promise<ApiResponse<GlobalSettings>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.globalSettings}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getChats(): Promise<ApiResponse<ChatInfo[]>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.chats}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getChatSettings(chatId: number): Promise<ApiResponse<ChatSettings & { joke_subscription?: { topic: string } | null }>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.chatSettings(chatId)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateChatSettings(
    chatId: number,
    settings: Partial<ChatSettings & { joke_topic?: string; joke_subscribed?: boolean }>
  ): Promise<ApiResponse<ChatSettings & { joke_subscription?: { topic: string } | null }>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.chatSettings(chatId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

// Экспортируем API клиент с автоматическим переключением между моками и реальным API
export const api = USE_MOCKS ? mockApi : realApi;

// Типы для удобства
export type ApiClient = typeof api;

