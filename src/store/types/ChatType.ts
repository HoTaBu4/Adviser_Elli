import { Message } from "./MessagesType";

export interface ChatsState {
  chats: Chat[];
  chatToDelete: Chat | null;
  isloading: boolean;
  deleteIndex: number;
}

export interface Chat {
  id: number;
  created_at: string;
  theme_id: number;
  user_id: number;
  is_saved: boolean;
  messages: Message[];
}

export interface responseDetails {
  detail: string;
}
