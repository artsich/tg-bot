// Типы для глобальных настроек
export interface GlobalSettings {
  llm_model: string;
  history_max_len: number;
  stupid_check: number; // 0.0 - 1.0
  daily_jokes_time: string; // "HH:MM" format
  ai_instructions: string;
  stupidity_instructions: string;
  joke_instructions: string;
}

// Типы для чат-специфичных настроек
export interface ChatSettings {
  chat_id: number;
  stupidity_check: boolean;
}

// Типы для подписки на шутки
export interface JokeSubscription {
  chat_id: number;
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
  chat_id: number;
  chat_type?: ChatType;
  stupidity_check: boolean;
  joke_subscription?: JokeSubscription | null;
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
