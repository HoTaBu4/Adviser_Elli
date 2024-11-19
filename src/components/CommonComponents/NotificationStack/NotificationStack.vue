<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import PopUpMessage from "./PopUpMessage/PopUpMessage.vue";
import EventBus from "../../../EventBus.ts";

interface Message {
  id: number;
  text: string;
  duration: number;
}

const messages = ref<Message[]>([]);

// Function to add a new message
const addMessage = (text: string, duration = 5) => {
  messages.value.unshift({ id: Date.now(), text, duration});

};

// Function to remove a message at a given index
const removeMessage = (id: number) => {
  const index = messages.value.findIndex(msg => msg.id === id);
  if (index !== -1) {
    messages.value.splice(index, 1);
  }
};

onMounted(() => {
  EventBus.on("notify", (payload) => {
    const { text, duration } = payload as { text: string; duration?: number }; 
    addMessage(text, duration);
  });
});

onUnmounted(() => {
  EventBus.off("notify");
});
</script>

<template>
  <div class="notification-stack">
    <PopUpMessage
      v-for="(msg) in messages"
      :key="msg.id"
      :message="msg.text"
      :duration="msg.duration"
      @close="removeMessage(msg.id)"
    />
  </div>
</template>

<style scoped>
.notification-stack {
  position: fixed;
  z-index: 1000;
  top: 10px;
  right: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
}
</style>
