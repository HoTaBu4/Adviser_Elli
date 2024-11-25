<script setup lang="ts">
import { ref } from "vue";

defineProps({
  isValid: {
    type: Boolean,
    required: false,
  },
  error: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  currentField: {
    type: String,
    required: false,
  },
  isStatic: {
    type: Boolean,
    required: false,
  },
  labelText: {
    type: String,
    required: true,
  },
  lastField: {
    type: String,
    required: false,
  },
  labelColor: {
    type: Boolean,
    reqired: false,
  },
  isPassword: {
    type: Boolean,
    reqired: false,
  },
  disabled: {
    type: Boolean,
    requred: false,
    default: false,
  }
});

const isShownPassword = ref(false);

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>
<template>
  <div
    class="input-field"
    :class="{
      'slide-out-left':
        !isStatic &&
        (lastField !== name || lastField === name) &&
        currentField !== name,
      'slide-in-right':
        !isStatic && lastField !== name && currentField === name,
      'right-position': !isStatic && currentField !== name && !isValid,
      'input-field--static': isStatic,
    }"
  >
    <label
      :for="name"
      class="input-field__label"
      :class="{
        'input-field__label--error': error,
        'input-field__label--dark': labelColor,
      }"
    >
      {{ error ? error : labelText }}
    </label>
    <div class="input-field__wrapper">
      <input
        :type="isPassword && !isShownPassword ? 'password' : 'text'"
        class="input-field__input"
        :placeholder="placeholder"
        :name="name"
        :value="modelValue"
        @input="handleInput"
        :class="{ 'input-field__input--error': error, password: isPassword }"
        :disabled="disabled"
      />
      <button
        v-if="isPassword"
        :class="['input-field__password', { shown: isShownPassword }]"
        @click.prevent="isShownPassword = !isShownPassword"
        aria-label="Toggle password visibility"
      >
        <img
          src="/pictures/icons/eye.svg"
          alt=""
          class="input-field__password--img"
        />
        <div
          :class="['input-field__cover', { hidden: !isShownPassword }]"
        ></div>
      </button>
    </div>
  </div>
</template>
<style>
@import "./inputField.scss";
</style>
