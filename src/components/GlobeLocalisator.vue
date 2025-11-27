<template>
  <div ref="globeContainer" class="globe-wp-container"></div>
</template>

<script setup>
import { onMounted, ref, watch, toRefs } from 'vue'
import { createOrthographicGlobe } from '@/utils/orthographic'

// Define component properties
const props = defineProps({
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: 'Location',
  },
  width: {
    type: Number,
    default: 48,
  },
})

const { lat, lon, title, width } = toRefs(props)
const globeContainer = ref(null)
/**
 * Initialize the globe
 */
const initGlobe = () => {
  if (!globeContainer.value) return
  // Clear any existing content
  globeContainer.value.innerHTML = ''
  // Create the orthographic globe
  try {
    createOrthographicGlobe(globeContainer.value, width.value, title.value, lat.value, lon.value)
  } catch (error) {
    console.error('Failed to create orthographic globe:', error)
  }
}

// Initialize on mount
onMounted(() => {
  initGlobe()
})

// Re-initialize when props change
watch([lat, lon, title, width], () => {
  initGlobe()
})
</script>

<style scoped>
.globe-wp-container {
  display: inline-block;
  cursor: grab;
  vertical-align: middle;
}

.globe-wp-container:active {
  cursor: grabbing;
}

.globe-wp-container :deep(svg) {
  display: block;
}
</style>
