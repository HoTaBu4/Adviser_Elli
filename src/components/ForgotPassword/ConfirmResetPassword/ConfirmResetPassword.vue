<script setup lang="ts">
import { reactive } from "vue";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import { Languages } from "../../../store/types/LanguageType";
import InputField from "../../CommonComponents/InputField/InputField.vue";
import { useRouter } from "vue-router";
import { client } from "../../../api/fetchClient";
import EventBus from "../../../EventBus";

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['SubmitEmail']);

const { language } = useLanguage();
const router = useRouter();
const data = reactive({
  code: {
    text: "",
    error: "",
  },
  password: {
    text: "",
    error: "",
  },
  repearPassword: {
    text: "",
    error: "",
  },
});

const handleSubmit = () => {
  data.code.error = "";
  data.password.error = "";
  data.repearPassword.error = "";

  if (!data.code.text) {
    data.code.error =
      language.value === Languages.us
        ? "Code is required"
        : "Код є обов'язковим";
    return;
  }

  if (!data.password.text) {
    data.password.error =
      language.value === Languages.us
        ? "Password is required"
        : "Пароль є обов'язковим";
    return;
  }

  if (data.password.text.length < 8 || data.password.text.length > 15) {
    data.password.error =
      language.value === Languages.us
        ? "Password must be between 8 and 15 characters"
        : "Пароль має містити від 8 до 15 символів";
    return;
  }

  if (!/^[A-Z]/.test(data.password.text)) {
    data.password.error =
      language.value === Languages.us
        ? "The first letter must be uppercase"
        : "Перша літера має бути великою";
    return;
  }

  if (data.password.text !== data.repearPassword.text) {
    data.repearPassword.error =
      language.value === Languages.us
        ? "Passwords do not match"
        : "Паролі не збігаються";
    return;
  }

  client
    .patch("/reset_password/", {
      reset_password_code: data.code.text,
      new_password: data.password.text,
    })
    .then((response: any) => {
      if (!('detail' in response)) {
        EventBus.emit('notify', {
          'text' : response.detail,
          'duration': 5
        })
      } else {
        EventBus.emit('notify', {
          'text' : language.value === Languages.us
            ? 'Password has been successfully reset'
            : 'Пароль успішно скинуто',
          'duration': 5
        })
        
        router.push("/Authentication/login");
      }
    });
};
</script>

<template>
  <div class="confirm-reset">
    <div class="confirm-reset__wrapper">
      <h1 class="confirm-reset__title">
        {{
          Languages.us === language
            ? "Submit reset password"
            : "Підтвердьте зміну пароля"
        }}
      </h1>
      <div class="confirm-reset__sub-title">
        {{
          Languages.us === language
            ? "The code has been sent to you by mail"
            : "Код надісланий вам на пошту"
        }}
      </div>
      <form
        action=""
        class="confirm-reset__form"
        @submit.prevent="handleSubmit"
      >
        <InputField
          name="resetcode"
          v-model="data.code.text"
          :error="data.code.error"
          :placeholder="language === Languages.us ? 'code' : 'код'"
          :isStatic="true"
          :labelText="Languages.us ? 'code' : 'код'"
        />
        <InputField
          name="password"
          v-model="data.password.text"
          :error="data.password.error"
          :placeholder="language === Languages.us ? 'password' : 'пароль'"
          :isStatic="true"
          :labelText="language === Languages.us ? 'password' : 'пароль'"
          :isPassword="true"
        />
        <InputField
          name="new password"
          v-model="data.repearPassword.text"
          :error="data.repearPassword.error"
          :placeholder="
            language === Languages.us ? 'new password' : 'новий пароль'
          "
          :isStatic="true"
          :labelText="
            language === Languages.us ? 'new password' : 'новий пароль'
          "
          :isPassword="true"
        />
        <button class="confirm-reset__send" @click="emits('SubmitEmail')">
          {{
            Languages.us === language
              ? "SEND CODE AGAIN"
              : "НАДІСЛІТИ КОД ЗНОВУ"
          }}
        </button>
        <button type="submit" class="confirm-reset__continue">
          {{ language === Languages.us ? "CONTINUE" : "ПРОДОВЖИТИ" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style>
@import "./ConfirmResetPassword.scss";
</style>
