export const defaultDatalist = `
== Default list ==
# { lat: 44.0, lon: 1.17 }
# Canis lupus familiaris
# Felis catus
# Pica pica
# Podarcis muralis
# Quercus robur
# Prunus avium
# Poa pratensis
# Taraxacum officinale
`

// Re-export category functionality from centralized location
export {
  validCategories,
  getCategoryColor,
  getCategoryEmoji,
  getCategoryBackgroundColor,
  getCategoryInfo,
} from '@/utils/assessCategory.js'
