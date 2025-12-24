export interface GlobalSettings {
  llmModel: string;
  historyMaxLen: number;
  stupidCheck: number; // 0.0 - 1.0
  dailyJokesTime: string; // "HH:MM" format
  aiInstructions: string;
  stupidityInstructions: string;
  jokeInstructions: string;
}

export interface ChatSettings {
  chatId: number;
  stupidityCheck: boolean;
  jokeSubscribed: boolean;
  jokeTopic: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
