// Конфигурация API
// Когда будет готов бэкенд, изменить USE_MOCKS на false и указать API_URL

export const USE_MOCKS = false; // Переключение между моками и реальным API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Глобальные настройки
  globalSettings: '/settings/global',
  
  // Чат-специфичные настройки
  chats: '/chats',
  chatSettings: (chatId: number) => `/chats/${chatId}/settings`,
} as const;

