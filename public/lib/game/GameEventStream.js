const { Tail } = require('tail')
const { Readable } = require('stream')

const fs = require('fs')
const path = require('path')

const TAIL_OPTIONS = {
    fromBeginning: true,
    flushAtEOF: true
}

module.exports = class GameEventStream extends Readable {
    constructor (journalPath) {
        super({ objectMode: true })
        this.journalPath = journalPath
    }

    _read (size) {
        if (this.tail == null) {
            const journalFiles = this._listJournalFiles(this.journalPath)
            if (journalFiles.length > 1) {
                for (let i = 0; i < journalFiles.length - 1; i++) {
                    console.log(path.resolve(this.journalPath, journalFiles[i]))
                    fs.readFileSync(
                        path.resolve(this.journalPath, journalFiles[i]),
                        { encoding: 'utf8' }
                    )
                        .split(/\r?\n/m)
                        .forEach(line => {
                            if ((line = line.trim())) {
                                this.push(JSON.parse(line))
                            } else {
                                console.log('Ignoring journal line:', line)
                            }
                        })
                }
            }
            this.tail = new Tail(
                path.resolve(this.journalPath, journalFiles[journalFiles.length - 1]),
                TAIL_OPTIONS
            )
            this.tail.on('line', line => {
                if ((line = line.trim())) {
                    this.push(JSON.parse(line))
                } else {
                    console.log('Ignoring journal line:', line)
                }
            })
            this.tail.on('error', error =>
                process.nextTick(() => this.emit('error', error))
            )
        }
        this.tail.watch()
    }

    _listJournalFiles (journalPath) {
        return fs.readdirSync(journalPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile() && dirent.name.startsWith('Journal.'))
            .map(dirent => dirent.name)
            .sort((a, b) => {
                a = a.match(/Journal\.(\d+?)\.(?:\d*\.)?log/im)[1]
                b = b.match(/Journal\.(\d+?)\.(?:\d*\.)?log/im)[1]
                return a < b ? -1 : a > b ? 1 : 0
            })
    }

    _destroy () {
        this.tail.unwatch()
    }
}
