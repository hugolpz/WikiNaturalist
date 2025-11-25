import { validGroups } from './assessBioGroup.js'
import { fetchWikipediaDescription } from './fetchCardData.js'

var groups = validGroups.map((g) => g.group)

/**
 * Counts the occurrences of a list of target words within a text.
 * @param {string[]} targetWords - The array of words to count (e.g., ["mammal", "bird"]).
 * @param {string} text - The text to search within.
 * @returns {object} - An object containing the most frequent word and its count, or null if no matches are found.
 */
function getMostFrequentWord(targetWords, text) {
  // 1. Normalize the text: convert to lowercase and remove punctuation
  // We replace non-word characters (except spaces) with a space, then split by whitespace.
  const normalizedText = text.toLowerCase()
  const allWords = normalizedText
    .replace(/[^a-z\s]/g, ' ') // Replace non-alphabetic/non-space with space
    .split(/\s+/) // Split by one or more whitespace characters
    .filter((word) => word.length > 0) // Remove empty strings from splitting

  // 2. Create a set of the target words for fast lookup
  const targetSet = new Set(targetWords.map((word) => word.toLowerCase()))

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
  if (mostFrequentWord) {
    return {
      word: mostFrequentWord,
      count: maxCount,
      allCounts: frequency,
    }
  } else {
    return {
      word: null,
      count: 0,
      allCounts: frequency,
    }
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

    // --- Execution ---
    const isInDescription = getMostFrequentWord(groups, mediumDescription || '').word
    const isInInfobox = getMostFrequentWord(groups, infobox || '').word
    const isInAll = getMostFrequentWord(groups, fulltext).word
    const group = isInDescription || isInInfobox || isInAll

    // --- Output ---
    const result = getMostFrequentWord(groups, fulltext)
    console.log('--- Word Occurrence Count ---')
    console.log(`Text searched for: ${groups.join(', ')}`)
    console.log('All counts:', result.allCounts)
    console.log(`Most frequent word: "${result.word}" with ${result.count} occurrence(s).`)
    console.log(`Selected group: ${group}`)

    return group
  } catch (error) {
    console.error('Error analyzing species:', error)
    return null
  }
}
