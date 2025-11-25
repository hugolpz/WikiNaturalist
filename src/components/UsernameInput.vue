<template>
  <div class="username-wrapper">
    <input
      v-if="isEditing"
      v-model="username"
      type="text"
      class="username-input no-username"
      :placeholder="$t('wikimedia-username-input-prompt')"
      @blur="handleBlur"
      @focus="startEditing"
    />
    <div
      v-else
      class="username-display has-username"
      @click="startEditing"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      :class="{ hovered: isHovering }"
    >
      {{ username }}
    </div>
    <div
      v-if="!hasUsername && !isEditing"
      class="username-display no-username-display"
      @click="startEditing"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      :class="{ hovered: isHovering }"
    >
      <span class="username-text-desktop">Username ?</span>
      <span class="username-text-mobile">User?</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

const username = ref('')
const isEditing = ref(false)
const isHovering = ref(false)

const hasUsername = computed(() => username.value && username.value.trim() !== '')

function startEditing() {
  isEditing.value = true
}

function handleBlur() {
  isEditing.value = false
  // Sync with settings store when user finishes editing
  settings.wikimediaUsername = username.value
}

// Watch for changes from settings store (e.g., from Settings page)
watch(
  () => settings.wikimediaUsername,
  (newValue) => {
    username.value = newValue
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

/* When no username is set or editing */
.username-input.no-username {
  background-color: white;
  color: rgb(44, 62, 80);
  border-color: rgba(255, 255, 255, 0.5);
}

.username-input.no-username::placeholder {
  color: rgba(44, 62, 80, 0.6);
}

.username-input.no-username:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(44, 62, 80, 0.3);
}

/* When username is set and not being edited */
.username-display.has-username {
  background-color: rgb(44, 62, 80);
  color: white;
  border-color: rgb(44, 62, 80);
  cursor: pointer;
}

.username-display.has-username.hovered {
  background-color: white;
  color: rgb(44, 62, 80);
  border-color: rgba(255, 255, 255, 0.5);
}

/* When no username is set - show "Username ?" */
.username-display.no-username-display {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.username-display.no-username-display.hovered {
  background-color: white;
  color: rgb(44, 62, 80);
  border-color: rgba(255, 255, 255, 0.5);
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

  .username-text-desktop {
    display: none;
  }

  .username-text-mobile {
    display: inline;
  }
}

@media (min-width: 481px) {
  .username-text-desktop {
    display: inline;
  }

  .username-text-mobile {
    display: none;
  }
}
</style>
