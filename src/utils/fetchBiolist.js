import { biolist as defaultBiolist } from '@/data/constants'

/**
 * Fetches the user's custom biolist from Wikimedia if available
 * @returns {Promise<Array>} The biolist array (custom places data or default biolist wrapped)
 */
export async function fetchBiolist() {
  try {
    // First, try to get the username from Wikimedia
    const username = await getWikimediaUsername()

    if (!username) {
      console.log('No Wikimedia username found, using default biolist')
      // Wrap default biolist in place format for consistency
      return [
        {
          place: 'Default Species List',
          lat: null,
          lon: null,
          list: defaultBiolist,
        },
      ]
    }

    console.log(`Found Wikimedia username: ${username}`)

    // Try to fetch the user's custom biolist (place-based format)
    const customPlacesData = await fetchUserBiolist(username)

    if (customPlacesData) {
      console.log('Using custom place-based biolist from Wikimedia')
      return customPlacesData
    }

    console.log('No valid custom biolist found, using default')
    // Wrap default biolist in place format for consistency
    return [
      {
        place: 'Default Species List',
        lat: null,
        lon: null,
        list: defaultBiolist,
      },
    ]
  } catch (error) {
    console.error('Error fetching biolist:', error)
    // Wrap default biolist in place format for consistency
    return [
      {
        place: 'Default Species List',
        lat: null,
        lon: null,
        list: defaultBiolist,
      },
    ]
  }
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
 * Fetches and parses the user's biolist from their Wikimedia user page
 * @param {string} username - The Wikimedia username
 * @returns {Promise<Array|null>} The parsed biolist or null if invalid
 */
async function fetchUserBiolist(username) {
  try {
    const pageTitle = `User:${username.replace(/"/g, '')}/GardensHavens`
    const url = `https://meta.wikimedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json&origin=*`

    const response = await fetch(url)
    const data = await response.json()

    // Check if page exists
    if (data.error || !data.parse || !data.parse.wikitext) {
      console.log(`Page ${pageTitle} does not exist`)
      return null
    }
    const wikitext = data.parse.wikitext['*']

    // Use place-based parsing format
    const placesData = parseWikitextPlaceBasedBiolist(wikitext)

    return placesData
  } catch (error) {
    console.error('Error fetching user biolist:', error)
    return null
  }
}

/**
 * Parses wikitext in place-based format to extract place-based biolist data
 * Expected format:
 * == Placename 1 ==
 * * { lat: 04.8 , lon: 86.8 }
 * * Metepeira labyrinthea
 * * Canis lupus familiaris
 *
 * == Placename 2 ==
 * * { lat: 04.8 , lon: 86.8 }
 * * Vulpes vulpes
 * * Pica pica
 *
 * @param {string} wikitext - The raw wikitext content
 * @returns {Array|null} Array of place objects with structure: { place, lat, lon, list } or null if invalid
 */
function parseWikitextPlaceBasedBiolist(wikitext) {
  try {
    const regions = []

    // Remove <syntaxhighlight>, <pre>, and <nowiki> tags if present
    let cleanText = wikitext
    // Split by == headers to get sections but preserve the matching strings
    const sections = cleanText.split(/^==\s*(.+?)\s*==$/gm)

    // Process sections (skip first empty element)
    for (let i = 1; i < sections.length; i += 2) {
      const placeName = sections[i].trim()
      const content = sections[i + 1]

      if (!content) continue

      // Extract list items (lines starting with *)
      const listItems = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('*'))
        .map((line) => line.substring(1).trim())
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
        // Species list starts from second item
        itemList = listItems.slice(1)
      } else {
        // No coordinates found, treat all items as species
        itemList = listItems
      }

      // Convert species list to biolist format
      const biolist = itemList
        .filter((species) => species.length > 0)
        .map((species) => ({
          binomial: species.trim(),
        }))

      // Only add place if it has species
      if (biolist.length > 0) {
        regions.push({
          place: placeName,
          lat: lat,
          lon: lon,
          list: biolist,
        })
      }
    }

    return regions.length > 0 ? regions : null
  } catch (error) {
    console.error('Error parsing place-based wikitext biolist:', error)
    return null
  }
}

// Export the place-based parser for potential standalone use
export { parseWikitextPlaceBasedBiolist }
