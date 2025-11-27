<template>
  <div>
    <cdx-lookup
      :id="id"
      v-model:selected="selection"
      v-model:modelValue="internalInputValue"
      :menu-items="menuItems"
      :menu-config="menuConfig"
      :aria-label="$t('location-search-aria')"
      :placeholder="$t('location-search-placeholder')"
      :start-icon="cdxIconMapPin"
      class="cdx-lookup-responsive"
      @input="onInput"
      @load-more="onLoadMore"
      @update:selected="onSelectionChange"
    >
      <template #no-results>{{ $t('query-noresults') }}</template>
    </cdx-lookup>
  </div>
</template>

<script>
import { defineComponent, ref, watch, nextTick, onMounted } from 'vue'
import { CdxLookup } from '@wikimedia/codex'
import { cdxIconMapPin } from '@wikimedia/codex-icons'
import { useI18n } from 'vue-i18n'

import { useLabelsStore } from '@/stores/labels'
const labelsStore = useLabelsStore()

export default defineComponent({
  name: 'LocationSearch',
  components: { CdxLookup },
  props: {
    id: {
      type: String,
      default: undefined,
    },
    modelValue: {
      type: String,
      required: true,
    },
    inputValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'update:inputValue', 'Location-selected'],
  setup(props, { emit }) {
    const { locale } = useI18n()
    const menuItems = ref([])
    const currentSearchTerm = ref('')
    const selection = ref(props.modelValue || '')
    const internalInputValue = ref(props.inputValue || '')
    
    const menuConfig = {
      boldLabel: true,
      visibleItemLimit: 7,
    }

    // Fetch labels when needed and update the input field
    async function fetchLabelAndUpdateInput(qid) {
      if (!qid) return
      
      const currentLocale = locale.value || 'en'
      
      try {
        // Fetch label if needed
        if (!labelsStore.labels[qid]?.[currentLocale]) {
          await labelsStore.fetchLabelForWikidataItem(qid)
        }
        
        // Get the label
        if (labelsStore.labels[qid] && typeof labelsStore.labels[qid] === 'object') {
          const label = labelsStore.labels[qid][currentLocale]?.value || 
                       labelsStore.labels[qid]['en']?.value || 
                       qid
          
          // Update input value to show the label
          internalInputValue.value = label
          // Emit input value update event
          emit('update:inputValue', label)
          
          // Force DOM update if needed
          nextTick(() => {
            const input = document.querySelector(`#${props.id} input`)
            if (input && input.value !== label) {
              input.value = label
              input.dispatchEvent(new Event('input', { bubbles: true }))
            }
          })
        }
      } catch (error) {
        console.error('Error fetching label for', qid, error)
      }
    }
    
    // When a selection is made, emit events and update input with label
    async function onSelectionChange(value) {
      if (!value) return
      
      emit('update:modelValue', value)
      
      // Update input with the label
      await fetchLabelAndUpdateInput(value)
      
      // Emit Location selected event for parent component
      emit('Location-selected', value)
    }

    // Watch for locale and modelValue changes
    watch(
      [() => props.modelValue, () => locale.value],
      async () => {
        if (props.modelValue) {
          console.log('LocationSearch > props.modelValue: ',props.modelValue)
          await fetchLabelAndUpdateInput(props.modelValue)
        }
        // Also refresh search results if we have an active search
        if (currentSearchTerm.value) {
          onInput(currentSearchTerm.value)
        }
      },
      { immediate: true }
    )

    watch(selection, (newValue) => {
      emit('update:modelValue', newValue)
    })

    watch(
      () => props.modelValue,
      (newValue) => {
        selection.value = newValue
        
        // When model value changes, update the input value to show the label
        if (newValue) {
          fetchLabelAndUpdateInput(newValue)
        }
      }
    )
    
    // Watch for changes in inputValue prop
    watch(() => props.inputValue, (newVal) => {
      if (newVal !== undefined && newVal !== internalInputValue.value) {
        internalInputValue.value = newVal
        // Force update the DOM
        nextTick(() => {
          const input = document.querySelector(`#${props.id} input`)
          if (input && input.value !== newVal) {
            input.value = newVal
            input.dispatchEvent(new Event('input', { bubbles: true }))
          }
        })
      }
    })
    
    // Initialize input when component is mounted
    onMounted(() => {
      if (props.modelValue) {
        fetchLabelAndUpdateInput(props.modelValue)
      }
    })
    
    function fetchResults(searchTerm, offset) {
      const params = new URLSearchParams({
        origin: '*',
        action: 'wbsearchentities',
        format: 'json',
        language: locale.value,
        search: searchTerm,
        uselang: locale.value,
        limit: '20',
        type: 'item'
      })
      
      if (offset) {
        params.set('continue', String(offset))
      }
      
      return fetch(`https://www.wikidata.org/w/api.php?${params.toString()}`)
        .then((response) => response.json())
    }

    function onInput(value) {
      // Track the current search term internally
      currentSearchTerm.value = value

      // Do nothing if we have no input
      if (!value) {
        menuItems.value = []
        return
      }

      // Reset menu items before new search
      menuItems.value = []
      
      fetchResults(value)
        .then((data) => {
          // Make sure this data is still relevant first
          if (currentSearchTerm.value !== value) {
            return
          }

          // Reset the menu items if there are no results
          if (!data.search || data.search.length === 0) {
            menuItems.value = []
            return
          }

          // Build an array of menu items, filtering out excluded values
          const results = data.search
            .map((result) => {
              return {
                label: result.label,
                value: result.id,
                description: result.description,
              }
            })

          // Update menuItems
          menuItems.value = results
        })
        .catch(() => {
          // On error, set results to empty
          menuItems.value = []
        })
    }

    function deduplicateResults(results) {
      const seen = new Set(menuItems.value.map((result) => result.value))
      return results.filter((result) => !seen.has(result.value))
    }

    function onLoadMore(offset) {
      if (!currentSearchTerm.value) {
        return
      }
        
      fetchResults(currentSearchTerm.value, offset)
        .then((data) => {
          if (!data.search || data.search.length === 0) {
            return
          }

          const results = data.search
            .map((result) => {
              return {
                label: result.label,
                value: result.id,
                description: result.description,
              }
            })

          // Update menuItems with deduplicated results
          const deduplicatedResults = deduplicateResults(results)
          menuItems.value.push(...deduplicatedResults)
        })
    }

    return {
      menuItems,
      selection,
      menuConfig,
      onInput,
      onLoadMore,
      internalInputValue,
      onSelectionChange,
      cdxIconMapPin,
    }
  },
})
</script>

<style>
.language-mastered .cdx-text-input,
.language-mastered .cdx-select-vue__handle {
  min-width: 4em;
  overflow: hidden;
}
@media (max-width: 639px) {
  .language-mastered .cdx-text-input__start-icon,
  .language-mastered .cdx-select-vue__indicator {
    display: none; /* Hide icon */
  }
  .language-mastered .cdx-text-input__input {
    padding-left: 0.5rem; /* Update padding left */
  }
}
</style>