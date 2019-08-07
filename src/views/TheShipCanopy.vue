<template>
  <v-container grid-list-md text-center fill-height>
    <v-layout row wrap align-center fill-height>
      <v-flex xs12 overline>
        <CommanderInfo />
        <LocationInfo />
        <ShipInfo />
        <ShipCargoInfo />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CommanderInfo from "../components/CommanderInfo";
import InventoryInfo from "../components/InventoryInfo";
import LocationInfo from "../components/LocationInfo";
import MissionsInfo from "../components/MissionsInfo";
import ShipCargoInfo from "../components/ShipCargoInfo";
import ShipInfo from "../components/ShipInfo";

export default {
  components: {
    CommanderInfo,
    LocationInfo,
    MissionsInfo,
    ShipCargoInfo,
    ShipInfo
  }
};
</script>

<style scoped lang="sass">
    .overline
        font-weight: bold !important
</style>
