import { validCategories } from './assessCategory.js'

// --- 3. Target Category Configuration (Derived from validCategories) ---
// Extract categories with QIDs for taxonomic assessment, maintaining priority order
const targetCategories = validCategories
  .filter((category) => category.qid) // Only categories with QIDs
  .map((category) => ({ category: category.category, qid: category.qid }))

// --- 4. Domestic Animal Mappings ---
// Handle domestic animals that lack proper taxonomic relationships
const DOMESTIC_ANIMAL_MAPPINGS = {
  Q144: 'Q25324', // Canis lupus familiaris → Canidae
  Q146: 'Q25265', // Felis catus → Felidae (already works, but explicit)
}

// --- 5. Category Output Mapping ---
// Map to handle output consolidation (tree/grass/plant -> plant)
const CATEGORY_OUTPUT_MAP = {
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
 * Resolves a binomial name to its category by traversing the taxonomic hierarchy.
 * @param {string} binomialName - The scientific name (e.g., 'Canis familiaris').
 * @param {string} locale - The Wikipedia locale to use for QID lookup (e.g., 'en').
 * @returns {Promise<string>} - The matching category name (e.g., 'mammal', 'plant', or 'unknown').
 */
export async function assessCategoryMembership(binomialName, locale = 'en') {
  console.log(`🔍 Assessing category for: ${binomialName}`)

  // --- Step 1: Find the initial QID for the item ---
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

      // Check if the current QID matches a target category
      for (const { category: categoryName, qid: targetQID } of targetCategories) {
        if (currentQID === targetQID) {
          console.log(`✅ Found match: ${binomialName} → ${categoryName} (QID: ${targetQID})`)
          const result = CATEGORY_OUTPUT_MAP[categoryName] || categoryName
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
    console.error(`❌ Error during category assessment for ${binomialName}:`, error)
  }

  // If loop finished without finding a match
  console.log(`❓ No match found for ${binomialName}, returning 'unknown'`)
  return 'unknown'
}

// Legacy alias for backward compatibility
export const assessGroupMembership = assessCategoryMembership
