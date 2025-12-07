import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  // Load settings from localStorage or use defaults
  const showTaxonImage = ref(loadSetting('showTaxonImage', true))
  const showTaxonRange = ref(loadSetting('showTaxonRange', true))
  const showRangeMap = ref(loadSetting('showRangeMap', false))
  const showConservationStatus = ref(loadSetting('showConservationStatus', true))
  const showShortDescription = ref(loadSetting('showShortDescription', false))
  const showLongDescription = ref(loadSetting('showLongDescription', true))
  const showCardFooter = ref(loadSetting('showCardFooter', true))
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

  watch(showRangeMap, (value) => {
    saveSetting('showRangeMap', value)
  })

  watch(showConservationStatus, (value) => {
    saveSetting('showConservationStatus', value)
  })

  watch(showShortDescription, (value) => {
    saveSetting('showShortDescription', value)
  })

  watch(showLongDescription, (value) => {
    saveSetting('showLongDescription', value)
  })

  watch(showCardFooter, (value) => {
    saveSetting('showCardFooter', value)
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
    showRangeMap,
    showConservationStatus,
    showShortDescription,
    showLongDescription,
    showCardFooter,
    wikimediaUsername,
    compactView,
    toggleCompactView,
    setUsername,
  }
})
