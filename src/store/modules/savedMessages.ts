import { Module } from "vuex";
import store, { RootState } from "../store";
import { LanguageState } from "../types/LanguageType";
import { Message, SavedMessage } from "../types/MessagesType";
import { deleteAllSavedMessages, deleteSavedMessage, getAllSavedMessages, saveUnsaveMessage} from "../../api/messages/messages";
import { fetchAllChats } from "./chats";

const DefaultState = {
  savedMessages: [],
  isLoading: false,
}


export interface SavedMessagesState {
  savedMessages: SavedMessage[];
  isLoading: boolean;
}

const state: SavedMessagesState = structuredClone(DefaultState);

const getters = {};

const mutations = {
  setLoading(state: SavedMessagesState, value: boolean) {
    state.isLoading = value;
  },
  setSavedMessages(state: SavedMessagesState, value: SavedMessage[]) {
    state.savedMessages = value;
  },
  deleteAllSavedMessages(state: SavedMessagesState) {
    state.savedMessages = [];
  },
  delSavedMessage(state: SavedMessagesState, messageId: number) {
    state.savedMessages = state.savedMessages.filter(
      (elem) => elem.id !== messageId,
    );
  },
  addSavedMessage(state: SavedMessagesState, newMessage: SavedMessage) {
    state.savedMessages.unshift(newMessage);
  },
  correctTheChatId(state: SavedMessagesState, messageId: number) {
    state.savedMessages.forEach((elem) => {
      if (elem.chat_id === messageId) {
        elem.chat_id = null;
      }
      return elem;
    })
  },
  reset(state: SavedMessagesState) {
    Object.assign(state, structuredClone(DefaultState));
  }
};

const actions = {
  async getSavedMessages({ commit }: any) {
    commit("setLoading", true);
    getAllSavedMessages()
      .then((data) => {
        commit("setSavedMessages", data);
      })
      .finally(() => {
        commit("setLoading", false);
      });
  },
  async deleteAllSavedMessages({ commit, dispatch ,rootState:rootState}: any) {
    commit("setLoading", true);
    deleteAllSavedMessages()
      .then(() => {
        commit("deleteAllSavedMessages");
        if (rootState.selectedChat.selectedChat.id) {
          dispatch('selectedChat/getChatHistory',rootState.rootState.selectedChat.selectedChat.id);
        }
      })
      .catch((error) => {
      })
      .finally(() => {
        fetchAllChats();
        commit("setLoading", false);
      });
  },
  async unsaveMessage(
    { commit }: any,
    payload: { chat_id: number; message: Message },
  ) {
    commit("setLoading", true);
    store.commit("selectedChat/saveUnsaveSpesificMessage", {
      messageId: payload.message.id,
      value: false,
    });
    saveUnsaveMessage(payload.chat_id, payload.message.id, false)
      .then((response) => {
        commit("delSavedMessage", payload.message.id);
      })
      .finally(() => commit("setLoading", false));
  },
  async saveMessage(
    { commit }: any,
    payload: { chat_id: number; message: Message },
  ) {
    commit("setLoading", true);
    store.commit("selectedChat/saveUnsaveSpesificMessage", {
      messageId: payload.message.id,
      value: true,
    });

    saveUnsaveMessage(payload.chat_id, payload.message.id, true)
      .then((response:any) => {
        const obj = {
          id: response[1].id,
          user_request: response[0].content,
          ai_response: response[1].content,
          chat_id: response[1].chat_id,
          user_message_id: response[0].id,
          ai_response_id: response[1].id,
        };
        commit("addSavedMessage", obj);
      })
      .finally(() => commit("setLoading", false));
  },
  async delSavedMessage({ commit }: any, messageId: number) {
    deleteSavedMessage(messageId).then(() => {
      commit("delSavedMessage", messageId);
    });
  },
};

const language: Module<LanguageState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default language;

export const getChatHistory = (chatId: number) => {
  store.dispatch("selectedChat/getChatHistory", chatId);
};

export const getSavedMessages = () => {
  store.dispatch("savedMessages/getSavedMessages");
};
export const removeAllSavedMessages = () => {
  store.dispatch("savedMessages/deleteAllSavedMessages")
};

export const removeSavedMessage = (chat_id: number, messsage_id: number) => {
  store.dispatch("savedMessages/unsaveMessage", { chat_id, messsage_id });
};

export const unsaveMessage = (chat_id: number, item: Message) => {
  store.dispatch("savedMessages/unsaveMessage", { chat_id, message: item });
};

export const saveMessage = (chat_id: number, item: Message) => {
  store.dispatch("savedMessages/saveMessage", { chat_id, message: item });
};

export const delSavedMessage = (messageId: number) => {
  store.dispatch("savedMessages/delSavedMessage", messageId);
};
