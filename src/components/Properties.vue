<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="properties"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :search="search"
      locale="es"
      loading="true"
      loading-text="Cargando datos ... Por favor espere"
      class="elevation-1"
      hide-default-footer
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ title1 }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="'Buscar ' + title2"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nueva {{ title2 }}
              </v-btn>
            </template>
            <v-card>
              <v-form
                @submit.prevent="submit"
                ref="form"
                v-model="valid"
                lazy-validation
              >
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.adressNickname"
                        label="NickName de la Propiedad"
                        :rules="editedItemRules.adressNickname"
                        required
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.adress"
                        label="Dirección"
                        :rules="editedItemRules.adress"
                        required
                      ></v-text-field>
                    </v-col>
                    
                  </v-row >

                  <v-row
                  >

                    <v-col cols="4" sm="12" md="4">
                      <v-autocomplete
                        v-model="editedItem.region"
                        :items="itemsRegions"
                        item-text="name"
                        item-value="code"
                        label="Región"
                        required
                        return-object
                        :rules="editedItemRules.region"
                        @change="provinces(editedItem.region)"
                      ></v-autocomplete>
                    </v-col>

                    <v-col cols="4" sm="12" md="4">
                      <v-autocomplete
                        v-model="editedItem.provincie"
                        :rules="editedItemRules.provincie"
                        :items="itemsProvinces"
                        item-text="name"
                        item-value="code"
                        label="Provincia"
                        @change="districts(editedItem.provincie)"
                        return-object
                        required
                        
                      ></v-autocomplete>
                    </v-col>

                    <v-col cols="4" sm="12" md="4">
                      <v-autocomplete
                        v-model="editedItem.district"
                        :rules="editedItemRules.district"
                        :items="itemsDistricts"
                        item-text="name"
                        item-value="code"
                        label="Distrito"
                        return-object
                        required
                       
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" :dark="true" @click="close">
                  Cancelar
                </v-btn>
                <v-btn
                  color="green darken-1"
                  :dark="!valid ? false : true"
                  @click="save"
                  :disabled="!valid"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Estas seguro de borrar la {{ title2 }}?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" dark @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="red darken-1" dark @click="deleteItemConfirm"
                  >Confirmar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { Region, Province, District } from "ubigeos";
import {
  required,
  maxLength,
  minLength,
  email,
} from "vuelidate/lib/validators";

Vue.use(VueAxios, axios);

export default {
  data: () => ({
    valid: true,
    title1: "Propiedades",
    title2: "Propiedad",
    search: "",
    dialog: false,
    dialogDelete: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers: [
      { text: "N", value: "index" , width: "60px" },
      { text: "Nick Name ", value: "adressNickname" , width: "200px" },
      { text: "Dirección", value: "adress" , width: "250px" },
      { text: "Region", value: "region.name", width: "120px" },
      { text: "Provincia", value: "provincie.name", width: "120px" },
      { text: "Distrito", value: "district.name", width: "120px" },
      
      
      { text: "Actions", value: "actions", sortable: false },
    ],
    properties: [],
    editedIndex: -1,
    itemsRegions: [],
    itemsProvinces: [],
    itemsDistricts: [],
    editedItem: {
      adressNickname: "",
      adress: "",
      region: "",
      provincie: "",
      district: "",
    },
    editedItemRules: {
      adressNickname: [(v) => !!v || "Campo requerido"],
      adress: [(v) => !!v || "Campo requerido"],
      region: [(v) => !!v || "Campo requerido"],
      provincie: [(v) => !!v || "Campo requerido"],
      district: [(v) => !!v || "Campo requerido"],
    },
    defaultItem: {
      adressNickname: "",
      adress: "",
      region: "",
      provincie: "",
      district: "",
    },
    config: "",
  }),

  created() {},
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva " + this.title2
        : "Editar " + this.title2;
    },
    
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.headerRequests();
    this.getProperties();
    this.regions();
  },

  methods: {
    headerRequests() {
      this.config = { headers: { "x-token": this.$store.state.token } };
    },
    getProperties() {
      const api = "properties";

      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.properties = response.data.properties;

          // Agregar Index para la Tabla
          let i = 1;
          for (const property of this.properties) {
            property.index = i++;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editItem(item) {

      this.provinces(item.region);
      this.districts(item.provincie);
      this.editedIndex = this.properties.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.properties.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const api = "property/" + this.editedItem._id;
      Vue.axios
        .delete(api, this.config)
        .then((response) => {
          this.getProperties();
        })
        .catch((error) => {
          console.log(error);
        });

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      // this.$v.$reset(); // Borrar validacion
      this.$refs.form.reset(); // Borrar validacion
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        const api = "property/" + this.editedItem._id;
        console.log(this.config);
        Vue.axios
          .put(api, { ...this.editedItem }, this.config)
          .then((response) => {
            this.getProperties();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const api = "property";
        Vue.axios
          .post(api, { ...this.editedItem }, this.config)
          .then((response) => {
            this.getProperties();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.close();
    },
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

    provinces(item) {
      if (item.code == "") {
        console.log("Seleccionar");
      } else {
        let provincies;
        provincies = Region.instance(item.code).getProvincies();
        this.itemsProvinces = provincies.map((x) => {
          return { code: x.getCode(), name: x.getName() };
        });
        this.itemsDistricts = [];
        this.editedItem.provincie = "";
        this.editedItem.district = "";
      }
    },
    districts(item) {
      console.log(item);
      this.editedItem.district = "";
      if (item.code == "") {
        console.log("Seleccionar");
      } else {
        let districts;
        districts = Province.instance(item.code).getDistricts();
        this.itemsDistricts = districts.map((x) => {
          return { code: x.getCode(), name: x.getName() };
        });
      }
    },
  },
};
</script>