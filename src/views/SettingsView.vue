<template>
  <div class="settings-view">
    <div class="settings-container">
      <div class="settings-header">
        <h2>{{ $t('settings-title') }}</h2>
        <router-link to="/" class="back-button">
          ← {{ $t('navigation-back-to-gallery') }}
        </router-link>
      </div>

      <div id="settings-section-accounts" class="settings-section">
        <h3>{{ $t('settings-accounts-title') }}</h3>

        <div id="settings-accounts-wikimedia" class="username-input">
          <label for="wikimedia-username" class="input-label">
            {{ $t('settings-accounts-wikimedia-label') }}:
          </label>
          <input
            id="wikimedia-username"
            v-model="settings.wikimediaUsername"
            type="text"
            class="username-field"
            :placeholder="$t('settings-accounts-wikimedia-placeholder')"
          />
        </div>

        <div class="userscript-message">
          <p v-html="$t('settings-userscript-message')"></p>
        </div>
      </div>

      <div id="settings-section-visiblity" class="settings-section">
        <h3>{{ $t('settings-visibility-title') }}</h3>
        <p class="settings-description">{{ $t('settings-visibility-description') }}</p>

        <div class="settings-options">
          <label class="setting-option">
            <input v-model="settings.showTaxonImage" type="checkbox" class="setting-checkbox" />
            <span class="setting-label">{{ $t('settings-visibility-item-image') }}</span>
          </label>

          <label class="setting-option">
            <input v-model="settings.showTaxonRange" type="checkbox" class="setting-checkbox" />
            <span class="setting-label">{{ $t('settings-visibility-item-range') }}</span>
          </label>

          <label class="setting-option">
            <input v-model="settings.showRangeMap" type="checkbox" class="setting-checkbox" />
            <span class="setting-label"
              >{{ $t('settings-visibility-item-range') }} (Experimental programmatic maps, GBIF
              data)</span
            >
          </label>

          <label class="setting-option">
            <input
              v-model="settings.showConservationStatus"
              type="checkbox"
              class="setting-checkbox"
            />
            <span class="setting-label">{{ $t('settings-visibility-conservation-status') }}</span>
          </label>

          <label class="setting-option">
            <input
              v-model="settings.showShortDescription"
              type="checkbox"
              class="setting-checkbox"
            />
            <span class="setting-label">{{ $t('settings-visibility-description-short') }}</span>
          </label>

          <label class="setting-option">
            <input
              v-model="settings.showLongDescription"
              type="checkbox"
              class="setting-checkbox"
            />
            <span class="setting-label">{{ $t('settings-visibility-description-long') }}</span>
          </label>

          <label class="setting-option">
            <input v-model="settings.showCardFooter" type="checkbox" class="setting-checkbox" />
            <span class="setting-label">Card footer (Wikipedia, Wikidata, Share links)</span>
          </label>
        </div>
      </div>

      <div class="settings-footer">
        <p class="info-text">{{ $t('settings-auto-saved-message') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
</script>

<style scoped>
.settings-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.settings-header h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

.back-button {
  color: white;
  background-color: #36c;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.back-button:hover {
  background-color: #25a;
  transform: translateX(-2px);
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.settings-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.setting-option:hover {
  background-color: #e9ecef;
}

.setting-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 1rem;
}

.setting-label {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.settings-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.info-text {
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
  margin: 0;
}

.username-input {
  margin-top: 1rem;
}

.input-label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.username-field {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.username-field:focus {
  outline: none;
  border-color: #36c;
}

.userscript-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border-left: 4px solid #36c;
  border-radius: 4px;
}

.userscript-message p {
  margin: 0;
  color: #333;
  line-height: 1.6;
}

.userscript-message a {
  color: #36c;
  text-decoration: underline;
  font-weight: 500;
}

.userscript-message a:hover {
  color: #25a;
}

@media (max-width: 768px) {
  .settings-view {
    padding: 1rem;
  }

  .settings-container {
    padding: 1.5rem;
  }

  .settings-header {
    align-items: flex-start;
    gap: 1rem;
  }

  .settings-header h2 {
    font-size: 1.5rem;
  }
}
</style>
