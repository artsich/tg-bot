import { API_URL, API_ENDPOINTS } from "../config/api";
import type { GlobalSettings, ChatSettings, ApiResponse } from "../types";

export const api = {
  async getGlobalSettings(): Promise<ApiResponse<GlobalSettings>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.globalSettings}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateGlobalSettings(
    settings: Partial<GlobalSettings>
  ): Promise<ApiResponse<GlobalSettings>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.globalSettings}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getChats(): Promise<ApiResponse<ChatSettings[]>> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.chats}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getChatSettings(chatId: number): Promise<ApiResponse<ChatSettings>> {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.chatSettings(chatId)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateChatSettings(
    chatId: number,
    settings: {
      stupidityCheck: boolean;
      jokeSubscribed: boolean;
      jokeTopic: string;
    }
  ): Promise<ApiResponse<ChatSettings>> {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.chatSettings(chatId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

export type ApiClient = typeof api;
