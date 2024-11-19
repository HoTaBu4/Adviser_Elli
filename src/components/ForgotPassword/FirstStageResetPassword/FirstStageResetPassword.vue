<script setup lang="ts">
import { reactive } from "vue";
import { client } from "../../../api/fetchClient";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import { Languages } from "../../../store/types/LanguageType";
import { FieldsTypes } from "../../../assets/types/fieldTypes";
import InputField from "../../CommonComponents/InputField/InputField.vue";
import Loader from "../../CommonComponents/Loader/Loader.vue";

const { language } = useLanguage();

const props = defineProps({
  email: {
    type: Object,
    required: true,
  },
  isSendingTheCode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["SubmitEmail"]);
</script>

<template>
  <div class="reset-password">
    <div class="reset-password__start-block">
      <div class="reset-password__start-block--wrapper">
        <h1 class="reset-password__title">
          {{ language.us === Languages.us ? "RESET PASSWORD" : "ЗМІНА ПАРОЛЮ" }}
        </h1>
        <div class="reset-password__sub-title">
          {{
            language.us === Languages.us
              ? "Please enter your email address to receive instructions on how to reset your password."
              : "Будь ласка, введіть свою електронну адресу, щоб отримати інструкції щодо скидання пароля."
          }}
        </div>
        <form
          class="reset-password__controller"
          @submit.prevent="emit('SubmitEmail')"
        >
          <InputField
            :name="FieldsTypes.emailreset"
            v-model="email.text"
            :error="email.error"
            :placeholder="language === Languages.us ? 'Email' : 'Пошта'"
            :isValid="email.valid"
            :labelText="
              language === Languages.us ? 'Email address' : 'електронна пошта'
            "
            :isStatic="true"
          />
          <button class="reset-password__continue">
            {{ language === Languages.us ? "CONTINUE" : "Продовжити" }}
            <Loader 
              v-if="isSendingTheCode"
              :size="30"
            />
          </button>
        </form>
      </div>
    </div>
    <RouterLink
      class="reset-password__back"
      to="Authentication/login"
      :replace="true"
    >
      <img
        src="/public/pictures/icons/back_arrow.svg"
        alt=""
        class="reset-password__back--img"
      />
      <div class="reset-password__back--text">
        {{
          language === Languages.us
            ? "Back to Elli.ai"
            : "повернутися до Elli.ai"
        }}
      </div>
    </RouterLink>
  </div>
</template>

<style>
@import "./FirstStageResetPassword.scss";
</style>
