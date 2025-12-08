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
  const wikimediaUsername = ref(loadSetting('wikimediaUsername', ''))
  const isWikimedian = ref(false)

  // Detect mobile and set default compact view
  const isMobile = window.innerWidth <= 768
  const compactView = ref(loadSetting('compactView', isMobile))

  /**
   * Check if a Wikimedia username exists
   * @param {string} username - The username to check
   * @returns {Promise<boolean>} - True if user exists, false otherwise
   */
  async function wikimediaUsernameExists(username) {
    if (!username || username.trim() === '') {
      return false
    }

    try {
      const apiUrl = `https://meta.wikimedia.org/w/api.php?action=query&list=users&ususers=${encodeURIComponent(username)}&usprop=registration&format=json&origin=*`
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const userInfo = data.query.users[0]

      return userInfo && userInfo.userid ? true : false
    } catch (error) {
      console.error('Error checking Wikimedia username:', error)
      return false
    }
  }

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

  // Note: wikimediaUsername watcher removed - setUsername() handles saving and validation
  // This prevents interference with router-based username updates

  watch(compactView, (value) => {
    saveSetting('compactView', value)
  })

  function toggleCompactView() {
    compactView.value = !compactView.value
  }

  async function setUsername(username) {
    console.log('setUsername called with:', username)
    console.log('Before: wikimediaUsername.value =', wikimediaUsername.value)

    wikimediaUsername.value = username
    saveSetting('wikimediaUsername', username)

    console.log('After: wikimediaUsername.value =', wikimediaUsername.value)

    // Validate username and update isWikimedian
    isWikimedian.value = await wikimediaUsernameExists(username)
    console.log('isWikimedian =', isWikimedian.value)
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
    isWikimedian,
    compactView,
    toggleCompactView,
    setUsername,
  }
})
