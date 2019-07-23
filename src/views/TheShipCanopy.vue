<template>
  <v-container grid-list-md text-center fill-height>
    <v-layout row wrap align-center fill-height>
      <v-flex xs12 overline>
        <CommanderInfo />
        <LocationInfo />
        <!-- <MissionsInfo/> -->
        <ShipInfo />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CargoInfo from "../components/CargoInfo";
import CommanderInfo from "../components/CommanderInfo";
import LocationInfo from "../components/LocationInfo";
import MissionsInfo from "../components/MissionsInfo";
import ShipInfo from "../components/ShipInfo";

export default {
  components: {
    CargoInfo,
    CommanderInfo,
    LocationInfo,
    MissionsInfo,
    ShipInfo
  }
};
</script>

<style scoped lang="sass">
    .overline
        font-weight: bold !important
</style>
