import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import { journalLocation } from '../config'
import GameEventSink from './lib/game/GameEventSink'
import GameEventStream from './lib/game/GameEventStream'

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
    router,
    store,
    vuetify,
    render: function (h) { return h(App) }
}).$mount('#app')

// eslint-disable-next-line no-new
new GameEventSink(store, new GameEventStream(journalLocation))
