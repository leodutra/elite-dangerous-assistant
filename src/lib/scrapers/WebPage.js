const got = require('got')
const cheerio = require('cheerio')
const { decodeHTMLEntities, replaceHTMLTags } = require('node-utils')

class WebPage {
    constructor (url, { cookieJar, form } = {}) {
        this.url = new URL(url)
        this.cookieJar = cookieJar
        this.form = form
    }

    static sanitizeHTMLText (text) {
        return typeof text === 'string'
            ? replaceHTMLTags(decodeHTMLEntities(text))
                .split(/\r?\n/m)
                .map(x => x
                    .trim()
                    .replace(/(\s)+/gim, '\u0020')
                )
                .join('\n')
                .replace(/(\r?\n)+/gm, '$1')
                .trim()
            : text
    }

    sanitizeHTMLText (text) { return WebPage.sanitizeHTMLText(text) }

    sanitizeBackgroundURLCSS (cssText) {
        return typeof cssText === 'string'
            ? cssText.replace(/\burl\(['"]?([^)]+?)['"]?\)/, '$1')
            : cssText
    }

    async load (relativeUrl) {
        const url = new URL(relativeUrl || '', this.url)
        this._cheerio = cheerio.load(
            (await got(url, {
                cookieJar: this.cookieJar,
                method: this.form ? 'POST' : 'GET',
                body: this.form,
                form: !!this.form
            })).body
        )
        return this
    }

    get $ () {
        if (this._cheerio) {
            return this._cheerio
        }
        throw new Error(
            `You need to ${this.load.name}() the <${WebPage.name}> before any query.`
        )
    }

    relativeURL (url) {
        return new URL(url, this.url).toString()
    }
}

module.exports = WebPage
