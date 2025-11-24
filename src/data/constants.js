export const locales = ['en', 'fr', 'es', 'zh']

export const biolist = [
  { binomial: 'Canis lupus familiaris', group: 'mammal' },
  { binomial: 'Felis catus', group: 'mammal' },
  { binomial: 'Pica pica', group: 'bird' },
  { binomial: 'Podarcis muralis', group: 'reptile' },
  { binomial: 'Quercus robur', group: 'tree' },
  { binomial: 'Prunus avium', group: 'tree' },
  { binomial: 'Poa pratensis', group: 'grass' },
  { binomial: 'Taraxacum officinale', group: 'plant' },
]

export const validGroups = [
  {
    group: 'mammal',
    label: 'mammal (Class: Mammalia)',
    color_code: '#FFDDAA',
    notes: 'Animalia (General)',
  },
  {
    group: 'bird',
    label: 'bird (Class: Aves)',
    color_code: '#FFDDAA',
    notes: 'Animalia (General)',
  },
  {
    group: 'reptile',
    label: 'reptile (Class: Reptilia)',
    color_code: '#FFDDAA',
    notes: 'Animalia (General)',
  },
  {
    group: 'fish',
    label: 'fish',
    color_code: '#FFDDAA',
    notes: 'Animalia (General)',
  },
  {
    group: 'insect',
    label: 'insect',
    color_code: '#FFDDAA',
    notes: 'Animalia (General)',
  },
  {
    group: 'arachnid',
    label: 'arachnid',
    color_code: '#FFDDAA',
    notes: 'Animalia (General)',
  },
  {
    group: 'invertebrate',
    label: 'invertebrate (i.e. worm, snail)',
    color_code: '#FFDDAA',
    notes: 'Animalia (General)',
  },
  {
    group: 'grass',
    label: 'grass (Family: Poaceae)',
    color_code: '#CCFFCC',
    notes: 'Plantae (General)',
  },
  {
    group: 'tree',
    label: 'tree (Life-form: Tree)',
    color_code: '#CCFFCC',
    notes: 'Plantae (General)',
  },
  {
    group: 'plant',
    label: 'plant',
    color_code: '#CCFFCC',
    notes: 'Plantae (General)',
  },
]

export function getGroupColor(groupName) {
  const group = validGroups.find((g) => g.group === groupName)
  return group ? group.color_code : '#B4FAB4'
}
