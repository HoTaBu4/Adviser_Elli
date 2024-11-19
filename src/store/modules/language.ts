import { Module } from "vuex";
import { RootState } from "../store";
import { Languages, LanguageState } from "../types/LanguageType";

const state: LanguageState = {
  currentLanguage: Languages.us,
};

const getters = {
  language: (state: LanguageState) => state.currentLanguage,
};

const mutations = {
  setLanguage(state: LanguageState, language: string) {
    state.currentLanguage = language;
  },
};

const actions = {
  updateLanguage({ commit }: any, language: string = Languages.us) {
    commit("setLanguage", language);
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
