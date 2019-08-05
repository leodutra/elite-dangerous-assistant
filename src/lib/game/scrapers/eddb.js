
const got = require('got')
const qs = require('qs')
const WebPage = require('./WebPage')
const damerauLevenshtein = require('damerau-levenshtein')
const { get, camelCase } = require('lodash')

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
    return $.contents().filter(() => this.nodeType === Node.TEXT_NODE)
}

async function searchBodies(name, systemName) {
    const query = {
        body: {
            name, 
            systemName
        },
        _: Date.now()
    }
    const results =  (await got(
        'http://eddb.io/body/search?' + qs.stringify(query), 
        { json: true }
    )).body
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
    const results = (await got(
        'http://eddb.io/station/search?' + qs.stringify(query), 
        { json: true }
    )).body
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
    return (await got(
        'http://eddb.io/system/search?' + qs.stringify(query), 
        { json: true }
    )).body
}

async function fetchSystemDetails(systemName) {
    const systems = await searchSystem(systemName)
    return (await new SystemDetails(systems[0].id).load()).scrapData()
}

async function fetchBodyDetails(bodyName, systemName) {
    const bodies = await searchBody(bodyName, systemName)
    return (await new BodyDetails(bodies[0].id).load()).scrapData()
}

async function fetchStationDetails(stationName, systemName) {
    const stations = await searchStation(stationName, systemName)
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
                $property.next('.label-value').text().trim()
        }
        return results
    }
    
    constructor (systemId) {
        super(`https://eddb.io/system/${systemId}`)
    }

    scrapData () {
        return {
            ...this.$properties(),
            name: this.$name(),
            type: this.$type()
        }
    }
}

class BodyDetails extends WebPage {

    $name = () => $textNodes(this.$('.page-header > h1')).text().trim()
    $type = () => $textNodes(this.$('.page-header > h1 > .prefix')).text().trim()
    $properties = () => {
        const results = {}
        for (const el of this.$('.panel-body .label-name')) {
            const $property = this.$(el)
            results[camelCase($property.text().trim())] = 
                $property.next('.label-value').text().trim()
        }
        return results
    }
    
    constructor (bodyId) {
        super(`https://eddb.io/body/${bodyId}`)
    }

    scrapData () {
        return {
            ...this.$properties(),
            name: this.$name(),
            type: this.$type()
        }
    }



    $bodyName = () => this.$('.page-header > h1').text().trim()
    $property = property => {
        property = property.trim().toLowerCase()
        this.$('.body-property-label').filter(
            (i, el) => $(el)
                .text()
                .trim()
                .toLowerCase()
                .indexOf(property) !== -1
            )
            .next('.body-property-value')
            .text()
            .trim()
    }
    $stations = () => this.$property('stations')
    // $isLandable = () => 
    $materials = () => this.$('.material-inner')
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
        return this.$materials().map((i, el) => {
            const $materials = this.$(el)
            const [_, name, probability] = $materials
                .text()
                .match(/([^(]+)(?:\(([^)]+)\))?/im)
            return {
                name,
                probability,
                rarity: this.$rarity($materials)
            }
        }).get()
    }
}

class StationDetails extends WebPage {

    $bodyName = () => this.$('.page-header > h1').text().trim()
    $bodyType = () => this.$('.page-header > h1 > prefix').text().trim()
    $isScoopable = () => 
        this.$('.page-header > h1').text().trim().toLowerCase().indexOf('scoopable') !== -1
    $property = property => {
        property = property.trim().toLowerCase()
        this.$('.label-name').filter(
            (i, el) => $(el)
                .text()
                .trim()
                .toLowerCase()
                .indexOf(property) !== -1
            )
            .next('.label-value')
            .text()
            .trim()
    }
    $facilities = () => this.$('.facilities > .facility.yes')

    constructor (stationId) {
        super(`https://eddb.io/station/${stationId}`)
    }

    scrapData () {
        return this.$materials.map((i, el) => {
            const $materials = this.$(el)
            const [_, name, probability] = $materials
                .text()
                .match(/([^(]+)(?:\(([^)]+)\))?/im)
            return {
                name,
                probability,
                facilities: this.$facilities()
            }
        }).get()
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
            const bodies = await searchBodies('Gungnir 6 D', 'Gungn')
            console.log(bodies)
        }
        catch(error) {
            console.error(error)
            process.exit(1)
        }
    })()
}