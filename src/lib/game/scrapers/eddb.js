
const got = require('got')
const queryString = require('query-string')
const WebPage = require('./WebPage')

async function searchBody(bodyName) {
    const query = queryString.stringify(
        { body: { name: bodyName } },
        { arrayFormat: 'bracket' }
    )
    console.log('searchBody() - query:', query)
    return (await got(
        'https://eddb.io/body/search',
        {
            query
        }
    )).body
}

async function searchStation(stationName) {
    const query = queryString.stringify(
        { body: { name: stationName } },
        { arrayFormat: 'bracket' }
    )
    console.log('searchStation() - query:', query)
    return (await got(
        'https://eddb.io/station/search',
        {
            query
        }
    )).body
}

async function fetchBodyDetails(bodyName) {
    const bodies = await searchBody(bodyName)
    return new BodyDetails(bodies[0].id).scrapData()
}

async function fetchStationDetails(stationName) {
    const stations = await searchStation(stationName)
    return new StationDetails(stations[0].id).scrapData()
}

class BodyDetails extends WebPage {

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
    $isLandable = () => 
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
        return this.$materials.map((i, el) => {
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
    $isLandable = () => 
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
        return this.$materials.map((i, el) => {
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

module.exports = {
    searchBody,
    searchStation,
    fetchBodyDetails,
    fetchStationDetails
}
