<script lang="ts" setup>
import { ref } from "vue";
import { Languages } from "../../../store/types/LanguageType";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import { AuthenticationTypes } from "../../../assets/types/AuthenticationType";
import { resetTheUser } from "../../../services/authService";
import { useRouter } from "vue-router";

const start = ref(false);
const openModal = ref(false);
const router = useRouter();

const { language } = useLanguage();

const handleLogAsGuest = () => {
  resetTheUser()
  router.replace('/home')
}
</script>

<template>
  <div class="main__info" v-if="!start">
    <div class="main__text">
      <h1 class="main__text--h1">
        {{ language === Languages.us ? "AN All-POWERFULL" : "ВСЕСИЛЬНИЙ" }}
        <br />
        <span class="main__text--span">{{
          language === Languages.us ? "PERSONAL AI" : "ОСОБИСТИЙ ШІ"
        }}</span>
        <br />
        {{
          language === Languages.us ? " ASSISTANT RIGHT ON" : "ПОМІЧНИК ПРЯМО З"
        }}
        <br />
        {{ language === Languages.us ? "YOUR PHONE" : "ВАШОГО ТЕЛЕФОНУ" }}
      </h1>
      <h2 class="main__text--h2">24/7</h2>
    </div>
    <button class="main__button" @click="start = true">
      {{ language === Languages.us ? "START NOW" : "ПОЧАТИ ЗАРАЗ" }}
    </button>
  </div>
  <div class="buttons-container" v-if="start">
    <transition name="modal_info">
      <div class="buttons-container__modal" v-if="openModal">
        {{
          language === Languages.us
            ? "If you choose to log in as a guest, you won&#39;t have access to your search history or saved recommendations."
            : "Якщо ви вирішите увійти як гість, ви не матимете доступу до свого пошуку історія або збережені рекомендації."
        }}
      </div>
    </transition>
    <h2 class="buttons-container__title">
      {{ language === Languages.us ? "START" : "ПОЧАТИ " }}
    </h2>
    <div 
      class="buttons-container__buttons"
      :class="{'buttons-container__ukrainian' : language === Languages.uk}"
    >
      <RouterLink :to="{ name: 'authentication', params: { type: AuthenticationTypes.login }}" class="buttons-container__log-in">
        {{ language === Languages.us ? "LOG IN" : "ВВІЙТИ" }}
      </RouterLink>
      <RouterLink
        :to="{
          name: 'authentication',
          params: { type: AuthenticationTypes.register },
        }"
        class="buttons-container__register"
      >
        {{ language === Languages.us ? "REGISTER" : "ЗАРЕЄСТРУВАТИСЯ" }}
      </RouterLink>
    </div>
    <div class="buttons-container__guest">
      <div class="buttons-container__log-as-guest" @click="handleLogAsGuest">{{
        language === Languages.us ? "LOG IN AS A GUEST" : "ЗАЙТИ ЯК ГІСТЬ"
      }}</div>
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        @click="openModal = !openModal"
        class="buttons-container__log-as-guest--svg buttons-container__log-as-guest--sign"
      >
        <path
          d="M18.926 14.0389C19.7422 14.0389 20.4038 13.3773 20.4038 12.5612C20.4038
          11.745 19.7422 11.0834 18.926 11.0834C18.1099 11.0834 17.4482 11.745
          17.4482 12.5612C17.4482 13.3773 18.1099 14.0389 18.926 14.0389Z"
          class="buttons-container__log-as-guest--sign"
        />
        <path
          d="M22.1667 24.2778H20.0556V15.8334H16.8889C16.609 15.8334 16.3405 15.9446
          16.1426 16.1425C15.9446 16.3405 15.8334 16.609 15.8334 16.8889C15.8334
          17.1689 15.9446 17.4374 16.1426 17.6353C16.3405 17.8333 16.609 17.9445
          16.8889 17.9445H17.9445V24.2778H15.8334C15.5534 24.2778 15.285 24.389
          15.087 24.587C14.889 24.7849 14.7778 25.0534 14.7778 25.3334C14.7778
          25.6133 14.889 25.8818 15.087 26.0798C15.285 26.2777 15.5534 26.3889
          15.8334 26.3889H22.1667C22.4467 26.3889 22.7152 26.2777 22.9131 26.0798C23.1111
          25.8818 23.2223 25.6133 23.2223 25.3334C23.2223 25.0534 23.1111 24.7849
          22.9131 24.587C22.7152 24.389 22.4467 24.2778 22.1667 24.2778Z"
          class="buttons-container__log-as-guest--sign"
        />
        <path
          d="M18.9999 6.33337C16.4947 6.33337 14.0457 7.07626 11.9627 8.46809C9.87968
          9.85992 8.25616 11.8382 7.29745 14.1527C6.33874 16.4672 6.0879 19.0141
          6.57664 21.4712C7.06539 23.9283 8.27177 26.1853 10.0432 27.9567C11.8147
          29.7282 14.0717 30.9346 16.5288 31.4233C18.9859 31.9121 21.5327 31.6612
          23.8472 30.7025C26.1618 29.7438 28.14 28.1203 29.5319 26.0373C30.9237
          23.9542 31.6666 21.5053 31.6666 19C31.6666 15.6406 30.3321 12.4188 27.9566
          10.0434C25.5811 7.66789 22.3593 6.33337 18.9999 6.33337ZM18.9999 29.5556C16.9122
          29.5556 14.8714 28.9365 13.1356 27.7767C11.3997 26.6168 10.0468 24.9683 9.24786
          23.0395C8.44894 21.1107 8.2399 18.9883 8.64719 16.9408C9.05448 14.8932 10.0598
          13.0124 11.536 11.5361C13.0122 10.0599 14.8931 9.0546 16.9406 8.64731C18.9882
          8.24002 21.1106 8.44905 23.0394 9.24798C24.9681 10.0469 26.6167 11.3998 27.7765
          13.1357C28.9364 14.8715 29.5555 16.9123 29.5555 19C29.5555 20.3862 29.2825 21.7588
          28.752 23.0395C28.2215 24.3201 27.444 25.4838 26.4638 26.4639C25.4837 27.4441
          24.32 28.2216 23.0394 28.7521C21.7587 29.2826 20.3861 29.5556 18.9999 29.5556Z"
          class="buttons-container__log-as-guest--sign"
        />
      </svg>
    </div>
  </div>
</template>

<style>
@import "./StartStyle.scss";
</style>

