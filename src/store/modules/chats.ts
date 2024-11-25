import { Module } from "vuex";
import store, { RootState } from "../store";
import { Chat, ChatsState } from "../types/ChatType";
import {
  createChat,
  delAllChats,
  delChat,
  getAllChats,
} from "../../api/chats/chats";
import { createMessageByUser } from "../../api/messages/messages";
import { AiResponseMessage } from "../types/MessagesType";
import { resetTheUser } from "../../services/authService";

const initialState = {
  chats: [],
  chatToDelete: null,
  deleteIndex: -1,
  isloading: false,
};

const state: ChatsState = structuredClone(initialState);

const getters = {
  getChats: (state: ChatsState) => state.chats,
};

const mutations = {
  addChats(state: ChatsState, chats: Chat[]) {
    state.chats = chats;
  },
  setIsLoading(state: ChatsState, value: boolean) {
    state.isloading = value;
  },
  removeChat(state: ChatsState, chatId: number) {
    const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      state.chatToDelete = state.chats[chatIndex];
      state.deleteIndex = chatIndex;
      state.chats.splice(chatIndex, 1);
    }
  },
  addChat(state: ChatsState, chat: Chat) {
    state.chats.push(chat);
  },
  undoDeleteChat(state: ChatsState) {
    if (state.chatToDelete !== null && state.deleteIndex !== -1) {
      state.chats.splice(state.deleteIndex, 0, state.chatToDelete);
      state.chatToDelete = null;
      state.deleteIndex = -1;
    }
  },
  removeAllChats(state: ChatsState) {
    state.chats = [];
  },

  confirmDeleteChat(state: ChatsState) {
    state.chatToDelete = null;
    state.deleteIndex = -1;
  },
  reset(state: ChatsState) {
    Object.assign(state,structuredClone(initialState));
  },
};

const actions = {
  async fetchAllChats({ commit }: any) {
    commit("setIsLoading", true);
    getAllChats()
      .then((data:any) => {
        if (data.detail) {
          resetTheUser();
        } else {
          commit("addChats", data);
        }
      })
      .catch(() => {})
      .finally(() => {
        commit("setIsLoading", false);
      });
  },
  async deleteChat({ commit }: any, chatId: number) {
    commit("removeChat", chatId);
    delChat(chatId)
      .then(() => {
        commit("confirmDeleteChat");
      })
      .catch(() => {
        commit("undoDeleteChat");
      });
  },
  async deleteAllChats({ commit }: any) {
    delAllChats().then(() => {
      commit("removeAllChats");
    });
  },
  async addChat(
    { commit }: any,
    payload: { theme_id: number; user_id: number; question: string },
  ) {
    createChat({ theme_id: payload.theme_id, user_id: payload.user_id }).then(
      (data: Omit<Chat, "messages", "is_saved">) => {
        const obj = { content: payload.question };

        createMessageByUser(data.id, obj)
          .then((response: AiResponseMessage) => {
            const createdChat = {
              ...response,
              messages: [
                {
                  id: 1,
                  content: payload.question,
                  is_ai_response: false,
                },
              ],
            };

            commit("addChat", createdChat);
            store.commit("selectedChat/setSelectedChat", createdChat);
          })
          .catch((error) => {
            console.error("Error creating message:", error);
          });
      },
    );
  },
};

const chats: Module<ChatsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default chats;

export const fetchAllChats = () => {
  store.dispatch("chats/fetchAllChats");
};

export const deleteChat = (chatId: number) => {
  store.dispatch("chats/deleteChat", chatId);
};

export const deleteAllChats = () => {
  store.dispatch("chats/deleteAllChats");
  store.commit("selectedChat/reset")
};
