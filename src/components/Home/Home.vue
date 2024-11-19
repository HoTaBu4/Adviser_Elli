<script setup lang="ts">
import Burger from "./Burger/Burger.vue";
import Sidebar from "./SideBar/Sidebar.vue";
import SelectTheme from "./SelectTheme/SelectTheme.vue";
import { ref, onMounted, onBeforeUnmount, computed, ComputedRef } from "vue";
import SettingsModal from "./SettingsModal/MenuModal.vue";
import { useStore } from "vuex";
import { RootState } from "../../store/store";
import { AuthenticationTypes } from "../../assets/types/AuthenticationType";
import Chat from "./Chat/Chat.vue";
import { User } from "../../store/types/UserType";
import { Chat as ChatType, ChatsState } from "../../store/types/ChatType";
import { SelectedChatState } from "../../store/modules/selectedChat";
import { client } from "../../api/fetchClient";
import { useLanguage } from "../../assets/hooks/useLanguage";
import { Languages } from "../../store/types/LanguageType";
import { setCookie } from "../../assets/cookie";

const isOpenSidebar = ref(false);
const isOpenMenu = ref(false);
const isOpenModal = ref<null | string>(null);
const windowWidth = ref(window.innerWidth);
const selectedtheme = ref<null | number>(null);
const isOpenSelectTheme = ref(false);
const selectedThemeGuest = ref<null | number>(null);
const createdChatId = ref<number | undefined>(undefined);
const createdChatUser = ref<ChatType | undefined>(undefined);

const store = useStore<RootState>();

const user: User = store.state.user.user;
const chats: ChatsState = store.state.chats;
const selectedChat: SelectedChatState = store.state.selectedChat;

const { language } = useLanguage();

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

const handleStartGuest = () => {
  isOpenSelectTheme.value = true;
};

const handleToggleSelectTheme = (state: boolean) => {
  isOpenSelectTheme.value = state;
};
const handleSelectTheme = (theme: number, isGuest: boolean = false) => {
  if (isGuest) {
    selectedThemeGuest.value = theme;
  } else {
    selectedtheme.value = theme;
  }
};

const createChatGuest = () => {
  const obj = {
    theme_id: selectedThemeGuest.value,
    user_id: null,
  };
  client.post("/chats/guest/create", obj).then((data: { id: number }) => {
    if (data) {
      createdChatId.value = data.id;
      setCookie('guest_chat_data',{'chat_id': data.id, 'theme_id': selectedThemeGuest},3600)
    }
  });
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const handleOpenModal = (type: string) => {
  isOpenModal.value = type;
};

if (
  selectedChat.selecedSaveMessage !== null ||
  selectedChat.selectedChat !== null
) {
  selectedtheme.value = null;
}
</script>

<template>
  <div class="home__container">
    <header class="home-header">
      <div class="home-header__container">
        <Burger
          :isOpenSidebar
          @toggle-sidebar="isOpenSidebar = !isOpenSidebar"
          v-if="windowWidth <= 899"
        />
        <div class="home-header__icon">
          <img
            src="/pictures/icons/main__logo__tablet.png"
            alt=""
            class="home-header__icon--tablet"
          />
          <img
            src="/pictures/icons/main__logo_phone.png"
            alt=""
            class="home-header__icon--phone"
          />
          Ellie.ai
        </div>
        <div class="home-header__profile">
          <Transition name="menu">
            <div class="profile" v-if="isOpenMenu">
              <div class="profile__menu">
                <div
                  class="profile__menu-item"
                  @click="handleOpenModal('settings')"
                >
                  {{ language === Languages.us ? "Settings" : "Налаштування" }}
                </div>
                <div
                  class="profile__menu-item"
                  @click="handleOpenModal('account')"
                >
                  {{ language === Languages.us ? "Account" : "Профіль" }}
                </div>
              </div>
            </div>
          </Transition>
          <svg
            viewBox="0 0 27 28"
            xmlns="http://www.w3.org/2000/svg"
            class="home-header__profile--img"
            @click="isOpenMenu = !isOpenMenu"
            v-if="!user.isGuest"
          >
            <path
              d="M13.6953 27.377C6.4082 27.377 0.447266 21.416 0.447266 14.1289C0.447266 6.8418 6.4082 0.880859 13.6953 0.880859C20.9824 0.880859 26.9434 6.8418 26.9434 14.1289C26.9434 21.416 20.9824 27.377 13.6953 27.377ZM13.6953 18.5586C18.4531 18.5586 21.9121 20.9512 22.8281 22.7695C24.9746 20.5137 26.2734 17.4648 26.2734 14.1289C26.2734 7.18359 20.6406 1.55078 13.6953 1.55078C6.76367 1.55078 1.11719 7.18359 1.11719 14.1289C1.11719 17.4512 2.41602 20.4863 4.53516 22.7422C5.50586 20.9238 8.96484 18.5586 13.6953 18.5586ZM13.6953 16.1797C11.0703 16.1797 9.08789 13.9512 9.08789 11.0527C9.06055 8.33203 11.125 6.02148 13.6953 6.02148C16.252 6.02148 18.2891 8.33203 18.2891 11.0527C18.2891 13.9512 16.3066 16.1797 13.6953 16.1797Z"
              fill="#B1B0B4"
            />
          </svg>
          <RouterLink
            :to="{
              name: 'authentication',
              params: { type: AuthenticationTypes.login },
            }"
            class="home-header__log-in"
            v-if="user.isGuest"
          >
            LOG IN
          </RouterLink>
        </div>
      </div>
    </header>
    <main class="home">
      <div class="home__wrapper">
        <Transition name="settings_modal">
          <SettingsModal
            v-if="isOpenModal"
            @close-modal="isOpenModal = null"
            :type="isOpenModal"
          />
        </Transition>
        <Sidebar :isOpenSidebar />
        <SelectTheme
          v-if="isOpenSelectTheme"
          :isGuest="user.isGuest"
          @selectTheme="handleSelectTheme"
          @setCloseSelectTheme="handleToggleSelectTheme"
          @createChatGuest="createChatGuest"
        />
        <div
          class="home__start-chatting 1"
          v-if="
            !user.isGuest && chats.chats.length === 0 && selectedtheme === null
          "
        >
          <button @click="isOpenSelectTheme = true" class="home__start-button">
            start Chatting
          </button>
        </div>
        <div
          class="home__start-chatting 2"
          v-if="user.isGuest && selectedThemeGuest === null"
        >
          <button @click="handleStartGuest" class="home__start-button">
            start Chatting
          </button>
        </div>
        <Chat
          v-if="
            !user.isGuest &&
            selectedtheme !== null &&
            selectedChat.selectedChat === null &&
            selectedChat.selecedSaveMessage === null
          "
          :theme="selectedtheme"
          :newCreatedChat="true"
          :selectedChat
          :guestChat="false"
          :createdChatUser
          :selectedtheme
          @resetTheme="selectedtheme = null"
        />
        <Chat
          v-else-if="
            (!user.isGuest && selectedChat.selectedChat !== null) ||
            selectedChat.selecedSaveMessage !== null
          "
          :selectedChat
          :guestChat="false"
          @shoseTheme="isOpenSelectTheme = true"
        />
        <Chat
          v-else-if="user.isGuest && selectedThemeGuest !== null"
          :guestChatId="createdChatId"
          :guestChat="true"
          :selectedThemeGuest="selectedThemeGuest"
          @shoseTheme="isOpenSelectTheme = true"
        />
      </div>
    </main>
  </div>
</template>

<style>
@import "./HomeStyle.scss";
</style>
