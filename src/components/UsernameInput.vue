<template>
  <div class="username-wrapper">
    <div class="input-container">
      <span
        v-if="hasUsername && !settings.isWikimedian"
        class="start-icon"
        :title="$t('error-no-wikimedian-account')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          class="icon-alert"
        >
          <g v-html="cdxIconAlert"></g>
        </svg>
      </span>
      <input
        v-model="displayUsername"
        type="text"
        class="username-input cdx-text-input"
        :class="{
          'has-username': hasUsername && !isEditing && !isHovering,
          'cdx-text-input--status-warning': hasUsername && !settings.isWikimedian,
          'cdx-text-input--has-start-icon': hasUsername && !settings.isWikimedian,
        }"
        :placeholder="hasUsername ? '' : $t('settings-accounts-wikimedia-placeholder')"
        :readonly="!isEditing"
        :title="hasUsername && !settings.isWikimedian ? $t('error-no-wikimedian-account') : ''"
        @click="startEditing"
        @blur="validateAndNavigate"
        @keyup.enter="$event.target.blur()"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { navigateToUser } from '@/router'
import { cdxIconAlert } from '@wikimedia/codex-icons'

const settings = useSettingsStore()

// Transient editing state only
const localUsername = ref('')
const isEditing = ref(false)
const isHovering = ref(false)

// Computed: hasUsername based on single source of truth
const hasUsername = computed(
  () => settings.wikimediaUsername && settings.wikimediaUsername.trim() !== '',
)

// Computed: display value - show settings value when not editing, local value when editing
const displayUsername = computed({
  get: () => (isEditing.value ? localUsername.value : settings.wikimediaUsername || ''),
  set: (value) => {
    if (isEditing.value) {
      localUsername.value = value
    }
  },
})

/**
 * Start editing: copy current username to local buffer
 */
function startEditing() {
  if (!isEditing.value) {
    localUsername.value = settings.wikimediaUsername || ''
    isEditing.value = true
  }
}

/**
 * Validate and navigate to user page on blur
 */
async function validateAndNavigate() {
  isEditing.value = false
  isHovering.value = false

  // Only update if value changed
  if (localUsername.value.trim() !== settings.wikimediaUsername) {
    const result = await navigateToUser(localUsername.value)

    if (!result.success) {
      alert(result.message)
    }
  }

  // Clear local buffer
  localUsername.value = ''
}
</script>

<style scoped>
.username-wrapper {
  display: flex;
  align-items: center;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.start-icon {
  position: absolute;
  left: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.icon-alert {
  fill: #ff8800;
}

.username-input {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
  min-width: 160px;
  width: 100%;
  cursor: pointer;
  /* Default: white background (no username, hovered, or editing) */
  background-color: white;
  color: rgb(44, 62, 80);
  border-color: rgba(255, 255, 255, 0.5);
}

.username-input.cdx-text-input--has-start-icon {
  padding-left: 2.5rem;
}

.username-input::placeholder {
  color: rgba(44, 62, 80, 0.6);
}

.username-input:focus,
.username-input:hover {
  outline: none;
  box-shadow: 0 0 0 1px rgba(44, 62, 80, 0.3);
  cursor: text;
  color: rgb(44, 62, 80);
}

/* When username exists and not hovered/editing: inherit theme colors */
.username-input.has-username {
  background-color: rgb(44, 62, 80);
  color: white;
  border-color: rgb(44, 62, 80);
  cursor: pointer;
}

/* Warning state for invalid Wikimedian username */
.username-input.cdx-text-input--status-warning {
  border-color: #ff8800;
  background-color: #fff;
  color: rgb(44, 62, 80);
}

.username-input.cdx-text-input--status-warning:focus {
  box-shadow: 0 0 0 1px #ff8800;
  border-color: #ff8800;
}

.username-input[readonly] {
  cursor: pointer;
}

@media (max-width: 768px) {
  .username-input {
    min-width: 120px;
    font-size: 13px;
    padding: 0.4rem 0.8rem;
  }

  .username-input.cdx-text-input--has-start-icon {
    padding-left: 2.25rem;
  }

  .start-icon {
    left: 0.5rem;
  }
}

@media (max-width: 480px) {
  .username-input {
    min-width: 100px;
    font-size: 12px;
    padding: 0.35rem 0.6rem;
  }

  .username-input.cdx-text-input--has-start-icon {
    padding-left: 2rem;
  }

  .start-icon {
    left: 0.4rem;
  }

  .icon-alert {
    width: 16px;
    height: 16px;
  }
}
</style>
