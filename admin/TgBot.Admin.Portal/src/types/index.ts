// Типы для глобальных настроек
export interface GlobalSettings {
  llmModel: string;
  historyMaxLen: number;
  stupidCheck: number; // 0.0 - 1.0
  dailyJokesTime: string; // "HH:MM" format
  aiInstructions: string;
  stupidityInstructions: string;
  jokeInstructions: string;
}

// Типы для чат-специфичных настроек
export interface ChatSettings {
  chatId: number;
  stupidityCheck: boolean;
}

// Типы для подписки на шутки
export interface JokeSubscription {
  chatId: number;
  topic: string;
}

// Тип чата (если доступно)
export type ChatType =
  | "private"
  | "group"
  | "supergroup"
  | "channel"
  | "unknown";

// Расширенная информация о чате для списка
export interface ChatInfo {
  chatId: number;
  chatType?: ChatType;
  stupidityCheck: boolean;
  jokeSubscription?: JokeSubscription | null;
}

// API Response типы
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Error тип
export interface ApiError {
  message: string;
  code?: string;
}
