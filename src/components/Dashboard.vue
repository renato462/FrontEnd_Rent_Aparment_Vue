<template>
  <v-row dense>
    <v-col v-for="item in dashboard" cols="6">
      <v-card class="mx-auto" max-width="100%" color="#385F73"
            dark>
        <!-- <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline"> Propiedad </v-list-item-title>
        <v-list-item-subtitle>{{ new Date() }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item> -->

        <v-card-text>
          <v-row align="center">
            <v-col class="display-1" cols="12">
              {{ item.adressNickname }}
            </v-col>
          </v-row>
        </v-card-text>

        <!-- <v-slider
      v-model="time"
      :max="6"
      :tick-labels="labels"
      class="mx-4"
      ticks
    ></v-slider> -->
        <div class="row" align="center">
          <v-col align="center"  md="4" sm="12" xs="12">
            <v-chip class="ma-2" color="green" text-color="white">
              <v-avatar left>
                <v-icon>check_circle</v-icon>
              </v-avatar>
              Ocupados: {{ item.contratoVigente }}
            </v-chip>
          </v-col>
          <v-col align="center"  md="4" sm="12" xs="12">
            <v-chip class="ma-2" color="red" text-color="white">
              <v-avatar left>
                <v-icon>report_problem</v-icon>
              </v-avatar>
              Deuda: {{ item.deuda }}
            </v-chip>
          </v-col>
          <v-col align="center"  md="4" sm="12" xs="12">
            <v-chip class="ma-2" color="black" text-color="white">
              <v-avatar left>
                <v-icon>pending</v-icon>
              </v-avatar>
              Libre: {{ item.total - item.contratoVigente - item.deuda }}
            </v-chip>
          </v-col>
        </div>

        <v-divider></v-divider>

        <v-card-actions>
          <router-link :to="`/rents`">
            <v-btn text> Ver Detalles </v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

export default {
  data() {
    return {
      config: "",
      dashboard: "",
    };
  },
  created() {
    this.headerRequests();
    this.getDashboard();
  },
  methods: {
    headerRequests() {
      this.config = { headers: { "x-token": this.$store.state.token } };
    },
    getDashboard() {
      const api = "dashboard";
      let itemsArray;
      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.dashboard = response.data.aparmentsArray2;
          
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>