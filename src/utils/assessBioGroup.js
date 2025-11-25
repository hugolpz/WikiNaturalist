// --- 1. Biological Group Configuration ---
export const validGroups = [
  // Kingdom Animalia Classes (Most specific first)
  {
    group: 'plant',
    emoji: '🌿',
    phylogeny: 'Plantae',
    qid: 'Q756',
    color_code: '#88DD88FF',
    explainer:
      'General category for organisms that photosynthesize. Used as a fallback for non-woody, non-grass plants.',
  },
  {
    group: 'grass',
    emoji: '🌾', // 🌾☘️🌱
    phylogeny: 'Plantae',
    qid: 'Q34723',
    color_code: '#CCFFCC',
    explainer:
      'Non-woody plants, often small or flexible-stemmed. (Includes true grasses, wildflowers, shrubs, ferns).',
  },
  {
    group: 'tree',
    emoji: '🌳', //🌲🌳🌴🍁
    phylogeny: 'Plantae',
    qid: 'Q7541',
    color_code: '#55BB55FF',
    explainer: 'Large, woody, perennial plants with a single stem or trunk.',
  },
  {
    group: 'fungi',
    emoji: '🍄', // 🍄‍🟫
    phylogeny: 'Fungi',
    qid: 'Q7705',
    color_code: '#E0E0A0FF',
    explainer:
      'Non-photosynthetic organisms that reproduce via spores. (Includes Mushroom, molds, yeasts).',
  },
  {
    group: 'mammal',
    emoji: '🐘', // 🐂🐎🦬🐀🐖🐒🐅🐕🐺🦭
    phylogeny: 'Mammalia',
    qid: 'Q7377',
    color_code: '#FFDDAA',
    explainer: 'Warm-blooded vertebrates, typically covered in hair or fur, nurse their young.',
  },
  {
    group: 'bird',
    emoji: '🐣', // 🐦🐓🐤🦚🦅🦉🪺🕊️🦜🦆🦢🐣🪿🐔🦃🐧
    phylogeny: 'Aves',
    qid: 'Q5113',
    color_code: '#49c0c0ff',
    explainer:
      'Warm-blooded vertebrates, feathered, lay hard-shelled eggs, usually capable of flight.',
  },
  {
    group: 'reptile',
    emoji: '🐍', // 🐊🐢🦎
    phylogeny: 'Reptilia',
    qid: 'Q10811',
    color_code: '#80AA50FF',
    explainer:
      'Cold-blooded vertebrates, covered in scales or bony plates, lay amniotic eggs. (Includes snakes, lizards, turtles).',
  },
  {
    group: 'amphibian',
    emoji: '🐸', //
    phylogeny: 'Amphibia',
    qid: 'Q10908',
    color_code: '#50B080FF',
    explainer:
      'Cold-blooded vertebrates, typically smooth/moist skin, undergo metamorphosis (water/land lifecycle).',
  },
  {
    group: 'fish',
    emoji: '🐠', // 🐟🦈🐡
    phylogeny: 'Pisces',
    qid: 'Q2089675',
    color_code: '#20A0B0FF',
    explainer: 'Aquatic vertebrates, typically scaly, breathe through gills, fins for movement.',
  },
  {
    group: 'arachnid',
    emoji: '🕷️',
    phylogeny: 'Arachnida',
    qid: 'Q1358',
    color_code: '#808080FF',
    explainer:
      'Arthropods with two body sections (cephalothorax, abdomen) and eight legs. (Includes spiders, scorpions, ticks).',
  },
  {
    group: 'insect',
    emoji: '🐜', // 🪰🦗🦟🐝🪳🪲🕷️🐞🦋🐛
    phylogeny: 'Insecta',
    qid: 'Q1390',
    color_code: '#B09060FF',
    explainer:
      'Arthropods with three body sections (head, thorax, abdomen), six legs, and usually one or two pairs of wings.',
  },
  {
    group: 'mollusk',
    emoji: '🐌', //
    phylogeny: 'Mollusca',
    qid: 'Q43219',
    color_code: '#A0C0E0FF',
    explainer:
      'Soft-bodied, unsegmented invertebrates, often enclosed in a shell. (Includes snails, slugs, clams, octopus).',
  },
  {
    group: 'other_arthropod',
    emoji: '🦀', // 🦞🦐
    phylogeny: 'Arthropoda', // (Non-Insect/Arachnid)
    qid: 'Q21',
    color_code: '#D09080FF',
    explainer:
      'Creatures with segmented bodies, hard exoskeletons, and jointed limbs. (Includes crabs, shrimp, centipedes, millipedes).',
  },
  {
    group: 'invertebrate',
    emoji: '🪱', // 🪼
    phylogeny: 'Animalia',
    qid: 'Q34091',
    color_code: '#FFDDAA',
    explainer: 'Catch-all for other animals without backbones (e.g., worms, jellyfish, starfish).',
  },
  {
    group: 'unknown',
    emoji: '🌎',
    phylogeny: 'Unknown',
    qid: null,
    color_code: '#B4FAB4',
    explainer: 'Species with unidentified biological classification.',
  },
]

// --- 2. Group Helper Functions ---
export function getGroupColor(groupName) {
  const group = validGroups.find((g) => g.group === groupName)
  return group ? group.color_code : '#B4FAB4'
}

export function getGroupEmoji(groupName) {
  const group = validGroups.find((g) => g.group === groupName)
  return group ? group.emoji : '🌿' // Default fallback emoji
}

export function getGroupBackgroundColor(groupName) {
  const group = validGroups.find((g) => g.group === groupName)
  if (!group) return '#f9f9f9' // Default light background

  // Convert hex to RGB and make it very light for background
  const hex = group.color_code.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Create a very light version (blend with white)
  const lightR = Math.round(r * 0.1 + 255 * 0.9)
  const lightG = Math.round(g * 0.1 + 255 * 0.9)
  const lightB = Math.round(b * 0.1 + 255 * 0.9)

  return `rgb(${lightR}, ${lightG}, ${lightB})`
}

export function getGroupInfo(groupName) {
  return (
    validGroups.find((g) => g.group === groupName) || validGroups.find((g) => g.group === 'unknown')
  )
}
