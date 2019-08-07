import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.devtools = true

export default new Vuex.Store({
    state: {
        commanderName: '',
        commanderNotoriety: 0,
        commanderCredits: 0,
        commanderLoan: 0,
        commanderMissions: {},
        commanderMaterials: {},
        gameMode: '',
        shipType: '',
        shipId: '',
        shipFuelLevel: 0,
        shipFuelUsed: 0,
        shipJumpedDistance: 0,
        shipJumpBoostUsed: false,
        inventory: [],
        shipIsDocked: false,
        shipIsSupercruising: false,
        currentLocation: null,
        lastLocation: null,
        approachedSettlement: ''
    },
    mutations: {
        setCommanderName (store, commanderName) {
            store.commanderName = commanderName
        },
        setCommanderNotoriety (store, commanderNotoriety) {
            store.commanderNotoriety = commanderNotoriety
        },
        setCommanderCredits (store, commanderCredits) {
            store.commanderCredits = commanderCredits
        },
        setCommanderLoan (store, commanderLoan) {
            store.commanderLoan = commanderLoan
        },
        setCommanderMissions (store, commanderMissions) {
            store.commanderMissions = commanderMissions
        },
        setCommanderMaterials (store, commanderMaterials) {
            store.commanderMaterials = commanderMaterials
        },
        setGameMode (store, gameMode) {
            store.gameMode = gameMode
        },
        setShipType (store, shipType) {
            store.shipType = shipType
        },
        setShipId (store, shipId) {
            store.shipId = shipId
        },
        setShipFuelLevel (store, shipFuelLevel) {
            store.shipFuelLevel = shipFuelLevel
        },
        setShipFuelUsed (store, shipFuelUsed) {
            store.shipFuelUsed = shipFuelUsed
        },
        setShipJumpedDistance (store, shipJumpedDistance) {
            store.shipJumpedDistance = shipJumpedDistance
        },
        setShipJumpBoostUsed (store, shipJumpBoostUsed) {
            store.shipJumpBoostUsed = shipJumpBoostUsed
        },
        setInventory (store, inventory) {
            store.inventory = inventory
        },
        setShipIsDocked (store, shipIsDocked) {
            store.shipIsDocked = shipIsDocked
        },
        setShipIsSupercruising (store, shipIsSupercruising) {
            store.shipIsSupercruising = shipIsSupercruising
        },
        setCurrentLocation (store, currentLocation) {
            store.lastLocation = store.currentLocation
            store.currentLocation = currentLocation
        },
        setLastLocation (store, lastLocation) {
            store.lastLocation = lastLocation
        },
        setApproachedSettlement (store, approachedSettlement) {
            store.approachedSettlement = approachedSettlement
        }
    },
    actions: {
        fetchBodyInfo ({ commit }, bodyName) {
        }
    }
})
