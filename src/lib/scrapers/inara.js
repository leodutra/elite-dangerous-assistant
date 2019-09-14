const got = require('got')
const qs = require('qs')
const WebPage = require('./WebPage')
const damerauLevenshtein = require('damerau-levenshtein')
const { get, camelCase, trim } = require('lodash')
const htmlToText = require('html-to-text')

function sanitizeHTML (text) {
    return htmlToText.fromString(text, {
        ignoreHref: true,
        ignoreImage: true
    })
}

function normalizeWords (text) {
    return text.trim().toLowerCase().split(/\s+/m)
}

function calculateLeven (searchWords, objectNameWords) {
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

function searchSortedByProperty (search, property, array) {
    const searchWords = normalizeWords(search)
    return array.sort((a, b) => {
        const aLeven = calculateLeven(searchWords, normalizeWords(get(a, property)))
        const bLeven = calculateLeven(searchWords, normalizeWords(get(b, property)))
        return aLeven < bLeven ? -1 : aLeven > bLeven ? +1 : 0
    })
}

class Market extends WebPage {
    $commodities = () => {
        return this.$('.maintable > table').filter((i, table) => 
                this.$(table).find('th').eq(0).text().trim() === 'Goods'
            )
            .find('> tbody > tr:not(.subheader)').map((i, tr) => {
                const $tds = this.$(tr).children()
                return {
                    name: $tds.eq(0).text().trim(),
                    id: Number($tds.children('a').attr('href').trim().replace(/.*goods\/(\d+).*/im, '$1')),
                    sell: $tds.eq(1).text().trim(),
                    buy: $tds.eq(2).text().trim(),
                    demand: $tds.eq(3).text().trim(),
                    supply: $tds.eq(4).text().trim(),
                }
            })
            .get()
    }
    
    constructor () {
        super('https://inara.cz/market')
    }

    scrapData () {
        return this.$commodities()
    }
}


class CommodityDetails extends WebPage {

    $bestSellStations = () => this.$('#commodityslotsellmax')
        .find('> table > tbody > tr')
        .map((i, tr) => {
            const $tds = this.$(tr).children()
            return {
                name: $tds.eq(0).find('> span > a > span').eq(0).text().trim(),
                systemName:  $tds.eq(0).find('> span > a > span').eq(2).text().trim(),
                pad: $tds.eq(1).text().trim(),
                stationDistance: $tds.eq(2).text().trim(),
                distance: $tds.eq(3).text().trim(),
                quantity: $tds.eq(4).text().trim(),
                price: $tds.eq(5).text().trim(),
                updatedAt: $tds.eq(6).data('order') * 1000,
            }
        })
        .get()
    
    constructor (commodityId) {
        super(`https://inara.cz/goods/${commodityId}`)
    }

    scrapData () {
        return {
            bestSellStations: this.$bestSellStations()
        }
    }
}

async function searchCommodities (name) {
    const commodities = (await new Market().load()).scrapData()
    return searchSortedByProperty(name, 'name', commodities)
}

async function fetchCommodityDetails (commodityId) {
    return (await new CommodityDetails(commodityId).load()).scrapData()
}

module.exports = {
    searchCommodities,
    fetchCommodityDetails
}

if (require.main === module) {
    (async () => {
        console.log((await fetchCommodityDetails(10250)))
    })().catch(error => {
        console.error(error)
        process.exit(1)
    })
}