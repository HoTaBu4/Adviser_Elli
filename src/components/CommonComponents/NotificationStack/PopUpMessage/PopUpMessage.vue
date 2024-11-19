
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  message: { type: String, required: true },
  duration: { type: Number, default: 50 }, // Default duration of 5 seconds if not provided
});

const emit = defineEmits(['close']);
const progress = ref(100);
let progressInterval: ReturnType<typeof setInterval> | null = null;

const closeMessage = () => {
  if (progressInterval !== null) clearInterval(progressInterval); // Clear interval
  emit('close'); // Emit close event to notify parent
};

onMounted(() => {
  const decrement = 100 / props.duration;
  progressInterval = setInterval(() => {
    progress.value -= decrement;
    if (progress.value <= 0) {
      closeMessage(); // Close message when timer is done
    }
  }, 1000);
});

onUnmounted(() => {
  if (progressInterval !== null) clearInterval(progressInterval); // Prevent memory leaks
});
</script>

<template>
  <div class="popup-message">
    <div class="message-content">
      <span>{{ message }}</span>
      <button class="close-btn" @click="closeMessage">×</button>
    </div>
    <div class="timeline" :style="{ width: `calc(${progress}% - 20px)` }"></div>
  </div>
</template>

<style scoped>
.popup-message {
  position: relative;
  margin-top: 10px;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.message-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.timeline {
  position: absolute;
  bottom: 0;
  height: 3px;
  background-color: #ff4500;
  transition: width 1s linear;
}
</style>