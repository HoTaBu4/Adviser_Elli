export interface chat {
  id: number;
  created_at: string;
  theme_id: number;
  user_id: number;
  is_saved: boolean;
}

export interface createChatType {
  theme_id: number;
  user_id: number;
}
