import { validGroups } from './assessBioGroup.js'
import { fetchWikipediaDescription } from './fetchCardData.js'

var groups = validGroups.map((g) => g.group)

/**
 * Searches for phylogeny terms in infobox with full word matching
 * @param {string} infobox - The infobox text to search within
 * @returns {string|null} - The first matched phylogeny term or null if none found
 */
function findPhylogenyInInfobox(infobox) {
  if (!infobox) return null

  // Get all phylogeny terms from validGroups
  const phylogenies = validGroups.map((g) => g.phylogeny)

  // Search for each phylogeny term with full word matching
  for (const phylogeny of phylogenies) {
    // Use word boundaries for exact word matching, case insensitive
    const regex = new RegExp(`\\b${phylogeny}\\b`, 'i')

    if (regex.test(infobox)) {
      console.log(`Found phylogeny "${phylogeny}" in infobox (full word match)`)
      return phylogeny
    }
  }

  return null
}

/**
 * Counts the occurrences of a list of target words within a text.
 * @param {string[]} targetWords - The array of words to count (e.g., ["mammal", "bird"]).
 * @param {string} text - The text to search within.
 * @param {boolean} caseSensitive - Whether to perform case-sensitive search (default: false).
 * @returns {object} - An object containing the most frequent word and its count, or null if no matches are found.
 */
function getMostFrequentWord(targetWords, text, caseSensitive = false) {
  if (!text) return { word: null, count: 0, allCounts: {} }

  // 1. Normalize the text based on case sensitivity
  const normalizedText = caseSensitive ? text : text.toLowerCase()
  const normalizedTargets = caseSensitive
    ? targetWords
    : targetWords.map((word) => word.toLowerCase())

  const allWords = normalizedText
    .replace(/[^a-zA-Z\s]/g, ' ') // Replace non-alphabetic/non-space with space
    .split(/\s+/) // Split by one or more whitespace characters
    .filter((word) => word.length > 0) // Remove empty strings from splitting

  // 2. Create a set of the target words for fast lookup
  const targetSet = new Set(normalizedTargets)

  // 3. Initialize a frequency map
  const frequency = {}
  let maxCount = 0
  let mostFrequentWord = null

  // 4. Iterate through all words in the text and count target words
  for (const word of allWords) {
    if (targetSet.has(word)) {
      // Increment the count for the matched word
      frequency[word] = (frequency[word] || 0) + 1

      // 5. Check if this word is the new most frequent
      if (frequency[word] > maxCount) {
        maxCount = frequency[word]
        mostFrequentWord = word
      }
    }
  }

  // 6. Return the result
  return {
    word: mostFrequentWord,
    count: maxCount,
    allCounts: frequency,
  }
}

// --- Input Data ---
export async function assessGroupMembershipWP(binomialName, locale = 'en') {
  try {
    const wikipediaData = await fetchWikipediaDescription(binomialName, locale)

    // Handle case where Wikipedia data is not available
    if (!wikipediaData) {
      console.log(`No Wikipedia data available for ${binomialName}`)
      return 'unknown'
    }

    const { mediumDescription, firstParagraph, infobox } = wikipediaData
    const fulltext = [mediumDescription, firstParagraph, infobox].filter(Boolean).join(' ')

    console.log(`--- Analyzing ${binomialName} ---`)

    // Step 1: Look for phylogeny terms in infobox with full word matching
    const foundPhylogeny = findPhylogenyInInfobox(infobox)

    if (foundPhylogeny) {
      // Find the group that matches this phylogeny
      const matchedGroup = validGroups.find(
        (g) => g.phylogeny.toLowerCase() === foundPhylogeny.toLowerCase(),
      )

      if (matchedGroup) {
        console.log(`Matched phylogeny "${foundPhylogeny}" to group: ${matchedGroup.group}`)

        // Step 2: If it's Plantae, do secondary search for tree/grass
        if (matchedGroup.group === 'plant') {
          console.log('Detected Plantae - searching for specific plant types...')

          const plantSpecificGroups = ['tree', 'grass']
          const plantResult = getMostFrequentWord(plantSpecificGroups, fulltext, false)

          if (plantResult.word) {
            console.log(
              `Found specific plant type: "${plantResult.word}" (${plantResult.count} occurrences)`,
            )
            return plantResult.word
          } else {
            console.log('No specific plant type found, defaulting to "plant"')
            return 'plant'
          }
        } else {
          // Return the matched group directly
          return matchedGroup.group
        }
      }
    }

    // Step 3: Fallback to original group-based search in full text
    console.log('No phylogeny found in infobox, falling back to group search in full text')
    const groupResult = getMostFrequentWord(groups, fulltext, false)

    if (groupResult.word) {
      console.log(
        `Found group "${groupResult.word}" in full text (${groupResult.count} occurrences)`,
      )
      return groupResult.word
    }

    // Step 4: Final fallback
    console.log('No groups found, defaulting to "unknown"')
    return 'unknown'
  } catch (error) {
    console.error('Error analyzing species:', error)
    return 'unknown'
  }
}
