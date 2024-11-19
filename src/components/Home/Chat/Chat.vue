<script setup lang="ts">
import { ref, onMounted, nextTick, PropType, onUnmounted, reactive} from "vue";
import ChatItem from "../ChatItem/ChatItem.vue";
import {
  createMessage,
  SelectedChatState,
} from "../../../store/modules/selectedChat";
import { client } from "../../../api/fetchClient";
import {
  AiResponseMessage,
  Message,
} from "../../../store/types/MessagesType";
import store from "../../../store/store";
import { Chat } from "../../../store/types/ChatType";
import themesInfo from "../../../assets/ThemesData/ThemesData";

const props = defineProps({
  guestChat: {
    type: Boolean,
    required: true,
  },
  theme: {
    type: Number,
  },
  newCreatedChat: {
    type: Boolean,
  },
  selectedChat: {
    type: Object as PropType<SelectedChatState>,
  },
  guestChatId: {
    type: Number,
    default: null,
  },
  selectedtheme: {
    type: Number,
  },
  selectedThemeGuest: {
    type: Number,
  },
});

const emit = defineEmits(["guestQuestion", "shoseTheme", "resetTheme"]);

const text = ref<string>("");
const overflow = ref<boolean>(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const maxRows = ref<number>(5);
const chatsItems = reactive<Message[]>([]);
const createdChatUser = ref<Chat | null>(null);
const guestGettingAnswer = ref<boolean>(false)

function autoResize() {
  const textarea = textareaRef.value;
  if (!textarea) return;

  textarea.style.height = "auto"; // Скидаємо висоту для коректного вимірювання
  const scrollHeight = textarea.scrollHeight;
  const lineHeight = parseFloat(window.getComputedStyle(textarea).lineHeight);
  const rows = Math.floor(scrollHeight / lineHeight);

  if (rows > maxRows.value) {
    textarea.style.height = `${lineHeight * maxRows.value}px`; // Обмеження на висоту
    overflow.value = true;
  } else {
    textarea.style.height = `${scrollHeight}px`; // Автоматичне збільшення висоти
    overflow.value = false;
  }
}

const handleSubmit = () => {
  if (!props.selectedChat?.selecedSaveMessage && text.value.trim() !== "") {
    //for the guest messages
    if (props.guestChat && !!props.guestChatId && !guestGettingAnswer.value) {
      const lastIndex = chatsItems.length;
      
      chatsItems.push({
        content: text.value,
        is_ai_response: false,
        id: lastIndex + 1,
      });
      
      guestGettingAnswer.value = true
      
      store.commit("selectedChat/setIsAiTyping", true);
      client
        .post(`/chats/${props.guestChatId}/guest/message`, {
          content: text.value,
        })
        .then((data: { response: string }) => {
            chatsItems.push({
              content: data.response,
              is_ai_response: true,
              id: lastIndex + 1,
            });
        }).finally(() => guestGettingAnswer.value = false)
        
      text.value = ''
    //for the user first message
    } else if (
      !props.guestChat &&
      props.selectedChat?.selectedChat === null &&
      !props.selectedChat.isAiTyping
    ) {

      console.log('first message')
      const obj = {
        theme_id: props.selectedtheme,
      };
      const firstUserMessage = {
        content: text.value,
        id: 1,
        is_ai_response: false,
      };

      chatsItems.push(firstUserMessage);

      client.post("/chats/create", obj).then((data: Chat) => {
        createdChatUser.value = { ...data, messages: [] };

        createdChatUser.value.messages.push(firstUserMessage);
        
        store.commit("selectedChat/setIsAiTyping", true);
        client
          .post(`/chats/${data.id}/message`, { content: text.value })
          .then((data: AiResponseMessage) => {
            const chatData = {
              content: data.content,
              id: data.id,
              is_ai_response: data.is_ai_response,
            };

            createdChatUser.value?.messages.push(chatData);
            store.commit("chats/addChat", createdChatUser.value);
            store.commit("selectedChat/setSelectedChat", createdChatUser);
            store.commit("selectedChat/setIsAiTyping", true);
            emit("resetTheme");
          });
      });
    // for the user messages
    } else if (
      !props.guestChat &&
      props.selectedChat?.selectedChat &&
      !props.selectedChat.isAiTyping
    ) {
      console.log('second message')
      createMessage(props.selectedChat.selectedChat.id, text.value);
      text.value = "";
    }
  }
};

const createNewChat = () => {
  if (!props.guestChat) {
    emit("shoseTheme");
    store.commit("selectedChat/reset");
  } else {
    chatsItems.splice(0);
    emit("shoseTheme");
  }
};

onMounted(() => {
  nextTick(() => {
    autoResize();
  });
});

onUnmounted(() => {
  store.commit("selectedChat/setIsAiTyping", false);
})

</script>

<template>
  <div class="chat">
    <div class="chat__wrapper">
      <div class="chat__header">
      <button class="chat__header-button" @click="createNewChat">
        <svg
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="chat__header-button--svg"
        >
          <path
            d="M11.2605 5.75011C11.2609 5.84454 11.2425 5.93811 11.2063 6.02533C11.1701
              6.11255 11.1168 6.19166 11.0496 6.25802L5.80756 11.5001L11.0496 16.7422C11.1766
              16.8784 11.2457 17.0587 11.2424 17.2449C11.2392 17.4311 11.1637 17.6087 11.032
              17.7404C10.9003 17.8721 10.7227 17.9475 10.5365 17.9508C10.3503 17.9541 10.1701
              17.885 10.0338 17.758L4.28381 12.008C4.14921 11.8733 4.07361 11.6906 4.07361
              11.5001C4.07361 11.3096 4.14921 11.127 4.28381 10.9922L10.0338 5.24219C10.1686
              5.10759 10.3513 5.03199 10.5417 5.03199C10.7322 5.03199 10.9149 5.10759 11.0496
              5.24219C11.1168 5.30855 11.1701 5.38766 11.2063 5.47488C11.2425 5.5621 11.2609
              5.65567 11.2605 5.75011Z"
            class="chat__header-button--path"
          />
          <path
            d="M18.927 11.5C18.9246 11.6899 18.848 11.8712 18.7138 12.0055C18.5795
              12.1397 18.3981 12.2163 18.2083 12.2187L4.79163 12.2187C4.601 12.2187
              4.41818 12.143 4.28339 12.0082C4.1486 11.8734 4.07288 11.6906 4.07288
              11.5C4.07288 11.3094 4.1486 11.1266 4.28339 10.9918C4.41818 10.857
              4.601 10.7812 4.79163 10.7812L18.2083 10.7812C18.3981 10.7837 18.5795
              10.8603 18.7138 10.9945C18.848 11.1288 18.9246 11.3101 18.927 11.5Z"
            class="chat__header-button--path"
          />
        </svg>
      </button>
      <!-- for user  -->
      <div class="chat__title" v-if="selectedChat?.selectedChat">
        {{ themesInfo[selectedChat?.selectedChat?.theme_id - 1].name }}
      </div>
      <div class="chat__img-wrapper" v-if="selectedChat?.selectedChat">
        <img :src="themesInfo[selectedChat?.selectedChat?.theme_id - 1].url" alt="" class="chat__img" />
      </div>
      <div class="chat__title" v-if="newCreatedChat && selectedtheme">
        {{ themesInfo[selectedtheme - 1].name }}
      </div>
      <div class="chat__img-wrapper" v-if="newCreatedChat && selectedtheme">
        <img :src="themesInfo[selectedtheme - 1].url" alt="" class="chat__img" />
      </div>
      <!-- for guest -->
      <div class="chat__title" v-if="guestChat && selectedThemeGuest">
        {{ themesInfo[selectedThemeGuest - 1].name }}
      </div>
      <div class="chat__img-wrapper" v-if="guestChat && selectedThemeGuest">
        <img :src="themesInfo[selectedThemeGuest - 1].url" alt="" class="chat__img" />
      </div>
      </div>
      <div class="chat__main">
        <ChatItem
          v-if="!guestChat && selectedChat?.selectedChat"
          v-for="(item, index) in selectedChat.selectedChat.messages"
          :item
          :key="item.id"
          :isLastItem="index === selectedChat.selectedChat.messages.length - 1"
          :chatId="props.selectedChat?.selectedChat?.id"
        />
        <ChatItem
          v-if="
            !guestChat &&
            selectedChat?.selecedSaveMessage === null &&
            selectedChat.selectedChat === null
          "
          v-for="(item, index) in chatsItems"
          :item
          :key="item.id"
          :isLastItem="index === chatsItems.length"
          :chatId="props.selectedChat?.selectedChat?.id"
        />
        <ChatItem
          v-if="guestChat"
          v-for="(item, index) in chatsItems"
          :item
          :key="item.id"
          :isLastItem="index === chatsItems.length"
          :guestChat="true"
        />

        <!-- for the savedMessage -->
        <ChatItem
          v-if="selectedChat?.selecedSaveMessage"
          :selectedMessage="selectedChat?.selecedSaveMessage.user_request"
          :savedMessage="selectedChat?.selecedSaveMessage?.user_request"
          :isAiResponse="false"
        />
        <ChatItem
          v-if="selectedChat?.selecedSaveMessage"
          :selectedMessage="selectedChat?.selecedSaveMessage.user_request"
          :savedMessage="selectedChat?.selecedSaveMessage?.ai_response"
          :isAiResponse="true"
        />
      </div>
      <form class="chat__form" @submit.prevent="handleSubmit">
        <div class="chat__request">
          <div class="chat__textarea-container">
            <textarea
              v-model="text"
              ref="textareaRef"
              @input="autoResize"
              :rows="1"
              :style="{ overflowY: overflow ? 'scroll' : 'hidden' }"
              maxlength="500"
              class="chat__textarea"
              placeholder="CLARIFY YOUR REQUEST"
            ></textarea>
          </div>
          <button type="submit" class="chat__request-controller">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="chat__img"
            >
              <path
                d="M15.4648 25.5C14.375 25.5 14.0117 24.6328 13.6602 23.4492L11.1992 15.0938
                  L2.73828 12.6094C1.61328 12.2695 0.792969 11.9062 0.792969 10.8281C0.792969 
                  9.97266 1.55469 9.375 2.53906 9L22.6953 1.27734C23.2344 1.06641 23.7148 
                  0.949219 24.1133 0.949219C24.875 0.949219 25.3438 1.41797 25.3438 2.17969
                  C25.3438 2.57812 25.2266 3.05859 25.0156 3.59766L17.3398 23.6484C16.9062 
                  24.7734 16.3086 25.5 15.4648 25.5ZM11.7266 13.3125L19.7891 5.25C20.4336 
                  4.60547 21.3945 3.85547 22.168 3.22266C21.3008 3.62109 20.3984 4.08984 
                  19.4609 4.44141L3.61719 10.4414C3.44141 10.5117 3.39453 10.5703 3.39453 
                  10.6523C3.39453 10.7344 3.45312 10.7812 3.64062 10.8398L11.7266 13.3125ZM
                  15.6523 22.9219C15.7344 22.9219 15.7812 22.8516 15.8516 22.6758L21.8516 
                  6.83203C22.2031 5.88281 22.6836 4.98047 23.082 4.08984C22.4609 4.88672 
                  21.6758 5.87109 21.043 6.50391L12.9805 14.5664L15.4531 22.6523C15.5117 
                  22.8398 15.5586 22.9219 15.6523 22.9219Z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
@import "./Chat.scss";
</style>
