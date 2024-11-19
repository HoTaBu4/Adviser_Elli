<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLanguage } from "../../assets/hooks/useLanguage";
import { Languages } from "../../store/types/LanguageType";
import InputField from "../CommonComponents/InputField/InputField.vue";
import { FieldsTypes } from "../../assets/types/fieldTypes";
import { AuthenticationTypes } from "../../assets/types/AuthenticationType";
import { authorizationUser, registationUser } from "../../store/modules/user";
import GoogleAuthentication from "./GoogleAuthentication/GoogleAuthentication.vue";
import Loader from "../CommonComponents/Loader/Loader.vue";
import { useStore } from "vuex";
import { UserState } from "../../store/types/UserType";

let data = reactive({
    email: {
    text: "",
    error: "",
    valid: false,
  },
  password: {
    text: "",
    error: "",
    valid: false,
  },
});

const route = useRoute();
const router = useRouter();
const store = useStore();
const { language } = useLanguage();
const user: UserState = store.state.user

const isLogin = ref(false);
const currentField = ref(FieldsTypes.email);
const lastField = ref(FieldsTypes.email);

const fieldOrder = [FieldsTypes.email, FieldsTypes.password];

const resetFormData = () => {
  data.email.text = "";
  data.email.error = "";
  data.email.valid = false;

  data.password.text = "";
  data.password.error = "";
  data.password.valid = false;
};

const setAuthType = (routeType: string) => {
  if (routeType === 'login') {
    isLogin.value = true;
  } else if (routeType === 'register') {
    isLogin.value = false;
  }
};

setAuthType(route.params.type as string);

watch(
  () => route.params.type,
  (newType) => {
    setAuthType(newType as string);
    currentField.value = FieldsTypes.email
    lastField.value = FieldsTypes.email
    resetFormData();
  },
  { immediate: true } 
);

const goToNextField = (nextField: FieldsTypes) => {
  lastField.value = currentField.value;
  currentField.value = nextField;
};

const goToPreviousField = () => {  
  let currentIndex = fieldOrder.indexOf(currentField.value);

  if (currentIndex > 0) {
    // Set current field as invalid
    currentField.value = fieldOrder[currentIndex - 1];
    data[currentField.value].valid = false;
    
    // Move to the previous field
    lastField.value = currentField.value; 
    
  }
};

const handleSubmit = () => {
  if (!isLogin.value) {
    // Registration process
    registationUser({
      email: data.email.text,
      password: data.password.text,
    })
  } else {
    // Login process
    authorizationUser({
      email: data.email.text,
      password: data.password.text
    },router)
  }
}

const MainValidation = (event: Event) => {
  
  event.preventDefault();
  if (!data.email.valid) {
    validateEmail();
    return
  } else if (!data.password.valid) {
    validatePassword();
    if (data.password.error) {
      return
    }
  } 
  
  handleSubmit();  
};

const validateEmail = () => {
  // const emailRegex = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  data.email.error = "";

  // if (!emailRegex.test(data.email.text)) {
    if( data.email.text.trim() === '') {
    data.email.error =
      language.value === Languages.us
        ? "Invalid email format"
        : "Недійсний формат пошти";
  } else {
    data.email.valid = true;
    goToNextField(FieldsTypes.password);
    data.email.valid = true;
  }
};

const validatePassword = () => {
  data.password.error = "";

  if (data.password.text.length < 8 || data.password.text.length > 30) {
    data.password.error =
      language.value === Languages.us
        ? "8 - 30 characters"
        : "8 - 30 знаків";
  } else if (data.password.text.slice(0,1) !== data.password.text.slice(0,1).toUpperCase()) {
    data.password.error =
      language.value === Languages.us
        ? "first letter must be an upper case"
        : "перша літера має бути великою";
  } else {
    data.password.valid = true;
  }
};

</script>


<template>
  <div class="authentication">
    <div class="authentication__container">
      <form class="authentication__form">
        <InputField 
          :name="FieldsTypes.email"
          v-model="data.email.text" 
          :error="data.email.error"
          :placeholder="language === Languages.us ? 'Email': 'Пошта'"
          :isValid="data.email.valid"
          :currentField
          :lastField="lastField"
          :labelText="language === Languages.us ? 'Email address': 'електронна пошта'" 
        />
        <InputField
          :name="FieldsTypes.password"
          v-model="data.password.text" 
          :error="data.password.error"
          :placeholder=" language === Languages.us ? 'password': 'пароль'"
          :isValid="data.password.valid"
          :currentField
          :lastField="lastField"
          :labelText="language === Languages.us ? 'password': 'пароль'"
          :isPassword="true"
        />
        <button
          v-if="currentField !== FieldsTypes.email"
          type="button"
          class="authentication__back-button"
          @click="goToPreviousField"
        >
          <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="authentication__back-button--svg">
            <path 
              class="authentication__back-button--path"
              d="M0.486328 11.1289C0.486328 10.8691 0.595703 10.6367 0.800781 10.4453L9.93359 
              1.28516C10.1934 1.02539 10.4258 0.929688 10.6719 0.929688C11.1914 0.929688 11.5879 
              1.3125 11.5879 1.81836C11.5879 2.07812 11.5059 2.31055 11.3281 2.48828L7.24023 6.61719L3.20703 
              10.3633L6.37891 10.2129H24.9727C25.4922 10.2129 25.875 10.5957 25.875 11.1289C25.875 11.6621 
              25.4922 12.0449 24.9727 12.0449H6.37891L3.19336 11.8945L7.24023 15.6406L11.3281 19.7695C11.4922 
              19.9336 11.5879 20.1797 11.5879 20.4258C11.5879 20.9316 11.1914 21.3145 10.6719 21.3145C10.4258 
              21.3145 10.207 21.2324 10.002 21.041L0.800781 11.8125C0.595703 11.6211 0.486328 11.3887 
              0.486328 11.1289Z" 
              fill="#B1B0B4"
            />
          </svg>
          <div class="authentication__back-button--text">
            {{ language === Languages.us ? "Back" : "Назад" }}
          </div>
        </button>
        <button class="authentication__button" @click="MainValidation">
          {{ language === Languages.us ? "CONTINUE" : "ПРОДОВЖИТИ" }}
          <Loader :size="30" v-if="user.isloading"/>
        </button>
      </form>
      <div class="authentication__forgot-password">
        <RouterLink 
          class="authentication__forgot-password--button"
          :to="{ name: 'forgotPassword'}" 
        >
          {{ language === Languages.us ? "forgot the password?" : "забули пароль?" }}
        </RouterLink>
      </div>
      
      <div class="authentication__register-block">
        <div class="authentication__register-text" v-if="isLogin">
          {{language === Languages.us ? `don&#39;t have an accaunt?` : 'немає акаунта?'}}
        </div>
        <div class="authentication__register-text" v-if="!isLogin">
          {{language === Languages.us ? `have an account?` : 'є акаунт?'}}
        </div>
        <svg  
          height="8"   
          viewBox="0 0 54 8"  
          fill="none"  
          xmlns="http://www.w3.org/2000/svg"   
          class="authentication__arrow-sign"  
        >
          <path d="M53.3536 4.35355C53.5488 4.15829 53.5488 3.84171 53.3536 3.64645L50.1716 0.464466C49.9763 0.269204 49.6597 0.269204 49.4645 0.464466C49.2692 0.659728 49.2692 0.976311 49.4645 1.17157L52.2929 4L49.4645 6.82843C49.2692 7.02369 49.2692 7.34027 49.4645 7.53553C49.6597 7.7308 49.9763 7.7308 50.1716 7.53553L53.3536 4.35355ZM0 4.5H53V3.5H0V4.5Z" fill="#6E757C"/>
        </svg>

        <RouterLink 
          :to="{ name: 'authentication', params: { type: AuthenticationTypes.register }}" 
          class="authentication__register-link"
          v-if="route.params.type === 'login'"
        >
          {{ language === Languages.us ? "REGISTER" : "ЗАРЕЄСТРУВАТИСЯ"}}
        </RouterLink>
        <RouterLink 
          :to="{ name: 'authentication', params: { type: AuthenticationTypes.login }}" 
          class="authentication__register-link"
          v-else
        >
          {{ language === Languages.us ? "LOGIN" : "УВІЙТИ"}}
        </RouterLink>
      </div>
      <div class="authentication__or">
        <div class="authentication__or--line"></div>
        <div class="authentication__or--text">or</div>
        <div class="authentication__or--line"></div>
      </div>
      <div class="authentication__social-networks">
        <GoogleAuthentication />
      </div>
    </div>
  </div>
</template>

<style>
@import "./authenticationStyle.scss";
</style>