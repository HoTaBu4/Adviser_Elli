<script setup lang="tsx">
import { reactive, ref } from "vue";
import Header from "../CommonComponents/Header/Header.vue";
import FirstStageResetPassword from "./FirstStageResetPassword/FirstStageResetPassword.vue";
import ConfirmResetPassword from "./ConfirmResetPassword/ConfirmResetPassword.vue";
import { useLanguage } from "../../assets/hooks/useLanguage";
import { Languages } from "../../store/types/LanguageType";
import { client } from "../../api/fetchClient";
import EventBus from "../../EventBus";
import maskEmail from "../../assets/functions/mustEmail";

const email = reactive({
  text: "",
  error: "",
});

const isSendingTheCode = ref(false);
const isCooldownActive = ref(false);
const secondStage = ref<boolean>(false);

const { language } = useLanguage();

const validateEmail = () => {
  const emailRegex =
    /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  email.error = "";

  if (!emailRegex.test(email.text)) {
    email.error =
      language.value === Languages.us
        ? "Invalid email format"
        : "Недійсний формат пошти";
  }
};

const handleSubmit = () => {
  if (isCooldownActive.value) {
    // Notify the user to wait for cooldown
    const waitMessage =
      language.value === Languages.us
        ? "Please wait before resending the code."
        : "Будь ласка, зачекайте перед повторною відправкою коду.";
    EventBus.emit("notify", { text: waitMessage, duration: 5 });
    return;
  }

  if (!secondStage.value && !isSendingTheCode.value) {
    validateEmail();
    if (!email.error) {
      isSendingTheCode.value = true;

      client
        .post("/forgot_password/", { email: email.text })
        .then(() => {
          secondStage.value = true;
          const maskedEmail = maskEmail(email.text);

          const successMessage =
            language.value === Languages.us
              ? `The code is sent to the email ${maskedEmail}`
              : `Код відправлено на електронну пошту ${maskedEmail}`;

          EventBus.emit("notify", { text: successMessage, duration: 5 });

          // Activate cooldown
          isCooldownActive.value = true;
          setTimeout(() => {
            isCooldownActive.value = false; // Reset cooldown after 2 minutes
          }, 120000); // 120,000 ms = 2 minutes
        })
        .catch((error) => {
          console.error("Error sending code:", error);

          const errorMessage =
            language.value === Languages.us
              ? "Failed to send code. Please try again."
              : "Не вдалося відправити код. Будь ласка, спробуйте ще раз.";

          EventBus.emit("notify", { text: errorMessage, duration: 5 });
          isSendingTheCode.value = false; // Reset on error
        });
    }
  }
};
</script>

<template>
  <Header />
  <main class="main">
    <FirstStageResetPassword
      v-if="!secondStage"
      :email
      :isSendingTheCode
      @SubmitEmail="handleSubmit"
    />
    <ConfirmResetPassword 
      v-else-if="secondStage"
      @SubmitEmail="handleSubmit" 
      :email="email.text" 
    />
  </main>
</template>

<style>
@import "ForgotPassword.scss";
</style>
