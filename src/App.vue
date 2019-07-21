<template>
  <v-app>
    <v-content>
      <TheShipCanopy />
    </v-content>
  </v-app>
</template>

<script>
import TheShipCanopy from './views/TheShipCanopy';

export default {
  name: 'App',
  components: {
    TheShipCanopy,
  },
  data: () => ({
    //
  }),
};
</script>
