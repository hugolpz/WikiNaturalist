// --- 1. Biological Group Configuration ---
export const validGroups = [
  // Kingdom Animalia Classes (Most specific first)
  {
    group: 'mammal',
    emoji: '🐘', // 🐂🐎🦬🐀🐖🐒🐅🐕🐺🦭

    phylogeny: 'Class: Mammalia',
    qid: 'Q7377',
    color_code: '#FFDDAA',
    explainer: 'Warm-blooded vertebrates, typically covered in hair or fur, nurse their young.',
  },
  {
    group: 'bird',
    emoji: '🐦', // 🐓🐤🦚🦅🦉🪺🕊️🦜🦆🦢🐣🪿🐔🦃🐧
    phylogeny: 'Class: Aves',
    qid: 'Q5113',
    color_code: '#49c0c0ff',
    explainer:
      'Warm-blooded vertebrates, feathered, lay hard-shelled eggs, usually capable of flight.',
  },
  {
    group: 'reptile',
    emoji: '🐍', // 🐊🐢🦎
    phylogeny: 'Class: Reptilia',
    qid: 'Q10811',
    color_code: '#80AA50FF',
    explainer:
      'Cold-blooded vertebrates, covered in scales or bony plates, lay amniotic eggs. (Includes snakes, lizards, turtles).',
  },
  {
    group: 'amphibian',
    emoji: '🐸', //
    phylogeny: 'Class: Amphibia',
    qid: 'Q10908',
    color_code: '#50B080FF',
    explainer:
      'Cold-blooded vertebrates, typically smooth/moist skin, undergo metamorphosis (water/land lifecycle).',
  },
  {
    group: 'fish',
    emoji: '🐠', // 🐟🦈🐡
    phylogeny: 'Superclass/Class: Pisces',
    qid: 'Q2089675',
    color_code: '#20A0B0FF',
    explainer: 'Aquatic vertebrates, typically scaly, breathe through gills, fins for movement.',
  },
  {
    group: 'arachnid',
    emoji: '🕷️',
    phylogeny: 'Class: Arachnida',
    qid: 'Q1358',
    color_code: '#808080FF',
    explainer:
      'Arthropods with two body sections (cephalothorax, abdomen) and eight legs. (Includes spiders, scorpions, ticks).',
  },
  {
    group: 'insect',
    emoji: '🐜', // 🪰🦗🦟🐝🪳🪲🕷️🐞🦋🐛
    phylogeny: 'Class: Insecta',
    qid: 'Q1390',
    color_code: '#B09060FF',
    explainer:
      'Arthropods with three body sections (head, thorax, abdomen), six legs, and usually one or two pairs of wings.',
  },
  {
    group: 'mollusk',
    emoji: '🐌', //
    phylogeny: 'Phylum: Mollusca',
    qid: 'Q43219',
    color_code: '#A0C0E0FF',
    explainer:
      'Soft-bodied, unsegmented invertebrates, often enclosed in a shell. (Includes snails, slugs, clams, octopus).',
  },
  {
    group: 'other_arthropod',
    emoji: '🦀', // 🦞🦐
    phylogeny: 'Phylum: Arthropoda (Non-Insect/Arachnid)',
    qid: 'Q21',
    color_code: '#D09080FF',
    explainer:
      'Creatures with segmented bodies, hard exoskeletons, and jointed limbs. (Includes crabs, shrimp, centipedes, millipedes).',
  },
  {
    group: 'invertebrate',
    emoji: '🪱', // 🪼
    phylogeny: 'Kingdom: Animalia (General)',
    qid: 'Q34091',
    color_code: '#FFDDAA',
    explainer: 'Catch-all for other animals without backbones (e.g., worms, jellyfish, starfish).',
  },
  {
    group: 'plant',
    emoji: '🌿',
    phylogeny: 'Kingdom: Plantae (General)',
    qid: 'Q756',
    color_code: '#88DD88FF',
    explainer:
      'General category for organisms that photosynthesize. Used as a fallback for non-woody, non-grass plants.',
  },
  {
    group: 'grass',
    emoji: '🌾', // 🌾☘️🌱
    phylogeny: 'Kingdom: Plantae',
    qid: 'Q34723',
    color_code: '#CCFFCC',
    explainer:
      'Non-woody plants, often small or flexible-stemmed. (Includes true grasses, wildflowers, shrubs, ferns).',
  },
  {
    group: 'tree',
    emoji: '🌳', //🌲🌳🌴🍁
    phylogeny: 'Life Form/Kingdom: Plantae',
    qid: 'Q7541',
    color_code: '#55BB55FF',
    explainer: 'Large, woody, perennial plants with a single stem or trunk.',
  },
  {
    group: 'fungi',
    emoji: '🍄', // 🍄‍🟫
    phylogeny: 'Kingdom: Fungi',
    qid: 'Q7705',
    color_code: '#E0E0A0FF',
    explainer:
      'Non-photosynthetic organisms that reproduce via spores. (Includes Mushroom, molds, yeasts).',
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

// --- 3. Target Group Configuration (Derived from validGroups) ---
// Extract groups with QIDs for taxonomic assessment, maintaining priority order
const TARGET_GROUPS_ORDERED = validGroups
  .filter((group) => group.qid) // Only groups with QIDs
  .map((group) => ({ group: group.group, qid: group.qid }))

// --- 4. Domestic Animal Mappings ---
// Handle domestic animals that lack proper taxonomic relationships
const DOMESTIC_ANIMAL_MAPPINGS = {
  Q144: 'Q25324', // Canis lupus familiaris → Canidae
  Q146: 'Q25265', // Felis catus → Felidae (already works, but explicit)
}

// --- 5. Group Output Mapping ---
// Map to handle output consolidation (tree/grass/plant -> plant)
const GROUP_OUTPUT_MAP = {
  grass: 'plant',
  tree: 'plant',
  // All others map to themselves by default
}

// --- 6. Wikidata API Constants ---
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php'

/**
 * Executes a single API call to get the parent taxon (P171), instance/subclass (P31/P279), and taxon relations (P1176) for a QID.
 * @param {string} QID - The Wikidata Item ID (e.g., 'Q12345').
 * @returns {Promise<object>} - An object containing the immediate parent QID and any related taxon QIDs.
 */
async function getQIDClaims(QID) {
  const url = new URL(WIKIDATA_API)
  url.search = new URLSearchParams({
    action: 'wbgetentities',
    ids: QID,
    props: 'claims',
    format: 'json',
    origin: '*', // Required for CORS in browser
  })

  const response = await fetch(url)
  const data = await response.json()
  const entity = data.entities[QID]

  if (!entity || entity.missing) {
    return { parentQID: null, conceptualQIDs: [], taxonQIDs: [] }
  }

  const claims = entity.claims

  // Helper to extract QID from a claim property
  const extractQIDs = (property) => {
    const claimList = claims[property] || []
    return claimList
      .map((claim) => claim.mainsnak.datavalue && claim.mainsnak.datavalue.value.id)
      .filter((id) => id)
  }

  const parentQIDs = extractQIDs('P171') // parent taxon
  const conceptualQIDs = [...extractQIDs('P31'), ...extractQIDs('P279')] // instance of, subclass of
  const taxonQIDs = extractQIDs('P1176') // taxon known by this common name

  return {
    parentQID: parentQIDs.length > 0 ? parentQIDs[0] : null,
    conceptualQIDs: conceptualQIDs,
    taxonQIDs: taxonQIDs, // Add taxon QIDs for domestic animals
  }
}

/**
 * Resolves a binomial name to its group by traversing the taxonomic hierarchy.
 * @param {string} binomialName - The scientific name (e.g., 'Canis familiaris').
 * @param {string} locale - The Wikipedia locale to use for QID lookup (e.g., 'en').
 * @returns {Promise<string>} - The matching group name (e.g., 'mammal', 'plant', or 'unknown').
 */
export async function assessGroupMembership(binomialName, locale = 'en') {
  console.log(`🔍 Assessing group for: ${binomialName}`)

  // --- Step 1: Find the initial QID for the species ---
  const searchUrl = new URL(`https://${locale}.wikipedia.org/w/api.php`)
  searchUrl.search = new URLSearchParams({
    action: 'query',
    prop: 'pageprops',
    titles: binomialName,
    redirects: 1,
    format: 'json',
    ppprop: 'wikibase_item',
    origin: '*',
  })

  try {
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()
    const pages = searchData.query.pages
    const initialPageId = Object.keys(pages).find((id) => id !== '-1')

    if (!initialPageId || !pages[initialPageId].pageprops) {
      console.log(`❌ Could not find Wikidata item for ${binomialName}`)
      return 'unknown'
    }

    let currentQID = pages[initialPageId].pageprops.wikibase_item
    console.log(`📍 Starting QID: ${currentQID}`)
    const visitedQIDs = new Set() // Prevent infinite loops
    const qidsToCheck = [currentQID] // Queue for BFS

    // --- Step 2 & 3: Hierarchy Traversal and Conceptual Check ---
    while (qidsToCheck.length > 0) {
      currentQID = qidsToCheck.shift()

      if (!currentQID || visitedQIDs.has(currentQID)) {
        continue
      }

      visitedQIDs.add(currentQID)

      const claims = await getQIDClaims(currentQID)
      const parentQID = claims.parentQID
      const conceptualQIDs = claims.conceptualQIDs
      const taxonQIDs = claims.taxonQIDs

      // Check if the current QID matches a target group
      for (const { group: groupName, qid: targetQID } of TARGET_GROUPS_ORDERED) {
        if (currentQID === targetQID) {
          console.log(`✅ Found match: ${binomialName} → ${groupName} (QID: ${targetQID})`)
          const result = GROUP_OUTPUT_MAP[groupName] || groupName
          console.log(`📤 Final result: ${result}`)
          return result
        }
      }

      // Add parent taxon to queue
      if (parentQID && !visitedQIDs.has(parentQID)) {
        qidsToCheck.push(parentQID)
      }

      // Add taxon QIDs to queue (for domestic animals)
      for (const taxonQID of taxonQIDs) {
        if (!visitedQIDs.has(taxonQID)) {
          qidsToCheck.push(taxonQID)
        }
      }

      // Handle domestic animals with explicit mappings
      if (DOMESTIC_ANIMAL_MAPPINGS[currentQID]) {
        const mappedQID = DOMESTIC_ANIMAL_MAPPINGS[currentQID]
        if (!visitedQIDs.has(mappedQID)) {
          qidsToCheck.push(mappedQID)
        }
      }

      // Add conceptual QIDs to queue for recursive checking
      for (const conceptualQID of conceptualQIDs) {
        if (!visitedQIDs.has(conceptualQID)) {
          qidsToCheck.push(conceptualQID)
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error during group assessment for ${binomialName}:`, error)
  }

  // If loop finished without finding a match
  console.log(`❓ No match found for ${binomialName}, returning 'unknown'`)
  return 'unknown'
}
