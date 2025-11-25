import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en: {
      'app-title': 'Gardens Havens',
      'app-tagline': 'Gallery of your biodiversity neighborhood, Wikimedia-boosted.',
      'settings-title': 'Settings',
      'navigation-back-to-gallery': 'Back to Gallery',
      'settings-visibility-title': 'Visibility Settings',
      'settings-visibility-description': 'Choose which information to display on species cards',
      'settings-visibility-taxon-image': 'Taxon image',
      'settings-visibility-taxon-range': 'Taxon range',
      'settings-visibility-conservation-status': 'Conservation status',
      'settings-visibility-short-description': 'Short description',
      'settings-visibility-medium-description': 'Medium description',
      'settings-visibility-long-description': 'Long description',
      'settings-auto-saved-message': 'Settings are automatically saved',
      'status-loading': 'Loading...',
      'status-loading-list': 'Loading species list...',
      'status-loading-list-error': 'Failed to load species data',
      'status-data-unavailable': 'Data unavailable.',
      'link-wikipedia': 'View on Wikipedia',
      'link-wikidata': 'View on Wikidata',
      'link-github': 'View source code on GitHub',
      'link-github-sr': 'GitHub Repository',
      'link-edit-list-logged-in': 'Edit your species list',
      'link-edit-list-logged-out': 'Login to Wikimedia to create a species list',
      'footer-made-by': 'Made by Hugo Lopez',
      'wikimedia-integration-title': 'Wikimedia Integration',
      'wikimedia-integration-description':
        'Enter your Wikimedia username to load custom species lists',
      'wikimedia-username-label': 'Wikimedia Username',
      'wikimedia-username-placeholder': 'Enter your username (e.g., Yug)',
      'wikimedia-username-input-prompt': 'Input your Wikimedia username',
    },
  },
})

export default i18n
