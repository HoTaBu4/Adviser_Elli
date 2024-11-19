<script setup lang="ts">
import { useStore } from "vuex";
import SelectThemeItem from "../SelectThemeItem/SelectThemeItem.vue";
import themesInfo from "../../../assets/ThemesData/ThemesData";

const props = defineProps({
  isGuest: {
    type: Boolean,
    reqired: true,
  },
});
const emit = defineEmits(["selectTheme", "setCloseSelectTheme","createChatGuest"]);
const store = useStore();

const handleClick = (theme: number) => {
  if (props.isGuest) {
    emit("selectTheme", theme, true);
    emit("createChatGuest")
  } else {
    store.commit("selectedChat/resetChatAndSavedMessage");
    emit("selectTheme", theme);
  }

  emit("setCloseSelectTheme", false);
};
</script>

<template>
  <div class="select-theme">
    <div class="select-theme__wrapper">
      <div class="select-theme__title">choose your theme:</div>
      <div class="select-theme__select">
        <SelectThemeItem
          v-for="(item, index) in themesInfo"
          :title="item.name"
          :subTitle="item.description"
          :url="item.url"
          :key="index"
          @click="handleClick(item.id)"
        />
      </div>
    </div>
  </div>
</template>

<style>
@import "./SelectTheme.scss";
</style>
