<template>
  <div>
    <v-app-bar app color="primary" dark>
      <!-- <div class="d-flex align-center">
        <v-icon>mdi-home</v-icon>
        <h1 class="mr-2 ml-40">Rent@ Hogar</h1>
      </div> -->
      <v-app-bar-nav-icon @click="$store.state.drawer = !$store.state.drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Rent@ Hogar</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="logout" target="_blank" text>
        <span class="mr-2">Salir</span>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "NavBar",
  
  data: () => ({  }),
  methods: {
    ...mapActions(["logout","drawer"]),
  },
};
</script>
 