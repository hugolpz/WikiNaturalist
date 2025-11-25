<template>
  <div class="gallery-view">
    <div v-if="loading" class="gallery-loading">
      <p>{{ $t('status-loading-species-list') }}</p>
    </div>

    <div v-else-if="error" class="gallery-error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="places-container">
      <div v-for="place in placesData" :key="place.place" class="place-section">
        <!-- Place Header -->
        <div class="place-header">
          <h2 class="place-title">{{ place.place }}</h2>
          <div v-if="place.lat && place.lon" class="place-coordinates">
            <span class="coordinates">
              📍 {{ place.lat.toFixed(3) }}, {{ place.lon.toFixed(3) }}
            </span>
          </div>
        </div>

        <!-- Species Grid for this place -->
        <div class="gallery-grid">
          <SpeciesCard
            v-for="species in place.list"
            :key="species.binomial"
            :binomial-name="species.binomial"
            :group="species.group || 'unknown'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchBiolist } from '@/utils/fetchBiolist'
import SpeciesCard from '@/components/SpeciesCard.vue'

const { t } = useI18n()
const placesData = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    placesData.value = await fetchBiolist()
  } catch (err) {
    error.value = t('error-loading-species-data')
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

.places-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.place-section {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.place-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.place-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.place-coordinates {
  display: flex;
  align-items: center;
}

.coordinates {
  background-color: #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
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

  .place-section {
    padding: 1.5rem;
  }

  .place-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .place-title {
    font-size: 1.5rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .gallery-view {
    padding: 0.5rem;
  }

  .place-section {
    padding: 1rem;
    border-radius: 8px;
  }

  .place-title {
    font-size: 1.25rem;
  }

  .coordinates {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
