<template>
  <div class="gallery-view">
    <div v-if="loading" class="gallery-loading">
      <p>{{ $t('status-loading-list') }}</p>
    </div>

    <div v-else-if="error" class="gallery-error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="gallery-grid">
      <SpeciesCard
        v-for="species in biolist"
        :key="species.binomial"
        :binomial-name="species.binomial"
        :group="species.group || 'unknown'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchBiolist } from '@/utils/fetchBiolist'
import SpeciesCard from '@/components/SpeciesCard.vue'

const biolist = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    biolist.value = await fetchBiolist()
  } catch (err) {
    error.value = t('status-loading-list-error')
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.gallery-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.gallery-loading,
.gallery-error {
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.2rem;
  color: #666;
}

.gallery-error {
  color: #d33;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .gallery-view {
    padding: 1rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
