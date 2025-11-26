<template>
  <button
    v-if="showInstallButton"
    @click="installApp"
    class="install-button"
    :title="$t('app-install')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="install-icon"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
    <span class="install-text">{{ $t('app-install') }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showInstallButton = ref(false)
let deferredPrompt = null

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
  deferredPrompt = event
  showInstallButton.value = true
}

const handleAppInstalled = () => {
  showInstallButton.value = false
  deferredPrompt = null
}

const installApp = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  console.log(`User response to install prompt: ${outcome}`)

  if (outcome === 'accepted') {
    showInstallButton.value = false
  }

  deferredPrompt = null
}

onMounted(() => {
  // Check if app is already installed
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App is running in standalone mode (installed)')
    return
  }

  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
.install-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.install-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.install-button:active {
  transform: translateY(0);
}

.install-icon {
  flex-shrink: 0;
}

.install-text {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .install-button {
    padding: 0.5rem 0.75rem;
    font-size: 13px;
  }

  .install-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .install-button {
    padding: 0.5rem;
  }
}
</style>
