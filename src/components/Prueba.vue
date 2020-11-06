<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="6">
        <v-subheader> Custom items </v-subheader>
      </v-col>

      <v-col cols="6">
        <v-select
          v-model="select"
          :items="properties2"
          item-text="adressNickname"
          item-value="_id"
          label="Select"
          persistent-hint
          return-object
          single-line
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
  export default {
    data: () => ({
        select: { _id: "5f973a177f94c948404e3634", adressNickname: "Renato - Los Olivos", },
        items: [
          { state: 'Florida', abbr: 'FL' },
          { state: 'Georgia', abbr: 'GA' },
          { state: 'Nebraska', abbr: 'NE' },
          { state: 'California', abbr: 'CA' },
          { state: 'New York', abbr: 'NY' },
        ],
        properties: [],
        properties2: [],
        properties3:{text:"", value:""},
        path: {
        getAll: "aparments",
        create: "aparment",
        update: "aparment/",
        delete: "aparment/",
        },
      
    }),

  created() {
    this.headerRequests();
    
    this.getProperties();
  },

  methods: {
    handlePageChange(value) {
      this.page = value;
     
      this.getItems();
    },
    headerRequests() {
      this.config = { headers: { "x-token": this.$store.state.token } };
    },

    getProperties() {
      const api = "properties";
      let propertiesArray;
      Vue.axios
        .get(api, this.config)
        .then((response) => {
          propertiesArray = response.data.properties;
          this.properties2 = response.data.properties;
          console.log(this.properties2);
          propertiesArray.map((x) => {
            this.properties.push({ text: x.adressNickname, value: x._id });
          });
          console.log(this.properties);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }
}
</script>
