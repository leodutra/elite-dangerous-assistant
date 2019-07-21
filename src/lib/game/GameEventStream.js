const { Tail } = window.require('tail')
const { Readable } = window.require('stream')
const fs = window.require('fs')
const path = window.require('path')

const TAIL_OPTIONS = {
    fromBeginning: true,
    flushAtEOF: true
}

export default class GameEventStream extends Readable {
    constructor (journalPath) {
        super({ objectMode: true })
        this.journalPath = journalPath
    }

    _read (size) {
        if (this.tail == null) {
            const journalFiles = this._listJournalFiles(this.journalPath)
            const lastJournal = journalFiles.pop()
            for (const journalFile of journalFiles) {
                const fullPath = path.resolve(this.journalPath, journalFile)
                console.log('GameEventStream > fully streaming the journal file:', fullPath)
                fs.readFileSync(fullPath, { encoding: 'utf8' })
                    .split(/\r?\n/m)
                    .filter(line => line.trim())
                    .map(line => JSON.parse(line.trim()))
                    .sort((a, b) =>
                        a.timestamp < b.timestamp ? -1
                            : a.timestamp > b.timestamp ? 1 : 0
                    )
                    .forEach(event => this.push(event))
            }
            const fullPath = path.resolve(this.journalPath, lastJournal)
            console.log('GameEventStream > tail-streaming full journal file:', fullPath)
            this.tail = new Tail(fullPath, TAIL_OPTIONS)
            this.tail.on('line', line => {
                if ((line = line.trim())) {
                    this.push(JSON.parse(line))
                }
            })
            this.tail.on('error', error =>
                window.process.nextTick(() => this.emit('error', error))
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
