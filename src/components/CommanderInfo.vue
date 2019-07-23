<template>
    <v-container grid-list-sm text-left>
        <v-layout row wrap>
            <v-flex xs12>
                <div>Credits: {{commanderCredits}}</div>
                <div>Loan: {{commanderLoan}}</div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState([
            'commanderCredits',
            'commanderLoan'
        ])
    }
}
</script>

<style scoped lang="sass">

</style>
