<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import InputField from "../../CommonComponents/InputField/InputField.vue";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import { Languages } from "../../../store/types/LanguageType";
import { logout } from "../../../services/authService";
import { deleteAllChats } from "../../../store/modules/chats";
import { useStore } from "vuex";
import { client } from "../../../api/fetchClient";
import maskEmail from "../../../assets/functions/mustEmail";
import EventBus from "../../../EventBus";
import Loader from "../../CommonComponents/Loader/Loader.vue";
import { UserState } from "../../../store/types/UserType";
import { removeAllSavedMessages, SavedMessagesState } from "../../../store/modules/savedMessages";

const info = reactive({
  code: {
    text: "",
    error: "",
  },
  password: {
    text: "",
    error: "",
  },
  repeatedPassword: {
    text: "",
    error: "",
  },
});

defineProps({
  type: {
    type: String,
  },
});

// const modalRef = ref<VNodeRef | null>(null);
const emit = defineEmits(["close-modal"]);
const { language, handleSetLanguage } = useLanguage();
const store = useStore();
const isSendingTheCode = ref(false);
const isCooldownActive = ref(false); // Tracks if cooldown is active
const cooldownTime = 2 * 60 * 1000; // Cooldown time in milliseconds (2 minutes)

const user: UserState = store.state.user;
const savedMessages: SavedMessagesState = store.state.savedMessages

const handleChangeLanguage = (targetLanguage: Languages) => {
  if (language.value !== targetLanguage) {
    handleSetLanguage(targetLanguage);
  }
};

const notification = () => {
  EventBus.emit('notify', {
  text: language.value === Languages.us
    ? "You can't change the password when you log in through Google."
    : "Ви не можете змінити пароль, коли входите через Google.",
  duration: 5,
});
}

const handleSubmit = () => {
  info.code.error = "";
  info.password.error = "";
  info.repeatedPassword.error = "";
  if (user.isgoogle) {
    notification()
    return;
  }

  if (!info.code.text) {
    info.code.error =
      language.value === Languages.us
        ? "Code is required"
        : "Код є обов'язковим";
    return;
  }

  if (!info.password.text) {
    info.password.error =
      language.value === Languages.us
        ? "Password is required"
        : "Пароль є обов'язковим";
    return;
  }

  if (info.password.text.length < 8 || info.password.text.length > 15) {
    info.password.error =
      language.value === Languages.us
        ? "Password must be from 8 to 15 characters"
        : "Пароль має містити від 8 до 15 символів";
    return;
  }

  if (!/^[A-Z]/.test(info.password.text)) {
    info.password.error =
      language.value === Languages.us
        ? "The first letter must be uppercase"
        : "Перша літера має бути великою";
    return;
  }

  if (info.password.text !== info.repeatedPassword.text) {
    info.repeatedPassword.error =
      language.value === Languages.us
        ? "Passwords do not match"
        : "Паролі не збігаються";
    return;
  }

  client.post('/reset_password/', { 'reset_password_code': info.code, 'new_password': info.password})
    .then((response:any) => {
      if (!('detail' in response)) {
        EventBus.emit('notify', {text: 'the password is changed', duration: 5})
      } else {
        EventBus.emit('notify', {text: response.detail, duration: 5})
      }
    })
};

const handleClose = () => {
  emit("close-modal");
};

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target && target.classList && target.classList.contains("menu-modal")) {
    handleClose(); // Close the modal
  }
};

const handledeleteSavedMessages = () => {
  if (savedMessages.savedMessages.length > 0) {
    removeAllSavedMessages();
  }
}

const handleDeleteAllChats = () => {
  deleteAllChats();
}

// Register the click event listener to detect clicks outside the modal
onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const settingsTitle = computed(() =>
  language.value === Languages.us ? "SETTINGS :" : "НАЛАШТУВАННЯ :",
);

const accountTitle =
  language.value === Languages.us ? "YOUR ACCOUNT :" : "ТВІЙ АККАУНТ :";

const handleSendCode = () => {
  if (!user.isgoogle) {
    if (isCooldownActive.value) {
      // Notify the user to wait for cooldown
      const waitMessage =
        language.value === Languages.us
          ? "Please wait before resending the code."
          : "Будь ласка, зачекайте перед повторною відправкою коду.";
      EventBus.emit("notify", { text: waitMessage, duration: 5 });
      return;
    }

    isSendingTheCode.value = true;
    isCooldownActive.value = true; // Start cooldown

    client
      .post("/forgot_password/", { email: user.user.email })
      .then(() => {
        const maskedEmail = maskEmail(user.user.email);
        const successMessage =
          language.value === Languages.us
            ? `The code has been sent to ${maskedEmail}`
            : `Код було надіслано на ${maskedEmail}`;
        EventBus.emit("notify", { text: successMessage, duration: 5 });

        // Start cooldown timer
        setTimeout(() => {
          isCooldownActive.value = false; // Reset cooldown after 2 minutes
        }, cooldownTime);
      })
      .catch((error) => {
        console.error("Error sending code:", error);

        // Handle error feedback
        const errorMessage =
          language.value === Languages.us
            ? "Failed to send code. Please try again."
            : "Не вдалося відправити код. Будь ласка, спробуйте ще раз.";
        EventBus.emit("notify", { text: errorMessage, duration: 5 });
      })
      .finally(() => {
        isSendingTheCode.value = false; // Reset sending state
      });
  } else {
    notification()
  }
};


</script>

<template>
  <div class="menu-modal" @click="handleOutsideClick">
    <form class="menu-modal__content" @click.stop.prevent>
      <div class="menu-modal__close">
        <img
          src="/pictures/icons/mobile_close.svg"
          alt=""
          class="menu-modal__close-img"
          @click="handleClose"
        />
      </div>
      <div class="menu-modal__title">
        {{ type === "settings" ? settingsTitle : accountTitle }}
      </div>
      <div class="menu-modal__settigns" v-if="type === 'settings'">
        <div class="menu-modal__language">
          <div class="menu-modal__language-title">
            {{ language === Languages.us ? "language :" : "мова :" }}
          </div>
          <div class="menu-modal__language-change">
            <div
              class="menu-modal__en"
              :class="{ 'menu-modal__en--selected': language === Languages.us }"
              @click="handleChangeLanguage(Languages.us)"
            >
              EN
            </div>
            <div
              class="menu-modal__uk"
              :class="{ 'menu-modal__uk--selected': language === Languages.uk }"
              @click="handleChangeLanguage(Languages.uk)"
            >
              UK
            </div>
          </div>
        </div>
        <div class="menu-modal__buttons">
          <button
            class="menu-modal__delete-chats"
            @click="handledeleteSavedMessages()"
          >
            {{
              language === Languages.us
                ? "DELETE ALL SAVED MESSAGES"
                : "ВИДАЛИТИ ВСІ ЗБЕРЕЖЕНІ"
            }}
          </button>
          <button class="menu-modal__delete-chats" @click="handleDeleteAllChats()">
            {{
              language === Languages.us
                ? "DELETE ALL CHATS"
                : "ВИДАЛИТИ ВСІ ЧАТИ"
            }}
          </button>
        </div>
      </div>
      <form class="menu-modal__account" @submit.prevent="handleSubmit" v-else>
        <div class="menu-modal__password">
          <InputField
            v-model="info.code.text"
            :error="info.code.error"
            :placeholder="language === Languages.us ? 'code' : `код`"
            name="password"
            :isStatic="true"
            :labelText="language === language.us ? 'code' : `код`"
            :labelColor="true"
            :disabled="!!user.isgoogle"
          />
          <InputField
            v-model="info.password.text"
            :error="info.password.error"
            :placeholder="language === Languages.us ? 'password' : `пароль`"
            name="password"
            :isStatic="true"
            :labelText="language === Languages.us ? 'password' : `пароль`"
            :labelColor="true"
            :isPassword="true"
            :disabled="!!user.isgoogle"
          />
          <InputField
            v-model="info.repeatedPassword.text"
            :error="info.repeatedPassword.error"
            :placeholder="
              language === Languages.us ? 'password' : `повторити пароль`
            "
            name="repeat password"
            :isStatic="true"
            :labelText="
              language === Languages.us ? ' repeat password' : ` повторити пароль`
            "
            :labelColor="true"
            :isPassword="true"
            :disabled="!!user.isgoogle"
          />
        </div>
        <div class="menu-modal__buttons">
          <button
            class="menu-modal__send-code"
            @click="handleSendCode"
            type="button"
          >
            {{ language === Languages.us ? "SEND CODE" : "НАДІСЛАТИ КОД" }}
            <Loader :size="30" v-if="isSendingTheCode"/>
          </button>
          <button class="menu-modal__save" type="submit">
            {{ language === Languages.us ? "SAVE" : "ЗБЕРЕГТИ" }}
          </button>
          <button class="menu-modal__log-out" @click="logout()">
            {{ language === Languages.us ? "log out" : "ВИЙТИ" }}
          </button>
        </div>
      </form>
    </form>
  </div>
</template>

<style>
@import "./menuModal.scss";
</style>
