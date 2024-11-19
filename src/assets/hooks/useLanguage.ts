import { computed } from "vue";
import { useStore } from "vuex";
import { Languages } from "../../store/types/LanguageType";

export function useLanguage() {
  const store = useStore();
  const language = computed(() => store.getters["language/language"]);

  const handleSetLanguage = (targetLanguage: Languages) => {
    store.dispatch("language/updateLanguage", targetLanguage);
  };

  return { language, handleSetLanguage };
}
