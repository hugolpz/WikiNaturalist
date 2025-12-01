import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  // Load settings from localStorage or use defaults
  const showTaxonImage = ref(loadSetting('showTaxonImage', true))
  const showTaxonRange = ref(loadSetting('showTaxonRange', true))
  const showConservationStatus = ref(loadSetting('showConservationStatus', true))
  const showMediumDescription = ref(loadSetting('showMediumDescription', true))
  const showLongDescription = ref(loadSetting('showLongDescription', true))
  const wikimediaUsername = ref(loadSetting('wikimedia-username', ''))

  // Detect mobile and set default compact view
  const isMobile = window.innerWidth <= 768
  const compactView = ref(loadSetting('compactView', isMobile))

  // Watch for changes and persist to localStorage
  watch(showTaxonImage, (value) => {
    saveSetting('showTaxonImage', value)
  })

  watch(showTaxonRange, (value) => {
    saveSetting('showTaxonRange', value)
  })

  watch(showConservationStatus, (value) => {
    saveSetting('showConservationStatus', value)
  })

  watch(showMediumDescription, (value) => {
    saveSetting('showMediumDescription', value)
  })

  watch(showLongDescription, (value) => {
    saveSetting('showLongDescription', value)
  })

  watch(wikimediaUsername, (value) => {
    saveSetting('wikimedia-username', value)
  })

  watch(compactView, (value) => {
    saveSetting('compactView', value)
  })

  function toggleCompactView() {
    compactView.value = !compactView.value
  }

  function setUsername(username) {
    wikimediaUsername.value = username
    saveSetting('wikimedia-username', username)
  }

  function loadSetting(key, defaultValue) {
    const stored = localStorage.getItem(key)
    return stored !== null ? JSON.parse(stored) : defaultValue
  }

  function saveSetting(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  return {
    showTaxonImage,
    showTaxonRange,
    showConservationStatus,
    showMediumDescription,
    showLongDescription,
    wikimediaUsername,
    compactView,
    toggleCompactView,
    setUsername,
  }
})
