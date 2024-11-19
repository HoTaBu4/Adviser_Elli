<script setup lang="ts">
import { useStore } from "vuex";
import { Languages } from "./store/types/LanguageType";
import NotificationStack from "./components/CommonComponents/NotificationStack/NotificationStack.vue";

const browserNavigator = navigator;

const store = useStore();

if (
  browserNavigator.language === Languages.uk ||
  browserNavigator.language === Languages.us
) {
  store.dispatch("language/updateLanguage", browserNavigator.language);
} else {
  store.dispatch("language/updateLanguage");
}
</script>

<template>
  <div class="app__container">
    <NotificationStack />
    <RouterView />
  </div>
</template>

<style scoped>
.app__container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-size: cover;
  overflow: auto;
}
</style>