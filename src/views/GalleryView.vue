<template>
  <div class="gallery-view">
    <div v-if="loading" class="gallery-loading">
      <p>{{ $t('status-loading-list') }}</p>
    </div>

    <div v-else-if="error" class="gallery-error">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <!-- Sticky Collection Navigation -->
      <CollectionNav :collections="collectionsData" />

      <div class="collections-container">
        <div
          v-for="(collection, index) in collectionsData"
          :key="collection['collection-title']"
          :id="`collection-${index}`"
          class="collection-section"
        >
          <!-- collection Header -->
          <div class="collection-header">
            <h2 class="collection-title">{{ collection['collection-title'] }}</h2>
            <div v-if="collection.lat && collection.lon" class="collection-coordinates">
              <span class="coordinates">
                📍 {{ collection.lat.toFixed(3) }}, {{ collection.lon.toFixed(3) }}
              </span>
              <GlobeLocalisator
                :lat="collection.lat"
                :lon="collection.lon"
                :title="collection['collection-title']"
                :width="64"
                class="collection-globe-wp"
              />
            </div>
          </div>

          <!-- Items Grid for this collection -->
          <div class="gallery-grid" :class="{ 'gallery-grid--compact': settings.compactView }">
            <ItemCard
              v-for="item in collection.list"
              :key="item.binomial"
              :binomial-name="item.binomial"
              :group="item.category || item.group || 'unknown'"
              :compact="settings.compactView"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchDatalist } from '@/utils/fetchDatalist'
import { useSettingsStore } from '@/stores/settings'
import ItemCard from '@/components/ItemCard.vue'
import GlobeLocalisator from '@/components/GlobeLocalisator.vue'
import CollectionNav from '@/components/CollectionNav.vue'

const { t } = useI18n()
const settings = useSettingsStore()
const collectionsData = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    collectionsData.value = await fetchDatalist()
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

.collections-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.collection-section {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  scroll-margin-top: 100px; /* Space for sticky nav */
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.collection-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.collection-location {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.collection-globe {
  flex-shrink: 0;
}

.collection-globe-wp {
  flex-shrink: 0;
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

.gallery-grid--compact {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .gallery-view {
    padding: 0;
  }

  .collection-section {
    padding: 1.5rem;
    scroll-margin-top: 80px;
  }

  .collection-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .collection-location {
    gap: 0.75rem;
  }

  .collection-title {
    font-size: 1.5rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .gallery-grid--compact {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .gallery-view {
    padding: 0;
  }

  .collection-section {
    padding: 1rem;
    border-radius: 8px;
    scroll-margin-top: 70px;
  }

  .collection-title {
    font-size: 1.25rem;
  }

  .coordinates {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .gallery-grid--compact {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }
}
</style>
