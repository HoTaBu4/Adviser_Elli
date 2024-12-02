<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref } from "vue";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import { Languages } from "../../../store/types/LanguageType";
import { useStore } from "vuex";
import { RootState } from "../../../store/store";
import { UserState } from "../../../store/types/UserType";
import { fetchAllChats } from "../../../store/modules/chats";
import { Chat, ChatsState } from "../../../store/types/ChatType";
import SideBarItem from "./../SideBarItem/SideBarItem.vue";
import {
  getChatHistory,
  SelectedChatState,
} from "../../../store/modules/selectedChat";
import {
  getSavedMessages,
  SavedMessagesState,
} from "../../../store/modules/savedMessages";
import Loader from "../../CommonComponents/Loader/Loader.vue";

defineProps({
  isOpenSidebar: {
    type: Boolean,
    required: true,
  },
});

const isOpenSaved = ref(true);
const isOpenRequest = ref(true);

const { language } = useLanguage();

const store = useStore<RootState>();

const { user, isloading: isLoadingUser }: UserState = store.state.user;
const chats: ChatsState = store.state.chats;
const savedMessagesState: SavedMessagesState = store.state.savedMessages
// const isLoadingMessages = computed(() => savedMessagesState.value.isLoading);

onMounted(() => {
  if (!user.isGuest) {
    fetchAllChats();
    getSavedMessages();
  }

  if (chats.chats.length > 0 && !user.isGuest) {
    getChatHistory(chats.chats[0].id);
  }
});
</script>

<template>
  <aside class="aside" :class="{ open: isOpenSidebar }">
    <div class="aside__wrapper">
      <div
        class="aside__request"
        :class="{
          'full-height': isOpenRequest && !isOpenSaved,
          'half-height': isOpenRequest && isOpenSaved,
          closed: !isOpenRequest,
        }"
      >
        <div class="aside__controller" @click="isOpenRequest = !isOpenRequest">
          <div class="aside__title">
            {{
              language === Languages.uk ? "останні запити" : "recent request:"
            }}
          </div>
          <img
            src="/pictures/icons/arrow.svg"
            alt=""
            class="aside__arrow"
            :class="{ 'aside__arrow--isOpen': isOpenRequest }"
          />
        </div>
        <div class="aside__container">
          <div class="aside__red-notice" v-if="user.isGuest">
            {{
              language === Languages.uk
                ? `Bи не можете отримати доступ до історії пошуку чи збережених рекомендацій, якщо ви увійшли як гість.`
                : `You can&#39;t access your search history or saved recommendations since you logged in as a guest.`
            }}
          </div>
          <div
            class="aside__info"
            v-if="!user.isGuest && !isLoadingUser && chats.chats.length === 0 && !chats.isloading"
          >
            {{
              language === Languages.uk
                ? `ви немаєте покищо чатів`
                : `You currently have no active chats.`
            }}
          </div>
          <div
            class="aside__container--items"
            v-if="!user.isGuest && !isLoadingUser && chats.chats.length > 0"
          >
            <SideBarItem v-for="chat in chats.chats" :key="chat.id" :chat="chat" />
          </div>
          <div class="aside__loader-wrapper" v-if="chats.isloading">
            <Loader :size="30"/>
          </div>
        </div>
      </div>
      <div
        class="aside__saved"
        :class="{
          'full-height': isOpenSaved && !isOpenRequest,
          'half-height': isOpenSaved && isOpenRequest,
          closed: !isOpenSaved,
        }"
      >
        <div class="aside__controller" @click="isOpenSaved = !isOpenSaved">
          <div class="aside__title">
            {{ language === Languages.uk ? "збережені:" : `saved:` }}
          </div>
          <img
            src="/pictures/icons/arrow.svg"
            alt=""
            class="aside__arrow"
            :class="{ 'aside__arrow--isOpen': isOpenSaved }"
          />
        </div>
        <div class="aside__container">
          <div class="aside__red-notice" v-if="user.isGuest">
            {{
              language === Languages.uk
                ? `Bи не можете отримати доступ до історії пошуку чи збережених рекомендацій, якщо ви увійшли як гість.`
                : `You can&#39;t access your search history or saved recommendations since you logged in as a guest.`
            }}
          </div>
          <div
            class="aside__container--items"
            v-if="!user.isGuest && !savedMessagesState.isLoading"
          >
            <SideBarItem
              v-for="item in savedMessagesState.savedMessages"
              :key="item.id"
              :savedMessage="item"
              :saved="true"
            />
            <div
              class="aside__info"
              v-if="!user.isGuest && !isLoadingUser && savedMessagesState.savedMessages.length === 0"
            >
              {{
                language === Languages.uk
                  ? `ви немаєте збережених повідомлень`
                  : `You currently have no saved messages.`
              }}
            </div>
          </div>
          <div class="aside__loader-wrapper" v-if="savedMessagesState.isLoading">
            <Loader :size="30"/>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style>
@import "./sidebar.scss";
</style>
