<template>
  <div class="gallery-view">
    <div v-if="loading" class="gallery-loading">
      <p>{{ $t('status-loading-list') }}</p>
    </div>

    <div v-else-if="error" class="gallery-error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="locations-container">
      <div v-for="location in locationsData" :key="location.location" class="location-section">
        <!-- Location Header -->
        <div class="location-header">
          <h2 class="location-title">{{ location.location }}</h2>
          <div v-if="location.lat && location.lon" class="location-coordinates">
            <span class="coordinates">
              📍 {{ location.lat.toFixed(3) }}, {{ location.lon.toFixed(3) }}
            </span>
          </div>
        </div>

        <!-- Items Grid for this location -->
        <div class="gallery-grid">
          <ItemCard
            v-for="item in location.list"
            :key="item.binomial"
            :binomial-name="item.binomial"
            :group="item.category || item.group || 'unknown'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchDatalist } from '@/utils/fetchDatalist'
import ItemCard from '@/components/ItemCard.vue'

const { t } = useI18n()
const locationsData = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    locationsData.value = await fetchDatalist()
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

.locations-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.location-section {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.location-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.location-coordinates {
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

  .location-section {
    padding: 1.5rem;
  }

  .location-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .location-title {
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

  .location-section {
    padding: 1rem;
    border-radius: 8px;
  }

  .location-title {
    font-size: 1.25rem;
  }

  .coordinates {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
