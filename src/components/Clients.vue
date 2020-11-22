<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :search="search"
      locale="es"
      :loading="loading"
      loading-text="Cargando datos ... Por favor espere"
      class="elevation-1"
      hide-default-footer
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <v-toolbar flat>
          

          
          
          <v-toolbar-title>{{ title1 }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
           class="mx-6"
            v-model="search"
            append-icon="mdi-magnify"
            :label="'Buscar ' + title2"
            single-line
            hide-details
          ></v-text-field>
          
          <v-dialog v-model="dialog" max-width="60%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn  color="primary"
                dark
                fab
                small
                class=""
                v-bind="attrs"
                v-on="on">
               <v-icon dark> mdi-plus </v-icon>
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
                          v-model="editedItem.clientName"
                          :rules="editedItemRules.clientName"
                          label="Nombre o Razón Social "
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="12" md="6">
                        <v-autocomplete
                          v-model="editedItem.typeDocument"
                          :items="typeDocument"
                          item-text="typeDocument"
                          item-value="id"
                          :rules="editedItemRules.typeDocument"
                          label="Tipos de Documento"
                          required
                          return-object
                        ></v-autocomplete>
                      </v-col>

                      <v-col cols="6" sm="12" md="6">
                        <v-text-field
                          v-model="editedItem.numberDocument"
                          :rules="editedItemRules.numberDocument"
                          label="Numero de Documento"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.adress"
                          :rules="editedItemRules.adress"
                          label="Dirección"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="4" sm="12" md="4">
                        <v-autocomplete
                          v-model="editedItem.region"
                          :items="itemsRegions"
                          item-text="name"
                          item-value="code"
                          :rules="editedItemRules.region"
                          label="Región"
                          required
                          return-object
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
                      

                    <v-col cols="4" sm="12" md="4">
                        <v-text-field
                          v-model="editedItem.contact"
                          :rules="editedItemRules.contact"
                          label="Contacto "
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" sm="12" md="4">
                        <v-text-field
                          v-model="editedItem.phone"
                          :rules="editedItemRules.phone"
                          label="Telefono "
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" sm="12" md="4">
                        <v-text-field
                          v-model="editedItem.email"
                          :rules="editedItemRules.email"
                          label="Correo"
                          required
                        ></v-text-field>
                      </v-col>

                      <!-- <v-col cols="12" sm="12" md="12">
                        <v-autocomplete
                          v-model="editedItem.propertyId"
                          :items="properties"
                          item-text="adressNickname"
                          item-value="_id"
                          :rules="editedItemRules.propertyId"
                          label="Propiedades"
                          required
                          return-object
                        ></v-autocomplete>
                      </v-col> -->
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

      <template v-slot:item.updatedAt="{ item }">
        <span>{{ new Date(item.updatedAt).toLocaleDateString() }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>

      <template v-slot:no-data> </template>
    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageNumber"
        @input="handlePageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import Prueba from "../components/Prueba.vue";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { Region, Province, District } from "ubigeos";

Vue.use(VueAxios, axios);

export default {
  components: {
    Prueba,
  },
  data: () => ({
    loading: true,
    valid: true,
    title1: "Clientes",
    title2: "Cliente",
    search: "",
    dialog: false,
    dialogDelete: false,
    

    page: 1,
    pageCount: 0,
    pageNumber: 0,
    itemsPerPage: 10,
    headers: [
      { text: "N", value: "index", width: "80px"  },
      { text: "Nombre o Razón Social ", value: "clientName", width: "200px" },
      { text: "Tipo ", value: "typeDocument" , width: "100px"  },
      { text: "# Documento", value: "numberDocument", width: "150px"  },
      { text: "Distrito", value: "district.name", width: "100px"  },
      { text: "Provincia", value: "provincie.name" , width: "100px" },
      { text: "Contacto", value: "contact" , width: "200px" },
      { text: "Telefono", value: "phone" , width: "100px" },
      { text: "Correo", value: "email", width: "200px"  },
      
      { text: "Acciones", value: "actions", sortable: false },
    ],
    items: [],
    clients: [],
    itemsRegions: [],
    itemsProvinces: [],
    itemsDistricts: [],
    typeDocument: ["DNI", "RUC", "CE", "PASAPORTE", "OTROS"],
    editedIndex: -1,
    editedItem: {
      clientName: "",
      typeDocument: "",
      numberDocument: "",
      adress: "",
      contact:"",
      phone: "",
      email: "",
      region: "",
      provincie: "",
      district: "",
    },
    editedItemRules: {
      clientName: [(v) => !!v || "Campo requerido"],
      typeDocument: [(v) => !!v || "Campo requerido"],
      numberDocument: [(v) => !!v || "Campo requerido"],
      adress: [(v) => !!v || "Campo requerido"],
      phone: [(v) => !!v || "Campo requerido"],
      email: [
        (v) => !!v || "Campo requerido",
        (v) => /.+@.+\..+/.test(v) || "Campo debe ser un email valido",
      ],
      contact: [(v) => !!v || "Campo requerido"],
      region: [(v) => !!v || "Campo requerido"],
      provincie: [(v) => !!v || "Campo requerido"],
      district: [(v) => !!v || "Campo requerido"],
    },
    defaultItem: {
      clientName: "",
      typeDocument: "",
      numberDocument: "",
      adress: "",
      contact: "",
      phone: "",
      email: "",
      region:"",
      provincie: "",
      district: "",
    },
    path: {
      getAll: "clients",
      create: "client",
      update: "client/",
      delete: "client/",
    },
    config: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva " + this.title2
        : "Editar " + this.title2;
    },
    // updateTable() {

    //   return this.getItems();
    // },
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
    this.getItems();
    this.regions();
  },

  methods: {
    handlePageChange(value) {
      this.page = value;
      this.getItems();
    },
    headerRequests() {
      this.config = { headers: { "x-token": this.$store.state.token } };
    },

    getItems() {
      const api = this.path.getAll + "?page=" + this.page;
      this.loading = true;

      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.loading = false;

          // Se debe cambiar en cada iteración
          this.items = response.data.clients;
          this.pageNumber = +Math.ceil(
            response.data.clientTotal / this.itemsPerPage
          );

          // Agregar Index para la Tabla
          let i;
          if (this.page == 1) {
            i = 1;
          } else {
            i = (this.page - 1) * this.itemsPerPage + 1;
          }

          for (const item of this.items) {
            item.index = i++;
          }
        })

        .catch((error) => {
          console.log(error);
        });
    },
    editItem(item) {
      
      this.provinces(item.region);
      this.districts(item.provincie);
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const api = this.path.delete + this.editedItem._id;
      Vue.axios
        .delete(api, this.config)
        .then((response) => {
          this.getItems();
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
      if (!this.$refs.form.validate()) {
        this.$refs.form.validate();
      } else {
        this.saveFinal();
      }
    },

    saveFinal() {
      if (this.editedIndex > -1) {
        const api = this.path.update + this.editedItem._id;
        Vue.axios
          .put(api, { ...this.editedItem }, this.config)
          .then((response) => {
            this.getItems();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const api = this.path.create;

        Vue.axios
          .post(api, { ...this.editedItem }, this.config)
          .then((response) => {
            this.getItems();
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
        this.editedItem.provincie ="";
        this.editedItem.district ="";
        
      }
    },

    districts(item) {
      this.editedItem.district ="";
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
