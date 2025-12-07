import { createRouter, createWebHashHistory } from 'vue-router'
import GalleryView from '@/views/GalleryView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useSettingsStore } from '@/stores/settings'
import { checkDatalistExists } from '@/utils/fetchDatalist'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gallery',
      component: GalleryView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/User::username',
      name: 'user',
      component: GalleryView,
      beforeEnter: (to) => {
        console.log('Extracted username (1):', to.params.username)
        const username = to.params.username.replace(/:/g, '')
        console.log('Extracted username (2):', username)
        if (username) {
          // Set the username in Pinia store and localStorage
          const settingsStore = useSettingsStore()
          settingsStore.setUsername(username)
          console.log(`Wikimedia username set to: ${username}`)
        }
        // Redirect to gallery, preserving the hash fragment (e.g., #item-card-Pica_pica)
        // next({ name: 'gallery', hash: to.hash, replace: true })
      },
    },
  ],
})

/**
 * Navigate to user route with username validation and refresh
 * @param {string} username - The Wikimedia username
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function navigateToUser(username) {
  const trimmedUsername = username.trim()

  // If no username, go to root
  if (!trimmedUsername) {
    const settingsStore = useSettingsStore()
    settingsStore.setUsername('')
    await router.push({ path: '/' })
    return { success: true }
  }

  // Check if datalist exists
  const exists = await checkDatalistExists(trimmedUsername)

  if (exists) {
    const settingsStore = useSettingsStore()
    settingsStore.setUsername(trimmedUsername)
    // Force refresh by navigating to root first, then to user route
    await router.push({ path: '/' })
    await router.push({ path: `/User:${trimmedUsername}` })
    return { success: true }
  } else {
    console.warn(`No datalist found for user: ${trimmedUsername}`)
    return {
      success: false,
      message: `No species list found for user "${trimmedUsername}"`,
    }
  }
}

/**
 * Update route based on current username in settings
 * @param {string} username - The current username
 */
export async function updateRouteForUsername(username) {
  if (username && username.trim() !== '') {
    await router.push({ path: `/User:${username}` })
  } else {
    await router.push({ path: '/' })
  }
}

export default router
