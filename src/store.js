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
        shipFuelTotal: 0,
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
        setCommanderName (state, commanderName) {
            state.commanderName = commanderName
        },
        setCommanderNotoriety (state, commanderNotoriety) {
            state.commanderNotoriety = commanderNotoriety
        },
        setCommanderCredits (state, commanderCredits) {
            state.commanderCredits = commanderCredits
        },
        setCommanderLoan (state, commanderLoan) {
            state.commanderLoan = commanderLoan
        },
        setCommanderMissions (state, commanderMissions) {
            state.commanderMissions = commanderMissions
        },
        setCommanderMaterials (state, commanderMaterials) {
            state.commanderMaterials = commanderMaterials
        },
        setGameMode (state, gameMode) {
            state.gameMode = gameMode
        },
        setShipType (state, shipType) {
            state.shipType = shipType
        },
        setShipId (state, shipId) {
            state.shipId = shipId
        },
        setShipFuelLevel (state, shipFuelLevel) {
            state.shipFuelLevel = shipFuelLevel
        },
        setShipFuelUsed (state, shipFuelUsed) {
            state.shipFuelUsed = shipFuelUsed
            state.shipFuelTotal = state.shipFuelLevel + shipFuelUsed
        },
        setShipJumpedDistance (state, shipJumpedDistance) {
            state.shipJumpedDistance = shipJumpedDistance
        },
        setShipJumpBoostUsed (state, shipJumpBoostUsed) {
            state.shipJumpBoostUsed = shipJumpBoostUsed
        },
        setInventory (state, inventory) {
            state.inventory = inventory
        },
        setShipIsDocked (state, shipIsDocked) {
            state.shipIsDocked = shipIsDocked
        },
        setShipIsSupercruising (state, shipIsSupercruising) {
            state.shipIsSupercruising = shipIsSupercruising
        },
        setCurrentLocation (state, currentLocation) {
            state.lastLocation = state.currentLocation
            state.currentLocation = currentLocation
        },
        setLastLocation (state, lastLocation) {
            state.lastLocation = lastLocation
        },
        setApproachedSettlement (state, approachedSettlement) {
            state.approachedSettlement = approachedSettlement
        }
    },
    actions: {
        fetchBodyInfo ({ commit }, bodyName) {
        }
    }
})
