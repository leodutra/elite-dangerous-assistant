<template>
    <v-container grid-list-sm text-left>
        <v-layout row wrap>
            <v-flex xs12>
                <div v-if="formattedLocation">{{formattedLocation}}</div>
                <div v-if="formattedLastLocation">{{formattedLastLocation}}</div>
                <div v-if="approachedSettlement">Approached settlement: {{approachedSettlement}}</div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState([
            'currentLocation',
            'approachedSettlement',
            'lastLocation'
        ]),
        formattedLocation () {
            if (this.currentLocation) {
                const { name, type, system } = this.currentLocation
                return `Curr. location: ${name} (${type} - ${system})`
            }
        },
        formattedLastLocation () {
            if (this.lastLocation) {
                const { name, type, system } = this.lastLocation
                return `Last location: ${name} (${type} - ${system})`
            }
        }
    }
}
</script>

<style scoped lang="sass">

</style>
