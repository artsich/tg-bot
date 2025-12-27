export const API_URL = 
  import.meta.env.DEV ? "http://localhost:51580/api" : "/api";

export const API_ENDPOINTS = {
  globalSettings: "/settings/global",
  chats: "/chats",
  chatSettings: (chatId: number) => `/chats/${chatId}/settings`,
  health: "/health",
} as const;
