export const locales = ['en', 'fr', 'es', 'zh', 'ko']

export const datalist = [
  { binomial: 'Canis lupus familiaris', category: 'mammal' },
  { binomial: 'Felis catus' },
  { binomial: 'Pica pica', category: 'bird' },
  { binomial: 'Podarcis muralis', category: 'reptile' },
  { binomial: 'Quercus robur', category: 'tree' },
  { binomial: 'Prunus avium' },
  { binomial: 'Poa pratensis', category: 'grass' },
  { binomial: 'Taraxacum officinale', category: 'plant' },
]

// Re-export category functionality from centralized location
export {
  validCategories,
  getCategoryColor,
  getCategoryEmoji,
  getCategoryBackgroundColor,
  getCategoryInfo,
} from '@/utils/assessCategory.js'

// Legacy alias for backward compatibility
export const biolist = datalist
