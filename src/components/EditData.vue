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
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { cdxIconEdit } from '@wikimedia/codex-icons'

const settings = useSettingsStore()

const hasUsername = computed(
  () => settings.wikimediaUsername && settings.wikimediaUsername.trim() !== '',
)

const placeholderJson = `[
  { binomial: 'Pica pica', group: 'bird' },
  { binomial: 'Podarcis muralis', group: 'reptile' },
  { binomial: 'Quercus robur', group: 'tree' },
  { binomial: 'Erithacus rubecula', group: 'bird' },
  { binomial: 'Corylus avellana', group: 'tree' },
  { binomial: 'Ficus carica', group: 'tree' },
  { binomial: 'Diospyros kaki', group: 'tree' },
  { binomial: 'Quercus suber', group: 'tree' },
  { binomial: 'Ilex aquifolium', group: 'tree' },
  { binomial: 'Mespilus germanica', group: 'tree' },
  { binomial: 'Prunus persica', group: 'tree' }
]`

const editUrl = computed(() => {
  if (!hasUsername.value) {
    return 'https://meta.wikimedia.org/w/index.php?title=Special:UserLogin&returnto=Main+Page'
  }

  const username = settings.wikimediaUsername
  const wrappedJson = `<syntaxhighlight lang="json">\n${placeholderJson}\n</syntaxhighlight>`
  const encodedPreloadText = encodeURIComponent(wrappedJson)

  return `https://meta.wikimedia.org/wiki/User:${encodeURIComponent(username)}/GardensHavens?action=edit&preloadtext=${encodedPreloadText}`
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
  color: white;
  text-decoration: none;
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
