<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="3">
        <v-select
          v-model="selectRegion"
          :items="itemsRegions"
          item-text="name"
          item-value="code"
          label="Región"
          @change="provinces()"
          return-object
        ></v-select>
      </v-col>

      <v-col cols="3">
        <v-select
          v-model="selectProvince"
          :items="itemsProvinces"
          item-text="name"
          item-value="code"
          label="Provincia"
          @change="districts()"
          return-object
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="selectDistrict"
          :items="itemsDistricts"
          item-text="name"
          item-value="code"
          label="Distrito"
          return-object
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { Region, Province, District } from "ubigeos";

export default {
  name: "Prueba",
  data: () => ({
    selectRegion: {
      code: "",
      name: "",
    },
    selectProvince: {
      code: "",
      name: "",
    },
    selectDistrict: {
      code: "",
      name: "",
    },
    itemsRegions: [],
    itemsProvinces: [],
    itemsDistricts: [],
  }),
  computed: {},

  created() {
    this.regions();
  },
  methods: {
    regions() {
      const regions = [];

      for (let i = 1; i <= 25; i++) {
        let region;
        if (i < 10) {
          region = Region.instance("0" + i);
        } else {
          region = Region.instance("" + i);
        }
        regions.push({ code: region.getCode(), name: region.getName() });
      }

      this.itemsRegions = regions;
    },

    provinces() {
      
      if (!this.selectRegion.code == "") {
        let provincies;
        provincies = Region.instance(this.selectRegion.code).getProvincies();
        this.itemsProvinces = provincies.map((x) => {
          return { code: x.getCode(), name: x.getName() };
        });

        this.itemsDistricts = [];
        
        
      } 
    },

    districts() {
  
      if (this.selectProvince.code == "") {
        this.itemsDistricts = [];
      } else {
        let districts;
        districts = Province.instance(this.selectProvince.code).getDistricts();
        this.itemsDistricts = districts.map((x) => {
          return { code: x.getCode(), name: x.getName() };
        });
      }
    },
  },
};
</script>
