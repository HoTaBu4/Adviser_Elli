<script setup lang="ts">
defineProps({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  subTitle: {
    type: String,
  },
});
</script>

<template>
  <div class="select-item">
    <div class="select-item__header">
      <div class="select-item__title">{{ title }}</div>
      <img :src="url" alt="" class="select-item__img" />
    </div>
    <div class="select-item__sub-title">
      {{ subTitle }}
    </div>
  </div>
</template>

<style>
@import "./SelectThemeItem.scss";
</style>
