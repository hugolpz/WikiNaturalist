<template>
  <div
    class="card"
    :style="{ borderColor: groupColor, backgroundColor: groupBackgroundColor }"
    :class="[`card--group-${currentGroup}`]"
  >
    <div v-if="loading" class="card-loading">
      <p>{{ $t('loading') }}</p>
    </div>

    <div v-else-if="error" class="card-error">
      <div class="ribbon" :style="{ backgroundColor: groupColor }">
        {{ binomialName }}
      </div>
      <p class="error-message">{{ error }}</p>
    </div>

    <div v-else class="card-content">
      <!-- Taxon Name Ribbon -->
      <div class="ribbon ribbon-with-emoji" :style="{ backgroundColor: groupColor }">
        <span class="taxon-name">{{ cardData.taxonName }}</span>
        <span class="group-emoji">{{ groupEmoji }}</span>
      </div>

      <!-- Common Name Row -->
      <div v-if="cardData.commonName" class="common-name-row">
        {{ cardData.commonName }}
      </div>

      <!-- Image Section -->
      <div v-if="settings.showTaxonImage && cardData.image" class="image-section">
        <div class="ribbon ribbon-label" :style="{ backgroundColor: groupColor }">
          {{ $t('image') }}
        </div>
        <img :src="cardData.image" :alt="cardData.taxonName" class="image" />
      </div>

      <!-- Range Map Section -->
      <div v-if="settings.showTaxonRange && cardData.rangeMap" class="image-section">
        <div class="ribbon ribbon-label" :style="{ backgroundColor: groupColor }">
          {{ $t('range') }}
        </div>
        <img :src="cardData.rangeMap" :alt="`Range of ${cardData.taxonName}`" class="image" />
      </div>

      <!-- Short Description -->
      <div v-if="cardData.shortDescription" class="short-description">
        <div class="ribbon ribbon-label" :style="{ backgroundColor: groupColor }">
          {{ $t('shortDescription') }}
        </div>
        <div class="description-content">{{ cardData.shortDescription }}</div>
      </div>

      <!-- Long Description -->
      <div v-if="settings.showLongDescription && cardData.longDescription" class="long-description">
        <div class="ribbon ribbon-label" :style="{ backgroundColor: groupColor }">
          {{ $t('longDescription') }}
        </div>
        <div class="description-content" v-html="cardData.longDescription"></div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer">
        <a
          :href="wikipediaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
          :title="$t('viewOnWikipedia')"
        >
          <img src="/assets/wikipedia.svg" alt="Wikipedia" class="footer-icon" />
        </a>

        <a
          v-if="cardData.wikidataId"
          :href="`https://www.wikidata.org/wiki/${cardData.wikidataId}`"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
          :title="$t('viewOnWikidata')"
        >
          <img src="/assets/wikidata.svg" alt="Wikidata" class="footer-icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchCardData } from '@/utils/fetchCardData'
import { getGroupColor, getGroupBackgroundColor, getGroupEmoji } from '@/utils/assessBioGroup'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  binomialName: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    default: 'plant',
  },
})

const { locale, t } = useI18n()
const settings = useSettingsStore()
const cardData = ref(null)
const loading = ref(true)
const error = ref(null)

// Use assessed group from API data when available, otherwise fall back to prop
const currentGroup = computed(() => {
  return cardData.value?.assessedGroup || props.group || 'unknown'
})

const groupColor = computed(() => getGroupColor(currentGroup.value))
const groupBackgroundColor = computed(() => getGroupBackgroundColor(currentGroup.value))
const groupEmoji = computed(() => getGroupEmoji(currentGroup.value))

const wikipediaUrl = computed(() => {
  if (!cardData.value?.binomialName) return '#'
  const lang = locale.value || 'en'
  return `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-html/${encodeURIComponent(cardData.value.binomialName.replace(/ /g, '_'))}`
})

async function loadData() {
  loading.value = true
  error.value = null

  try {
    const data = await fetchCardData(props.binomialName, locale.value)
    cardData.value = data
  } catch (err) {
    error.value = t('failedToLoadSpeciesData')
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Reload data when locale changes
watch(locale, () => {
  loadData()
})
</script>

<style scoped>
.card {
  background-color: white;
  border: 3px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background-color 0.3s;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  height: 100%;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-loading,
.card-error {
  padding: 2rem;
  text-align: center;
}

.error-message {
  color: #d33;
  margin-top: 1rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.ribbon {
  color: black;
  background-color: rgb(180, 250, 180);
  border-collapse: separate;
  display: block;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 700;
  padding: 0.75rem 1rem;
  text-align: center;
}

.ribbon-with-emoji {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.taxon-name {
  flex: 1;
  text-align: center;
}

.group-emoji {
  font-size: 1.2em;
  margin-left: 0.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: #ffffffbb;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
}

.ribbon-label {
  font-size: 14px;
  padding: 0.5rem 1rem;
}

.common-name-row {
  padding: 0.75rem 1rem;
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
  text-align: center;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
  color: #666;
}

.image-section {
  display: flex;
  flex-direction: column;
}

.image {
  width: 100%;
  height: 230px;
  object-fit: cover;
  margin: 3px;
}

.short-description,
.long-description {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.description-content {
  padding: 1rem;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  flex-grow: 1;
}

.short-description .description-content {
  font-style: italic;
  font-weight: 500;
}

.description-content p {
  margin: 0;
}

.description-content :deep(a) {
  color: #36c;
  text-decoration: none;
}

.description-content :deep(a:hover) {
  text-decoration: underline;
}

.description-content :deep(b),
.description-content :deep(strong) {
  font-weight: 700;
}

.description-content :deep(i),
.description-content :deep(em) {
  font-style: italic;
}

.description-content :deep(sup) {
  font-size: 0.75em;
  vertical-align: super;
}

.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.footer-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  text-decoration: none;
}

.footer-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.footer-link:focus {
  outline: 2px solid #36c;
  outline-offset: 2px;
}

.footer-icon {
  width: 24px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.footer-link:hover .footer-icon {
  opacity: 1;
}
</style>
