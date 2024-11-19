<script setup lang="ts">
import { PropType } from "vue";
import {
  getChatHistory,
  SelectedChatState,
} from "../../../store/modules/selectedChat";
import { deleteChat } from "../../../store/modules/chats";
import { Chat, ChatsState } from "../../../store/types/ChatType";
import { RootState } from "../../../store/store";
import { useStore } from "vuex";
import { Message, SavedMessage } from "../../../store/types/MessagesType";
import {
  delSavedMessage,
  getSavedMessages,
  removeAllSavedMessages,
  unsaveMessage,
} from "../../../store/modules/savedMessages";
import { deleteSavedMessage } from "../../../api/messages/messages";

const props = defineProps({
  chat: {
    type: Object as PropType<Chat>,
    required: false,
  },
  saved: {
    type: Boolean,
    required: false,
    default: false,
  },
  savedMessage: {
    type: Object as PropType<SavedMessage>,
    required: false,
  },
});

const store = useStore<RootState>();

const selectedChat: SelectedChatState = store.state.selectedChat;
const chats: ChatsState = store.state.chats;

const handleSelectChat = () => {
  if (!props.saved && props.chat?.id) {
    getChatHistory(props.chat.id);
  } else if (props.saved) {
    store.commit("selectedChat/setSelectedSavedMessage", props.savedMessage);
  }
};

const handleDeleteItem = () => {
  if (props.chat && props.chat?.id) {
    deleteChat(props.chat?.id);
    getSavedMessages();
    if (selectedChat.selectedChat?.id === props.chat?.id) {
      store.commit("selectedChat/resetChatAndSavedMessage");
    }
  } else if (props.savedMessage) {
    if (props.savedMessage.chat_id === null) {
      delSavedMessage(props.savedMessage.id);
    } else {
      unsaveMessage(props.savedMessage.chat_id, props.savedMessage);
    }
  }
};
</script>

<template>
  <div class="sidebarItem" @click.stop="handleSelectChat">
    <span class="sidebarItem__text">
      {{
        savedMessage ? savedMessage.user_request : chat?.messages[0]?.content
      }}
    </span>

    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="sidebarItem__svg"
      @click.stop="handleDeleteItem"
    >
      <path
        d="M3.48438 15.5439C2.5957 15.5439 1.97363 14.9355 1.93262 14.0605L1.41992 
        3.85449H0.442383C0.230469 3.85449 0.0458984 3.67676 0.0458984 3.45801C0.0458984 
        3.23926 0.230469 3.05469 0.442383 3.05469H3.66211V1.94727C3.66211 1.02441 4.25684 
        0.470703 5.24121 0.470703H7.91406C8.89844 0.470703 9.5 1.02441 9.5 1.94727V3.05469H12.7197 
        C12.9385 3.05469 13.1162 3.23242 13.1162 3.45801C13.1162 3.67676 12.9453 3.85449 12.7197 
        3.85449H11.749L11.2432 14.0605C11.2021 14.9355 10.5664 15.5439 9.68457 15.5439H3.48438ZM4.49609 
        1.98828V3.05469H8.65918V1.98828C8.65918 1.53711 8.3584 1.25684 7.87305 1.25684H5.28223C4.80371 
        1.25684 4.49609 1.53711 4.49609 1.98828ZM3.55273 14.7441H9.60938C10.0469 14.7441 10.3887 
        14.4092 10.4092 13.9717L10.8945 3.85449H2.24707L2.75977 13.9717C2.78027 14.4092 3.12207 
        14.7441 3.55273 14.7441ZM4.54395 13.4248C4.33887 13.4248 4.20898 13.2949 4.20215 13.1035L3.97656 
        5.54297C3.97656 5.35156 4.11328 5.22168 4.31836 5.22168C4.50977 5.22168 4.64648 5.34473 
        4.65332 5.53613L4.87891 13.1035C4.88574 13.2881 4.74902 13.4248 4.54395 13.4248ZM6.58789 
        13.4248C6.38281 13.4248 6.23926 13.2949 6.23926 13.1035V5.54297C6.23926 5.35156 6.38281 
        5.22168 6.58789 5.22168C6.79297 5.22168 6.92969 5.35156 6.92969 5.54297V13.1035C6.92969 
        13.2949 6.79297 13.4248 6.58789 13.4248ZM8.625 13.4316C8.41992 13.4316 8.2832 13.2949 
        8.29004 13.1035L8.51562 5.53613C8.52246 5.34473 8.65918 5.22168 8.85059 5.22168C9.05566 
        5.22168 9.19238 5.35156 9.19238 5.5498L8.9668 13.1104C8.95996 13.3018 8.82324 13.4316 
        8.625 13.4316Z"
        class="sidebarItem__path"
      />
    </svg>
  </div>
</template>

<style lang="scss">
.sidebarItem {
  width: 100%;
  padding: 13px 45px 13px 20px;
  border-radius: 16px;
  transition: all 0.5s ease;
  display: flex;
  flex-direction: row;
  height: 94px;
  box-sizing: border-box;
  position: relative;
  color: white;
  display: flex;
  align-items: center;

  .sidebarItem__text {
    font-size: 17.5px;
    font-family: Inter, sans-serif;
    font-weight: 500;
    line-height: 34px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;

    @supports not (-webkit-line-clamp: 2) {
      white-space: normal;
      max-height: 68px;
      line-height: 34px;
    }
  }

  &__svg {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 90;
  }

  &__svg:hover &__path {
    fill: white;
  }

  &__path {
    transition: all 0.3s ease;
    fill: #6e757c;
  }

  &:hover {
    background-color: #101828;
  }
}
</style>
