<template>
    <v-container grid-list-sm text-left>
        <v-layout row wrap>
            <v-flex xs12>
                <ul>
                    <li v-for="item of inventory" :key="item.id">
                        {{item.name}}
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
        ...mapState(['inventory'])
    }
}
</script>

<style scoped lang="sass">

</style>
