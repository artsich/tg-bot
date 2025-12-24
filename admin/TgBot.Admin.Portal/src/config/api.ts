export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:51580/api";

export const API_ENDPOINTS = {
  globalSettings: "/settings/global",
  chats: "/chats",
  chatSettings: (chatId: number) => `/chats/${chatId}/settings`,
} as const;
