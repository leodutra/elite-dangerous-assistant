const Location = require('./models/Location')
// const Mission = require('./models/Mission')
// const Ship = require('./models/Ship')

module.exports = class GameEventSink {
    constructor (store, gameEventStream) {
        this.store = store
        this.gameEventStream = gameEventStream
        this.gameEventStream.on('data', data => {
            switch (data.event) {
            case 'Docked':
                store.commit('shipIsDocked', true)
                break
            case 'LoadGame':
                store.commit('setCommanderName', data.Commander)
                store.commit('setShipId', data.ShipID)
                store.commit('setShipType', data.Ship)
                store.commit('setGameMode', data.GameMode)
                store.commit('setCommanderCredits', data.Credits)
                store.commit('setCommanderLoan', data.Loan)
                break
            case 'Location':
                store.commit('setCurrentLocation', new Location({
                    name: data.StationName || data.Body,
                    type: data.StationType || data.BodyType,
                    system: data.StarSystem,
                    docked: data.Docked,
                    faction: data.Faction,
                    factionState: data.FactionState,
                    allegiance: data.Allegiance,
                    economy: data.Economy,
                    government: data.Government,
                    security: data.Security,
                    powers: data.Powers,
                    powerplayState: data.PowerplayState
                }))
                break
            case 'SupercruiseExit':
                store.commit('setCurrentLocation', new Location({
                    name: data.Body,
                    type: data.BodyType,
                    system: data.StarSystem
                }))
                break
            case 'Undocked':
                store.commit('shipIsDocked', false)
                break
            }
        })
        this.gameEventStream.on('end', data => {
            console.log('GameEventSink (on stream end)')
        })
    }
}
