export interface Message {
  id: number;
  content: string;
  is_ai_response: boolean;
  is_saved?: boolean;
}
export interface AiResponseMessage {
  content: string;
  chat_id: number;
  is_ai_response: boolean;
  id: number;
  created_at: string;
  is_saved: boolean;
}

export interface Question {
  content: string;
}

export interface SavedMessage {
  id: number;
  user_request: string;
  ai_response: string;
  chat_id: number | null;
  user_message_id: number;
  ai_response_id: number;
}

export interface saveMessageResponse {
  id: number;
  content: string;
  is_ai_response: boolean;
}
