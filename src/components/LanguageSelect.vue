<template>
  <div class="language-selector">
    <select
      id="language-select"
      v-model="selectedLocale"
      class="language-select"
      @change="changeLanguage"
    >
      <option v-for="locale in Object.keys(languageNames)" :key="locale" :value="locale">
        {{ getLanguageName(locale) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const selectedLocale = ref(locale.value)

const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
}

const locales = Object.keys(languageNames)

function getLanguageName(localeCode) {
  return languageNames[localeCode] || localeCode
}

function changeLanguage() {
  locale.value = selectedLocale.value
  localStorage.setItem('preferred-locale', selectedLocale.value)
}

onMounted(() => {
  const savedLocale = localStorage.getItem('preferred-locale')
  if (savedLocale && locales.includes(savedLocale)) {
    selectedLocale.value = savedLocale
    locale.value = savedLocale
  }
})
</script>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-label {
  font-weight: 600;
  font-size: 14px;
  color: white;
}

.language-select {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.language-select option {
  background-color: #2c3e50;
  color: white;
}

.language-select:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-select:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 1px white;
}

@media (max-width: 768px) {
  .language-select {
    padding: 0.4rem 0.8rem;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .language-select {
    padding: 0.35rem 0.6rem;
    font-size: 12px;
  }
}
</style>
