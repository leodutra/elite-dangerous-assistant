<template>
    <v-container grid-list-sm text-left>
        <v-layout row wrap>
            <v-flex xs12>
                <div>Ship: {{shipType}}</div>
                <div class="d-flex align-center">
                    <span>Fuel:</span>
                    <v-progress-linear
                        :value="fuelValue"
                        class="fuel-bar"
                    />
                </div>
                <div>Fuel level: {{shipFuelLevel}}</div>
                <div>Fuel used: {{shipFuelUsed}}</div>
                <div>Docked: {{shipIsDocked}}</div>
                <div>Supercruising: {{shipIsSupercruising}}</div>
                <div>Jumped dist.: {{shipJumpedDistance}}</div>
                <div>Jump boost used: {{shipJumpBoostUsed || false}}</div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState([
            'shipId',
            'shipType',
            'shipFuelLevel',
            'shipFuelUsed',
            'shipFuelTotal',
            'shipIsDocked',
            'shipIsSupercruising',
            'shipJumpedDistance',
            'shipJumpBoostUsed'
        ]),
        fuelValue () {
            return this.shipFuelLevel / this.shipFuelTotal
        } 
    }
}
</script>

<style scoped lang="sass">

    .fuel-bar
        margin-left: 8px
        max-width: 200px
</style>
