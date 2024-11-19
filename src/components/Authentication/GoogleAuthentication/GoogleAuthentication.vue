<script setup lang="ts">
import { ref } from "vue";
import { client } from "../../../api/fetchClient";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import { Languages } from "../../../store/types/LanguageType";

const { language } = useLanguage();
const url = ref("");

const googleLogin = async () => {
  const response = await client.get<{ url: string }>("/google/login/");
  url.value = response.url;
  window.location.replace(url.value);
};
</script>

<template>
  <button class="authentication__google" @click="googleLogin">
    <img src="/pictures/icons/google__icon.svg" alt="Google Icon" />
    {{
      language === Languages.us
        ? "Register with Google"
        : "зареєструватися з Google"
    }}
  </button>
</template>

<style>
@import "./googleAuthentication.scss";
</style>
