<template>
    <v-container grid-list-sm text-left>
        <v-layout row wrap>
            <v-flex xs12>
                <div>Ship: {{shipType}}</div>
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
            'shipIsDocked',
            'shipIsSupercruising',
            'shipJumpedDistance',
            'shipJumpBoostUsed'
        ])
    }
}
</script>

<style scoped lang="sass">

</style>
