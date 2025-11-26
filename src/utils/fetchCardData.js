/**
 * Fetches item data from Wikidata and Wikipedia
 * @param {string} binomialName - The binomial name of the item
 * @param {string} locale - The language code (en, fr, es, zh)
 * @returns {Promise<Object>} Item data including taxon name, images, and descriptions
 */
import { assessCategoryMembershipWP } from './assessCategoryNLP.js'

export async function fetchCardData(binomialName, locale = 'en') {
  try {
    // Clean binomial name (remove parenthetical notes)
    const cleanName = binomialName.replace(/\s*\([^)]*\)/, '').trim()

    // Fetch data from Wikidata
    const wikidataData = await fetchWikidataInfo(cleanName, locale)

    // Fetch long description from Wikipedia
    const wikipediaData = await fetchWikipediaDescription(cleanName, locale)

    // Assess the category
    const assessedCategory = await assessCategoryMembershipWP(cleanName, 'en')

    return {
      binomialName: cleanName,
      taxonName: wikidataData.taxonName || cleanName,
      commonName: wikidataData.commonName || null,
      image: wikidataData.image || null,
      rangeMap: wikidataData.rangeMap || null,
      shortDescription: wikidataData.description || null,
      mediumDescription: wikipediaData?.mediumDescription || null,
      longDescription: wikipediaData?.firstParagraph || null,
      infobox: wikipediaData?.infobox || null,
      wikidataId: wikidataData.id || null,
      assessedGroup: assessedCategory, // Add the assessed category
    }
  } catch (error) {
    console.error(`Error fetching data for ${binomialName}:`, error)
    return {
      binomialName,
      taxonName: binomialName,
      commonName: null,
      image: null,
      rangeMap: null,
      shortDescription: null,
      mediumDescription: null,
      longDescription: null,
      infobox: null,
      wikidataId: null,
      assessedGroup: 'unknown', // Default fallback
    }
  }
}

/**
 * Fetches Wikidata information for an item
 */
async function fetchWikidataInfo(binomialName, locale = 'en') {
  try {
    // Search for the entity by taxon name (P225)
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(binomialName)}&language=${locale}&format=json&origin=*`

    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (!searchData.search || searchData.search.length === 0) {
      return {
        taxonName: binomialName,
        commonName: null,
        image: null,
        rangeMap: null,
        description: null,
      }
    }

    const entityId = searchData.search[0].id
    const shortDescription = searchData.search[0].description || null

    // Get entity data with claims
    const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims|labels&languages=${locale}&format=json&origin=*`

    const entityResponse = await fetch(entityUrl)
    const entityData = await entityResponse.json()

    const entity = entityData.entities[entityId]
    const claims = entity.claims || {}

    // P225: Taxon name
    const taxonName =
      claims.P225 && claims.P225[0] ? claims.P225[0].mainsnak.datavalue.value : binomialName

    // P18: Image
    let image = null
    if (claims.P18 && claims.P18[0]) {
      const imageFilename = claims.P18[0].mainsnak.datavalue.value
      image = getCommonsImageUrl(imageFilename)
    }

    // P181: Taxon range map
    let rangeMap = null
    if (claims.P181 && claims.P181[0]) {
      const rangeFilename = claims.P181[0].mainsnak.datavalue.value
      rangeMap = getCommonsImageUrl(rangeFilename)
    }

    // P1843: Taxon common name
    let commonName = null
    if (claims.P1843 && claims.P1843.length > 0) {
      // Find common name in the requested locale
      const commonNameClaim = claims.P1843.find(
        (claim) =>
          claim.mainsnak &&
          claim.mainsnak.datavalue &&
          claim.mainsnak.datavalue.value &&
          claim.mainsnak.datavalue.value.language === locale,
      )

      if (commonNameClaim) {
        commonName = commonNameClaim.mainsnak.datavalue.value.text
      } else if (claims.P1843[0].mainsnak && claims.P1843[0].mainsnak.datavalue) {
        // Fallback to first available common name if locale-specific not found
        commonName = claims.P1843[0].mainsnak.datavalue.value.text
      }
    }

    return {
      id: entityId,
      taxonName,
      commonName,
      image,
      rangeMap,
      description: shortDescription,
    }
  } catch (error) {
    console.error('Error fetching Wikidata info:', error)
    return {
      taxonName: binomialName,
      commonName: null,
      image: null,
      rangeMap: null,
      description: null,
    }
  }
}

/**
 * Converts Wikimedia Commons filename to URL
 */
function getCommonsImageUrl(filename) {
  const normalizedFilename = filename.replace(/ /g, '_')
  // Use Wikimedia Commons thumbnail service (width=400px)
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(normalizedFilename)}?width=400`
}

/**
 * Edits href attributes in DOM elements that match a pattern
 * @param {Element} element - The DOM element to search within
 * @param {RegExp} match - The regex pattern to match against href values
 * @param {string} replacement - The replacement string for matching hrefs
 */
function editHrefs(element, match, replacement) {
  if (!element) return

  const links = element.querySelectorAll('a[href]')
  links.forEach((link) => {
    const href = link.getAttribute('href')
    if (href && match.test(href)) {
      link.setAttribute('href', href.replace(match, replacement))
    }
  })
}

/**
 * Fetches Wikipedia article introduction with HTML formatting
 */
export async function fetchWikipediaDescription(binomialName, locale = 'en') {
  try {
    const url = `https://${locale}.wikipedia.org/api/rest_v1/page/mobile-html/${encodeURIComponent(binomialName)}`

    const response = await fetch(url)
    if (!response.ok) {
      return null
    }

    const html = await response.text()

    // Parse HTML and extract first paragraph
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    // Remove .noexcerpt elements
    const toRemove = doc.querySelectorAll('.noexcerpt, .mw-empty-elt')
    toRemove.forEach((element) => element.remove())
    const mediumDescription =
      doc.querySelector('#pcs-edit-section-title-description')?.textContent ?? ''
    const introduction = doc.querySelector('[data-mw-section-id="0"]')

    // Fix relative links in the introduction section
    editHrefs(introduction, /^\.\//, `https://${locale}.wikipedia.org/wiki/`)

    const firstParagraph = introduction?.querySelector('.mw-parser-output section > p')?.innerHTML,
      infobox = introduction?.querySelector('.infobox')?.textContent?.trim() ?? ''

    return {
      mediumDescription,
      firstParagraph,
      infobox,
    }
  } catch (error) {
    console.error('Error fetching Wikipedia description:', error)
    return null
  }
}
