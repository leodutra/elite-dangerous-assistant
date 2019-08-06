
const got = require('got')
const qs = require('qs')
const WebPage = require('./WebPage')
const damerauLevenshtein = require('damerau-levenshtein')
const { get, camelCase, trim } = require('lodash')
const htmlToText = require('html-to-text')

function sanitizeHTML(text) {
    return htmlToText.fromString(text, {
        ignoreHref: true,
        ignoreImage: true
    })
}

function searchSortedByProperty(search, property, array) {
    const searchWords = normalizeWords(search)
    return array.sort((a, b) => {
        const aLeven = calculateLeven(searchWords, normalizeWords(get(a, property)))
        const bLeven = calculateLeven(searchWords, normalizeWords(get(b, property)))
        return aLeven < bLeven ? -1 : aLeven > bLeven ? +1 : 0
    })
}

function calculateLeven(searchWords, objectNameWords) {
    let total = 0
    for (let i = 0, l = searchWords.length; i < l; i++) {
        let min = Infinity
        for (let j = 0, m = objectNameWords.length; j < m; j++) {
            min = Math.min(
                min, 
                damerauLevenshtein(searchWords[i], objectNameWords[j]).relative 
                    + ( j * 0.01 )
            )
        }
        total += min
    }
    return total
}

function normalizeWords(text) {
    return text.trim().toLowerCase().split(/\s+/m)
}

function $textNodes($) {
    return $.contents().filter((i, el) => el.nodeType === 3)
}

async function fetch(url, opts) {
    return (await got(url, { json: true, ...opts })).body
}

async function searchBodies(name, systemName) {
    const query = {
        body: {
            name, 
            systemName
        },
        _: Date.now()
    }
    const results = await fetch('http://eddb.io/body/search?' + qs.stringify(query))
    if (systemName) {
        return searchSortedByProperty(systemName, 'systemName', results)
    }
    return results
}

async function searchStations(name, systemName) {
    const query = {
        station: {
            name,
            systemName
        },
        expand: 'system',
        _: Date.now()
    }
    const results = await fetch('http://eddb.io/station/search?' + qs.stringify(query))
    if (systemName) {
        return searchSortedByProperty(systemName, 'system.name', results)
    }
    return results
}

async function searchSystems(systemName) {
    const query = {
        system: {
            name: systemName,
            version: 2
        },
        expand: 'stations',
        _: Date.now()
    }
    return fetch('http://eddb.io/system/search?' + qs.stringify(query))
}

async function fetchSystemDetails(systemName) {
    const systems = await searchSystems(systemName)
    return (await new SystemDetails(systems[0].id).load()).scrapData()
}

async function fetchBodyDetails(bodyName, systemName) {
    const bodies = await searchBodies(bodyName, systemName)
    return (await new BodyDetails(bodies[0].id).load()).scrapData()
}

async function fetchStationDetails(stationName, systemName) {
    const stations = await searchStations(stationName, systemName)
    return (await new StationDetails(stations[0].id).load()).scrapData()
}

class SystemDetails extends WebPage {

    $name = () => $textNodes(this.$('.page-header > h1')).text().trim()
    $type = () => $textNodes(this.$('.page-header > h1 > .prefix')).text().trim()
    $properties = () => {
        const results = {}
        for (const el of this.$('.panel-body .label-name')) {
            const $property = this.$(el)
            results[camelCase($property.text().trim())] = 
                sanitizeHTML($property.next('.label-value').html()).trim()
        }
        return results
    }
    $stations = () => $('.stationTypeGroup')
        .parent()
        .find('> tr:not(".stationTypeGroup") > td')
        .map((i, el) => {
            const $station = this.$(el)
            const textNodes = $textNodes($station)
            return {
                name: $station.find('> strong > a').text(),
                sizeAndDistance: textNodes.text().trim().replace(/\s+/m, ' ')
            }
        }).get()
    
    constructor (systemId) {
        super(`https://eddb.io/system/${systemId}`)
    }

    scrapData () {
        return {
            ...this.$properties(),
            name: this.$name(),
            type: this.$type(),
            stations: this.$stations()
        }
    }
}

class BodyDetails extends WebPage {

    $name = () => $textNodes(this.$('.page-header > h1')).text().trim()
    $type = () => $textNodes(this.$('.page-header > h1 > .prefix')).text().trim()
    $properties = () => {
        const results = {}
        for (const el of this.$('.panel-body .body-property-label').get()) {
            const $property = this.$(el)
            results[camelCase($property.text().trim())] = 
                sanitizeHTML($property.next('.body-property-value').html()).trim()
        }
        return results
    }

    $isScoopable = () => 
        this.$('.page-header > h1').text().trim().toLowerCase().includes('scoopable')

    $stations = () => this.$('.stationTypeGroup')
        .parent()
        .find('> tr:not(".stationTypeGroup") > td')
        .map((i, el) => {
            const $station = this.$(el)
            const textNodes = $textNodes($station)
            return {
                name: $station.find('> strong > a').text(),
                sizeAndDistance: textNodes.text().trim().replace(/\s+/m, ' ')
            }
        }).get()

    $materials = () => this.$('.material-outer').map((i, el) => {
            const $material = this.$(el)
            const probability = () => {
                const matches = $material.text().match(/\(([^%]+?%)\)/m)
                return matches ? matches[1] : null
            }
            return {
                name: el.title,
                probability: probability(),
                rarity: this.$rarity($material)
            }
        }).get()

    $rarity = $material => {
        const rarityClasses = {
            'material-rarity-group-10': 'Very common',
            'material-rarity-group-20': 'Common',
            'material-rarity-group-30': 'Standard',
            'material-rarity-group-40': 'Rare',
            'material-rarity-group-50': 'Very rare'
        }
        return $material.get(0).classList.find(class_ => rarityClasses[class_])
    }    
    
    constructor (bodyId) {
        super(`https://eddb.io/body/${bodyId}`)
    }

    scrapData () {
        const properties = this.$properties()
        return {
            ...properties,
            name: this.$name(),
            type: this.$type(),
            stations: this.$stations(),
            materials: this.$materials(),
            isScoopable: this.$isScoopable(),
            system: trim(properties.system).replace(/\s+-\s+all\s+bodies.*/im, '')
        }
    }
}

class StationDetails extends WebPage {
    $name = () => $textNodes(this.$('.page-header > h1')).text().trim()
    $type = () => $textNodes(this.$('.page-header > h1 > .prefix')).text().trim()
    $properties = () => {
        const results = {}
        for (const el of this.$('.panel-body .label-name')) {
            const $property = this.$(el)
            results[camelCase($property.text().trim())] = 
                sanitizeHTML($property.next('.label-value').html()).trim()
        }
        return results
    }
    $facilities = () => {
        const facilities = {}
        for (const el of this.$('.facilities > .facility').get()) {
            const $facility = this.$(el)
            facilities[camelCase($facility.text().trim())] = $facility.hasClass('yes')
        }
        return facilities
    }

    $description = () => this.$('.body-description').text().trim()

    constructor (stationId) {
        super(`https://eddb.io/station/${stationId}`)
    }

    scrapData () {
        const properties = this.$properties()
        return {
            ...properties,
            name: this.$name(),
            type: this.$type(),
            isScoopable: this.$isScoopable(),
            facilities: this.$facilities(),
            description: this.$description(),
            system: trim(properties.system).replace(/\s+-s+all\s+bodies/im, '')
        }
    }
}

module.exports = {
    searchSystems,
    searchBodies,
    searchStations,
    fetchSystemDetails,
    fetchBodyDetails,
    fetchStationDetails
}

if (require.main === module) {
    (async () => {
        try {
            const bodies = await fetchBodyDetails('Gungnir 6 D', 'Gungn')
            console.log(bodies)
        }
        catch(error) {
            console.error(error)
            process.exit(1)
        }
    })()
}