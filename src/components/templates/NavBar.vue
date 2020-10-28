<template>
  <div>
    <v-app-bar app color="primary" dark style="height: 56px">
      <div class="d-flex align-center">
        <v-img
          position='center center'
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          position='center center'n
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click="logout"
        target="_blank"
        text
      >
        <span class="mr-2">Salir</span>
        <v-icon >mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: "NavBar",
  methods: {
    ...mapActions(['logout'])
  }
};
</script>
 