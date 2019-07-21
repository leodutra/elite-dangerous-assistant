import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        commanderName: 'Luke SkyRaper',
        commanderNotoriety: 0,
        commanderCredits: 0,
        commanderLoan: 0,
        commanderMissions: [],
        commanderMaterials: [],
        gameMode: '',
        shipType: '',
        shipId: '',
        shipInventory: [],
        shipIsDocked: false,
        currentLocation: null,
        lastLocation: null
    },
    mutations: {
    },
    actions: {

    }
})
