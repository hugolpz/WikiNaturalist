<template>
  <a
    :href="editUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="edit-data-button"
    :title="hasUsername ? $t('link-edit-list-logged-in') : $t('link-edit-list-logged-out')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      class="edit-icon"
    >
      <g v-html="cdxIconEdit"></g>
    </svg>
  </a>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { checkDatalistExists } from '@/utils/fetchDatalist'
import { cdxIconEdit } from '@wikimedia/codex-icons'

const props = defineProps({
  page: {
    type: String,
    required: false,
    default: '',
  },
  section: {
    type: String,
    required: false,
    default: '',
  },
  editintro: {
    type: String,
    required: false,
    default: '',
  },
  preload: {
    type: String,
    required: false,
    default: '',
  },
})

const settings = useSettingsStore()

const hasUsername = computed(
  () => settings.wikimediaUsername && settings.wikimediaUsername.trim() !== '',
)

const pageExists = ref(null) // null = checking, true = exists, false = doesn't exist

// Watch for username changes and check page existence
watch(
  hasUsername,
  async (newHasUsername) => {
    if (newHasUsername) {
      pageExists.value = null // Set to checking state
      pageExists.value = await checkDatalistExists(settings.wikimediaUsername)
    } else {
      pageExists.value = null
    }
  },
  { immediate: true },
)

const editUrl = computed(() => {
  const baseUrl = `https://meta.wikimedia.org/w/index.php?title=Special:UserLogin&returnto=`
  const returntoQuery = `action=edit&section=${props.section}&veswitched=1&editintro=${props.editintro}&preload=${props.preload}`
  //if (pageExists.value === true ) {
  return `${baseUrl}${encodeURIComponent(props.page)}&returntoquery=${encodeURIComponent(returntoQuery)}`
})
</script>

<style scoped>
.edit-data-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: background-color 0.2s;
  text-decoration: none;
  color: inherit;
}

.edit-data-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.edit-icon {
  fill: currentColor;
}

@media (max-width: 480px) {
  .edit-data-button {
    padding: 0.4rem;
  }

  .edit-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
