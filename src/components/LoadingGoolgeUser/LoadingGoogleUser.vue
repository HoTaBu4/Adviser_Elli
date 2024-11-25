<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { client } from "../../api/fetchClient";
import { useStore } from "vuex";
import { jwtDecode } from "jwt-decode";
import Header from "../CommonComponents/Header/Header.vue";
import Loader from "../CommonComponents/Loader/Loader.vue";
import { resetTheUser } from "../../services/authService";

const urlNew = new URL(window.location.href);
const code = urlNew.searchParams.get("code");
const store = useStore();
const isGoogleLogin = ref(false);

onMounted(() => {
  if (code) {
    client
      .get(`/auth/google/?code=${code}`)
      .then((data: any) => {
        if (data.access_token) {
          resetTheUser();
          // Store the token in a cookie for later authentication
          document.cookie = `token=${data.access_token}; path=/; max-age=3600; SameSite=Strict; Secure`;

          // Decode user data and store in Vuex
          const userData = jwtDecode(data.access_token);
          store.commit("user/setUser", {user: { email: userData.sub, id: userData.id },isgoogle: true});

          // Redirect after successful login
          window.location.replace("/home");
        }
      })
      .catch((error) => {
        console.error("Error during API request:", error);
      });
  }
});

watch(isGoogleLogin, (newValue) => {
  if (newValue) {
    isGoogleLogin.value = false; // Reset it to avoid repeated redirection
    window.location.replace("/"); // Redirect to the desired page
  }
});
</script>

<template>
  <Header />
  <main class="main-google">
    <div class="main-google__container">
      <Loader :size="90" />
    </div>
  </main>
</template>

<style lang="scss">
.main-google {
  display: flex;
  justify-content: center;
  flex: 0 1 auto;
  width: 100%;
}
</style>
