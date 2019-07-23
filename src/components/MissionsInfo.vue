<template>
    <v-container grid-list-sm text-left>
        <v-layout row wrap>
            <v-flex xs12>
                <ul>
                    <li v-for="mission of commanderMissions" :key="mission.id">
                        {{mission.name}}
                    </li>
                </ul>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState(['commanderMissions'])
    }
}
</script>

<style scoped lang="sass">

</style>
