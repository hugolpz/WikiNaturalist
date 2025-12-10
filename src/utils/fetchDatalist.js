import { useSettingsStore } from '@/stores/settings'

const defaultDatalist = `
== Spain ==
# { lat: 43.0, lon: 1.17 }
# Quercus robur
# Erinaceus europaeus
# Pica pica
# Podarcis muralis
# Hyla arborea

== Indonesia ==
# { lat: 0.27, lon: 115.03 }
# Polypedates otilophus
# Draco quinquefasciatus
# Pongo pygmaeus
# Helarctos malayanus
# Neofelis diardi
# Tragulus kanchil
# Hylobates muelleri
# Hydrornis baudii
# Hydrornis schwaneri
# Trogonoptera brookiana
`

/**
 * Fetches the user's custom datalist from Wikimedia if available, or returns default
 * This function consolidates the logic for checking existence and fetching data
 * @param {string} username - Optional username to fetch datalist for. If not provided, uses settings store
 * @returns {Promise<Array>} The datalist array
 */
export async function fetchDatalist(username = null) {
  const settings = useSettingsStore()

  // Determine which username to use
  const targetUsername = username || settings.wikimediaUsername

  // If no username, use default datalist from WikiNaturalist/Preload
  if (!targetUsername || targetUsername.trim() === '') {
    console.log('No Wikimedia username found, using default datalist from WikiNaturalist/Preload')
    settings.setHasDatalist(false)
    return parseWikitextDatalist(defaultDatalist)
  }

  console.log(`Fetching datalist for username: ${targetUsername}`)

  try {
    const pageTitle = `User:${targetUsername.replace(/"/g, '')}/WikiNaturalist`

    // Use query API to check existence and get wikitext in one call
    const url = `https://meta.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=revisions&rvprop=content&rvslots=main&format=json&origin=*`

    const response = await fetch(url)
    const data = await response.json()

    // Check if page exists
    const page = Object.values(data.query.pages)[0]
    const pageExists = !page.missing && !page.invalid

    // Update hasDatalist state
    settings.setHasDatalist(pageExists)

    if (!pageExists) {
      console.log(`Page ${pageTitle} does not exist, using default datalist`)
      return parseWikitextDatalist(defaultDatalist)
    }

    // Extract wikitext content
    const wikitext = page.revisions[0].slots.main['*']
    const filteredLines = wikitextFilter(wikitext)
    const listsData = parseWikitextDatalist(filteredLines)

    if (listsData && listsData.length > 0) {
      console.log('Using custom collection-based datalist from Wikimedia')
      return listsData
    }

    console.log('Custom datalist is empty, using default')
    return parseWikitextDatalist(defaultDatalist)
  } catch (error) {
    console.error('Error fetching datalist:', error)
    settings.setHasDatalist(false)
    return parseWikitextDatalist(defaultDatalist)
  }
}

/**
 * Check if a wiki page exists on Meta Wikimedia
 * This function is now a convenience wrapper that uses the settings store
 * @param {string} pageTitle - The full page title (e.g., "User:Username/WikiNaturalist")
 * @returns {Promise<boolean>} True if page exists, false otherwise
 */
export async function checkWikipageExists(pageTitle) {
  const settings = useSettingsStore()

  try {
    const url = `https://meta.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`

    const response = await fetch(url)
    const data = await response.json()

    // Page exists if it's not marked as "missing"
    const page = Object.values(data.query.pages)[0]
    const exists = !page.missing

    // Update state if checking current user's WikiNaturalist page
    const currentUserPage = `User:${settings.wikimediaUsername}/WikiNaturalist`
    if (pageTitle === currentUserPage) {
      settings.setHasDatalist(exists)
    }

    return exists
  } catch (error) {
    console.error('Error checking page existence:', error)
    return false
  }
}

/**
 * Filters wikitext to only keep lines starting with =, *, or #
 * @param {string} wikitext - The raw wikitext content
 * @returns {string} Filtered wikitext with only relevant lines
 */
function wikitextFilter(wikitext) {
  return wikitext
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      return trimmed.startsWith('=') || trimmed.startsWith('*') || trimmed.startsWith('#')
    })
    .join('\n')
}

/**
 * Parses wikitext in collection-based format to extract collection-based datalist data
 * Expected format:
 * == collection Name 1 ==
 * * { lat: 04.8 , lon: 86.8 }
 * * Metepeira labyrinthea
 * * Canis lupus familiaris
 *
 * == collection Name 2 ==
 * * { lat: 04.8 , lon: 86.8 }
 * * Vulpes vulpes
 * * Pica pica
 *
 * @param {string} wikitext - The raw wikitext content
 * @returns {Array|null} Array of collection objects with structure: { collection, lat, lon, list } or null if invalid
 */
function parseWikitextDatalist(wikitext) {
  try {
    const lists = []

    // Split by == headers to get sections but preserve the matching strings
    const sections = wikitext.split(/^==+\s*(.+?)\s*==+$/gm)

    // Process sections (skip first empty element)
    for (let i = 1; i < sections.length; i += 2) {
      const collectionName = sections[i].trim()
      const content = sections[i + 1]

      if (!content) continue

      // Extract list items (lines starting with *)
      const listItems = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('*') || line.startsWith('#'))
        .map((line) => line.substring(1).trim()) // remove leading '*'
        .filter((line) => line.length > 0)

      if (listItems.length === 0) continue

      // First item should be coordinates in format { lat: X, lon: Y }
      const coordItem = listItems[0]
      let lat = null
      let lon = null
      let itemList = []

      // Try to parse coordinates from first item
      const coordMatch = coordItem.match(
        /\{\s*lat\s*:\s*([0-9.-]+)\s*,\s*lon\s*:\s*([0-9.-]+)\s*\}/,
      )
      if (coordMatch) {
        lat = parseFloat(coordMatch[1])
        lon = parseFloat(coordMatch[2])
        // Item list starts from second item
        itemList = listItems.slice(1)
      } else {
        // No coordinates found, treat all items as entries
        itemList = listItems
      }

      // Convert item list to datalist format
      const datalist = itemList
        .filter((item) => item.length > 0)
        .map((item) => ({
          binomial: item.trim(),
        }))

      // Only add collection if it has items
      if (datalist.length > 0) {
        lists.push({
          collectionTitle: collectionName,
          lat: lat,
          lon: lon,
          list: datalist,
        })
      }
    }

    return lists.length > 0 ? lists : null
  } catch (error) {
    console.error('Error parsing collection-based wikitext datalist:', error)
    return null
  }
}

// Export the collection-based parser and wikitext filter for potential standalone use
export { parseWikitextDatalist, wikitextFilter }
