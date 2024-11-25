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
  if (!props.selectedChat?.selecedSaveMessage 
    && text.value.trim() !== "" 
    && !props.selectedChat?.isAiThinking
    && !props.selectedChat?.isAiTyping
  ) {
    //for the guest messages
    if (props.guestChat && !!props.guestChatId && !guestGettingAnswer.value) {
      const lastIndex = chatsItems.length;
      
      chatsItems.push({
        content: text.value,
        is_ai_response: false,
        id: lastIndex + 1,
      });
      
      guestGettingAnswer.value = true
      store.commit("selectedChat/setIsAiThinking", true);
      client
        .post(`/chats/${props.guestChatId}/guest/message`, {
          content: text.value,
        })
        .then((data: { response: string }) => {
          
          store.commit("selectedChat/setIsAiThinking", false);
            
          chatsItems.push({
            content: data.response,
            is_ai_response: true,
            id: lastIndex + 1,
          });
            
        }).finally(() => {
          guestGettingAnswer.value = false
          store.commit("selectedChat/setIsAiThinking", false);
        })
        
      text.value = ''
    //for the user first message
    } else if (
      !props.guestChat &&
      props.selectedChat?.selectedChat === null &&
      !props.selectedChat.isAiTyping
    ) {
      const obj = {
        theme_id: props.selectedtheme,
      };
      const firstUserMessage = {
        content: text.value,
        id: 1,
        is_ai_response: false,
      };

      store.commit('selectedChat/setIsAiThinking', true)

      chatsItems.push(firstUserMessage);

      client.post("/chats/create", obj).then((data: Chat) => {
        createdChatUser.value = { ...data, messages: [] };

        createdChatUser.value.messages.push(firstUserMessage);

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
            store.commit('selectedChat/setIsAiThinking', false)
            store.commit("selectedChat/setIsAiTyping", true);
            emit("resetTheme");
          });
      });
    // for the user messages
    } else if (
      !props.guestChat &&
      !!props.selectedChat?.selectedChat &&
      !props.selectedChat.isAiTyping
    ) {
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
          viewBox="0 0 26 26" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          class="chat__header-button--svg"
        >
          <path d="M14.875 2.375C14.875 1.87772 14.6775 1.40081 14.3258 1.04917C13.9742 0.697544 
          13.4973 0.5 13 0.5C12.5027 0.5 12.0258 0.697544 11.6742 1.04917C11.3225 1.40081 11.125 
          1.87772 11.125 2.375V11.125H2.375C1.87772 11.125 1.40081 11.3225 1.04917 11.6742C0.697544 
          12.0258 0.5 12.5027 0.5 13C0.5 13.4973 0.697544 13.9742 1.04917 14.3258C1.40081 14.6775 
          1.87772 14.875 2.375 14.875H11.125V23.625C11.125 24.1223 11.3225 24.5992 11.6742 24.9508C12.0258 
          25.3025 12.5027 25.5 13 25.5C13.4973 25.5 13.9742 25.3025 14.3258 24.9508C14.6775 24.5992 
          14.875 24.1223 14.875 23.625V14.875H23.625C24.1223 14.875 24.5992 14.6775 24.9508 14.3258C25.3025 
          13.9742 25.5 13.4973 25.5 13C25.5 12.5027 25.3025 12.0258 24.9508 11.6742C24.5992 11.3225 24.1223 
          11.125 23.625 11.125H14.875V2.375Z" 
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
      <!-- for saved message -->
      <div class="chat__title" v-if="!guestChat && selectedChat?.selecedSaveMessage">
        Saved message
      </div>
      </div>
      <div class="chat__main">
        <ChatItem
          v-if="!guestChat && selectedChat?.selectedChat"
          v-for="(item, index) in selectedChat.selectedChat.messages"
          :item
          :key="item.id"
          :isLastItem="index === selectedChat.selectedChat.messages.length - 1"
          :chatId="selectedChat.selectedChat.id"
          :isAiThinking="selectedChat.isAiThinking"
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
          :isAiThinking="selectedChat.isAiThinking"
        />
        <ChatItem
          v-if="guestChat"
          v-for="(item, index) in chatsItems"
          :item
          :key="item.id"
          :isLastItem="index === chatsItems.length"
          :guestChat="true"
        />

        <ChatItem
          v-if="selectedChat.isAiThinking"
          :isLastItem="true"
          :isAiThinkinng="true"
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