<script lang="ts" setup>
import { ref } from "vue";
import Start from "./start/Start.vue";

const start = ref(false);
const handleClick = () => {
  start.value = true;
};
</script>

<template>
  <div class="main__info" v-if="!start">
    <div class="main__text">
      <h1 class="main__text--h1">
        An all-powerful <span>personal</span> AI assistant right on your phone.
      </h1>
      <h2 class="main__text--h2">24/7</h2>
    </div>
    <button class="main__button" @click="handleClick">start now</button>
  </div>
  <Start v-if="start" />
</template>

<style></style>
