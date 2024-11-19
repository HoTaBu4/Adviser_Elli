<script setup lang="ts">
import { marked } from "marked";
import { onMounted, PropType, ref } from "vue";
import { Message } from "../../../store/types/MessagesType";
import {
  saveMessage,
  unsaveMessage,
} from "../../../store/modules/savedMessages";
import { useStore } from "vuex";

const props = defineProps({
  item: {
    type: Object as PropType<Message>,
  },
  isLastItem: {
    type: Boolean,
    reqired: true,
  },
  chatId: {
    type: Number,
  },
  savedMessage: {
    type: String,
  },
  isAiResponse: {
    type: Boolean,
  },
  guestChat: {
    type: Boolean,
    default: false,
  }
});

let i = 0;
const speed = 50;
const typedContent = ref("");
const isTyping = ref(false);

const store = useStore();
const { isLoading, isAiTyping } = store.state.selectedChat;

// Function to initiate the typing animation with Markdown rendering
const typeWriter = () => {
  if (props.item && i < props.item.content.length && props.item.is_ai_response) {
    typedContent.value += props.item.content.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else if (props.item && i === props.item.content.length && props.item.is_ai_response) {
    isTyping.value = false;
    store.commit("selectedChat/setIsAiTyping", false);
  }

};

const handleClick = () => {
  if (props.item && props.item.is_saved && props.chatId) {
    unsaveMessage(props.chatId, props.item);
  } else if (!props.item?.is_saved && props.chatId) {
    saveMessage(props.chatId, props.item);
  }
};

// Start typing when component mounts
onMounted(() => {
  if (isAiTyping && props.isLastItem && props.item?.is_ai_response) {
    i = 0;
    typedContent.value = "";
    isTyping.value = true;
    typeWriter();
  }
});
</script>

<template>
  <div
    class="chat-item"
    :class="{
      'chat-item--ai': item?.is_ai_response,
      'chat-item--user': !item?.is_ai_response,
    }"
  >
    <div class="chat-item__image">
      <img
        src="/pictures/icons/mage_robot-happy.svg"
        alt=""
        v-if="item?.is_ai_response || isAiResponse"
        class="chat-item__img"
      />
    </div>
    <div
      class="chat-item__text"
      :class="{
        'chat-item__text--ai': item?.is_ai_response || savedMessage,
        'chat-item__text--user': !item?.is_ai_response && !isAiResponse,
      }"
    >
      <div
        v-if="item"
        class="chat-item__text-wrapper"
        v-html="
          // isLoading && item.is_ai_response && isAiTyping ? marked(typedContent) : marked(item?.content)
          marked(item.content)
        "
      ></div>
      <div
        v-if="savedMessage"
        class="chat-item__text-wrapper"
        v-html="isLoading ? '' : marked(savedMessage)"
      ></div>
      <svg
        v-if="item?.is_ai_response && !guestChat"
        width="22"
        height="35"
        viewBox="0 0 22 35"
        xmlns="http://www.w3.org/2000/svg"
        class="chat-item__svg"
        @click="handleClick"
      >
        <path
          d="M2.4375 34.4531C1.39062 34.4531 0.78125 33.7656 0.78125 32.5469V5.42188C0.78125 
        2.45312 2.26562 0.9375 5.20312 0.9375H17.4219C20.3594 0.9375 21.8438 2.45312 21.8438 
        5.42188V32.5469C21.8438 33.7656 21.2344 34.4531 20.1875 34.4531C19.4219 34.4531 18.9688 
        34.0156 17.5625 32.6562L11.4531 26.6406C11.3906 26.5625 11.25 26.5625 11.1719 26.6406L5.0625 
        32.6562C3.65625 34.0156 3.20312 34.4531 2.4375 34.4531Z"
          :class="['chat-item__path', { is_saved: item.is_saved }]"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
@import "./ChatItem.scss";
</style>
