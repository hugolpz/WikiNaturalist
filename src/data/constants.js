export const locales = ['en', 'fr', 'es', 'zh', 'ko']

export const biolist = [
  { binomial: 'Canis lupus familiaris', group: 'mammal' },
  { binomial: 'Felis catus' },
  { binomial: 'Pica pica', group: 'bird' },
  { binomial: 'Podarcis muralis', group: 'reptile' },
  { binomial: 'Quercus robur', group: 'tree' },
  { binomial: 'Prunus avium' },
  { binomial: 'Poa pratensis', group: 'grass' },
  { binomial: 'Taraxacum officinale', group: 'plant' },
]

// Re-export biological group functionality from centralized location
export {
  validGroups,
  getGroupColor,
  getGroupEmoji,
  getGroupBackgroundColor,
  getGroupInfo,
} from '@/utils/assessBioGroup.js'
