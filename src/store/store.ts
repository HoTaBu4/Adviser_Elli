import { createStore } from "vuex";
import user from "./modules/user";
import language from "./modules/language";
import chats from "./modules/chats";
import { UserState } from "./types/UserType";
import { LanguageState } from "./types/LanguageType";
import createPersistedState from "vuex-persistedstate";
import { ChatsState } from "./types/ChatType";
import selectedChat, { SelectedChatState } from "./modules/selectedChat";
import savedMessages, { SavedMessagesState } from "./modules/savedMessages";

export interface RootState {
  user: UserState;
  language: LanguageState;
  chats: ChatsState;
  selectedChat: SelectedChatState;
  savedMessages: SavedMessagesState;
}

const store = createStore<RootState>({
  modules: {
    user,
    language,
    chats,
    selectedChat,
    savedMessages,
  },
  plugins: [createPersistedState()],
});

export default store;
