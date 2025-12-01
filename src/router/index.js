import { createRouter, createWebHashHistory } from 'vue-router'
import GalleryView from '@/views/GalleryView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useSettingsStore } from '@/stores/settings'

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

export default router
