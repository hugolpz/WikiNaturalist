import { biolist as defaultBiolist } from '@/data/constants'

/**
 * Fetches the user's custom biolist from Wikimedia if available
 * @returns {Promise<Array>} The biolist array (custom or default)
 */
export async function fetchBiolist() {
  try {
    // First, try to get the username from Wikimedia
    const username = await getWikimediaUsername()

    if (!username) {
      console.log('No Wikimedia username found, using default biolist')
      return defaultBiolist
    }

    console.log(`Found Wikimedia username: ${username}`)

    // Try to fetch the user's custom biolist
    const customBiolist = await fetchUserBiolist(username)

    if (customBiolist) {
      console.log('Using custom biolist from Wikimedia')
      return customBiolist
    }

    console.log('No valid custom biolist found, using default')
    return defaultBiolist
  } catch (error) {
    console.error('Error fetching biolist:', error)
    return defaultBiolist
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

    // Try to extract JSON from the wikitext
    const biolist = parseWikitextBiolist(wikitext)

    return biolist
  } catch (error) {
    console.error('Error fetching user biolist:', error)
    return null
  }
}

/**
 * Parses wikitext to extract biolist JSON
 * @param {string} wikitext - The raw wikitext content
 * @returns {Array|null} The parsed biolist or null if invalid
 */
function parseWikitextBiolist(wikitext) {
  try {
    // Try to find JSON in the wikitext
    // Look for patterns like <syntaxhighlight>...</syntaxhighlight> or <pre>...</pre>
    // or just raw JSON
    let jsonText = wikitext

    // Remove <syntaxhighlight> tags if present
    jsonText = jsonText.replace(/<syntaxhighlight[^>]*>([\s\S]*?)<\/syntaxhighlight>/gi, '$1')

    // Remove <pre> tags if present
    jsonText = jsonText.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '$1')

    // Remove <nowiki> tags if present
    jsonText = jsonText.replace(/<nowiki[^>]*>([\s\S]*?)<\/nowiki>/gi, '$1')

    // Try to find JSON array in the text
    const jsonMatch = jsonText.match(/\[\s*{[\s\S]*}\s*\]/m)

    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonText.trim())

    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.warn('Parsed biolist is not an array')
      return null
    }

    // Validate that all items have the required keys
    const isValid = parsed.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'binomial' in item &&
        typeof item.binomial === 'string',
    )

    if (!isValid) {
      console.warn('Biolist items are missing required keys (binomial)')
      return null
    }

    // Return the validated biolist
    return parsed
  } catch (error) {
    console.error('Error parsing wikitext biolist:', error)
    return null
  }
}
