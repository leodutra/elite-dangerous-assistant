import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import { journalLocation } from '../config'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: function (h) { return h(App) }
}).$mount('#app')

// eslint-disable-next-line no-new
new window.GameEventSink(store, new window.GameEventStream(journalLocation))
