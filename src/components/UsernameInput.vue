<template>
  <div class="username-wrapper">
    <input
      v-if="isEditing"
      v-model="username"
      type="text"
      class="username-input"
      :placeholder="$t('wikimedia-username-input-prompt')"
      @blur="handleBlur"
      @focus="startEditing"
    />
    <div
      v-else
      class="username-display"
      :class="{ 'has-username': hasUsername, hovered: isHovering }"
      @click="startEditing"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <template v-if="hasUsername">{{ username }}</template>
      <template v-else>
        <span class="desktop-text">Username ?</span>
        <span class="mobile-text">User?</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { navigateToUser, updateRouteForUsername } from '@/router'

const settings = useSettingsStore()

const username = ref('')
const isEditing = ref(false)
const isHovering = ref(false)

const hasUsername = computed(() => username.value && username.value.trim() !== '')

function startEditing() {
  isEditing.value = true
}

async function handleBlur() {
  isEditing.value = false

  // Use router helper to handle navigation and validation
  const result = await navigateToUser(username.value)

  if (!result.success) {
    // Revert to previous username if navigation failed
    username.value = settings.wikimediaUsername
    alert(result.message)
  }
}

// Watch for changes from settings store (e.g., from Settings page or route)
watch(
  () => settings.wikimediaUsername,
  (newValue) => {
    username.value = newValue
    // Only update route if not currently editing
    if (!isEditing.value) {
      updateRouteForUsername(newValue)
    }
  },
  { immediate: true },
)

// Initialize on mount
onMounted(() => {
  username.value = settings.wikimediaUsername
})
</script>

<style scoped>
.username-wrapper {
  display: flex;
  align-items: center;
}

.username-input,
.username-display {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
  min-width: 160px;
  cursor: pointer;
}

.username-input {
  background-color: white;
  color: rgb(44, 62, 80);
  border-color: rgba(255, 255, 255, 0.5);
}

.username-input::placeholder {
  color: rgba(44, 62, 80, 0.6);
}

.username-input:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(44, 62, 80, 0.3);
}

.username-display {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.username-display.has-username {
  background-color: rgb(44, 62, 80);
  color: white;
  border-color: rgb(44, 62, 80);
}

.username-display.hovered {
  background-color: white;
  color: rgb(44, 62, 80);
  border-color: rgba(255, 255, 255, 0.5);
}

.mobile-text {
  display: none;
}

@media (max-width: 768px) {
  .username-input,
  .username-display {
    min-width: 120px;
    font-size: 13px;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .username-input,
  .username-display {
    min-width: 100px;
    font-size: 12px;
    padding: 0.35rem 0.6rem;
  }

  .desktop-text {
    display: none;
  }

  .mobile-text {
    display: inline;
  }
}
</style>
