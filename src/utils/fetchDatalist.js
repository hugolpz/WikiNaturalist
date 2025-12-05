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
 * Fetches the user's custom datalist from Wikimedia if available
 * @returns {Promise<Array>} The datalist array (custom collections data or default datalist wrapped)
 */
export async function fetchDatalist() {
  try {
    // First, try to get the username from Wikimedia
    const username = await getWikimediaUsername()

    if (!username) {
      console.log('No Wikimedia username found, using default datalist')
      return parseWikitextDatalist(defaultDatalist)
    }

    console.log(`Found Wikimedia username: ${username}`)

    // Try to fetch the user's custom datalist (collection-based format)
    const customcollectionsData = await fetchUserDatalist(username)

    if (customcollectionsData) {
      console.log('Using custom collection-based datalist from Wikimedia')
      return customcollectionsData
    }

    console.log('No valid custom datalist found, using default')
  } catch (error) {
    console.error('Error fetching datalist:', error)
  }

  // Fallback to default datalist (used for both no custom data and errors)
  return parseWikitextDatalist(defaultDatalist)
}

/**
 * Gets the current Wikimedia username if logged in
 * Since CORS requests don't include auth cookies, we'll assume anonymous
 * and allow users to manually specify their username in localStorage
 * @returns {Promise<string|null>} The username or null
 */
async function getWikimediaUsername() {
  try {
    // Check if user has manually set their username in localStorage
    const manualUsername = localStorage.getItem('wikimedia-username')
    if (manualUsername) {
      console.log(`Using manually set username: ${manualUsername}`)
      return manualUsername
    }

    // Try the API call (will likely return anonymous due to CORS)
    const url =
      'https://meta.wikimedia.org/w/api.php?action=query&meta=userinfo&format=json&origin=*'

    const response = await fetch(url)
    const data = await response.json()

    if (data.query && data.query.userinfo) {
      const userinfo = data.query.userinfo
      // Check if user is logged in (anon users have 'anon' flag or IP address as name)
      if (userinfo.anon === undefined && userinfo.name && !isIPAddress(userinfo.name)) {
        return userinfo.name
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching Wikimedia username:', error)
    return null
  }
}

/**
 * Check if a string looks like an IP address
 */
function isIPAddress(str) {
  // Simple check for IPv4 and IPv6 patterns
  const ipv4Pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  const ipv6Pattern = /^[0-9a-fA-F:]+$/
  return ipv4Pattern.test(str) || ipv6Pattern.test(str)
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
 * Fetches and parses the user's datalist from their Wikimedia user page
 * @param {string} username - The Wikimedia username
 * @returns {Promise<Array|null>} The parsed datalist or null if invalid
 */
async function fetchUserDatalist(username) {
  try {
    const pageTitle = `User:${username.replace(/"/g, '')}/WikiNaturalist`
    const url = `https://meta.wikimedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json&origin=*`

    const response = await fetch(url)
    const data = await response.json()

    // Check if page exists
    if (data.error || !data.parse || !data.parse.wikitext) {
      console.log(`Page ${pageTitle} does not exist`)
      return null
    }
    const wikitext = data.parse.wikitext['*']
    const filteredLines = wikitextFilter(wikitext)
    const listsData = parseWikitextDatalist(filteredLines)

    return listsData
  } catch (error) {
    console.error('Error fetching user datalist:', error)
    return null
  }
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
