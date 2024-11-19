<script lang="ts" setup>
import { ref } from "vue";
import { Languages } from "../../../store/types/LanguageType";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import Burger from "../Burger/Burger.vue";

defineProps({
  home: {
    type: Boolean,
  },
});

const user = ref(false);

const { language } = useLanguage();
</script>

<template>
  <header class="header container">
    <div class="header__icon">
      <img
        src="/pictures/icons/main__logo_phone.png"
        alt="logo"
        class="header__icon--phone"
      />
      <img
        src="/pictures/icons/main__logo__tablet.png"
        alt="logo"
        class="header__icon--tablet"
      />
      <div class="header__icon-text">Elli.ai</div>
    </div>
    <div class="header__info" v-if="!home">
      <div class="header__info--text">
        {{ language === Languages.us ? "FRESH" : "СВІЖИЙ" }}
      </div>
      <div class="header__info--line"></div>
      <div class="header__info--text">
        {{ language === Languages.us ? "CONVINIENT" : "ЗРУЧНИЙ" }}
      </div>
      <div class="header__info--line"></div>
      <div class="header__info--text">
        {{ language === Languages.us ? "FAST" : "ШВИДКИЙ" }}
      </div>
    </div>
    <div class="header__right-side">
      <button class="header__log-in" v-if="user">
        {{ language === Languages.us ? "log in" : "зареєстуватися" }}
      </button>
      <Burger v-if="user" />
    </div>
  </header>
</template>

<style>
@import "./headerStyle.scss";
</style>
