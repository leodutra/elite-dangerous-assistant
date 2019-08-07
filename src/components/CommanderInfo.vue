<template>
    <v-container grid-list-sm text-left>
        <v-layout row wrap>
            <v-flex xs12>
                <div><strong>{{commanderName}}</strong></div>
                <div>Credits: {{commanderCredits}}</div>
                <div>Loan: {{commanderLoan}}</div>
                <div>Notoriety: {{commanderNotoriety}}</div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState([
            'commanderName',
            'commanderCredits',
            'commanderLoan',
            'commanderNotoriety'
        ])
    }
}
</script>

<style scoped lang="sass">

</style>
