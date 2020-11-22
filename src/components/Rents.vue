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

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                fab
                small
                class=""
                v-bind="attrs"
                v-on="on"
              >
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
                        <v-autocomplete
                          v-model="editedItem.clientId"
                          :items="clients"
                          item-text="clientName"
                          item-value="_id"
                          :rules="editedItemRules.clientId"
                          label="Cliente"
                          required
                          return-object
                        ></v-autocomplete>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                        <v-autocomplete
                          v-model="editedItem.aparmentId"
                          :items="aparments"
                          item-text="code"
                          item-value="_id"
                          :rules="editedItemRules.aparmentId"
                          label="Codigo Departamento"
                          required
                          return-object
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="6" sm="12" md="6">
                        <v-datetime-picker
                          :textFieldProps="textFieldProps1"
                          :datePickerProps="datePickerProps"
                          dateFormat="dd-MM-yyyy"
                          label="Inicio Contrato"
                          v-model="editedItem.startDate"
                        >
                        </v-datetime-picker>
                      </v-col>
                      <v-col cols="6" sm="12" md="6">
                        <v-datetime-picker
                          :textFieldProps="textFieldProps2"
                          :datePickerProps="datePickerProps"
                          dateFormat="dd-MM-yyyy"
                          label="Fin de Contrato"
                          v-model="editedItem.endDate"
                        >
                        </v-datetime-picker>
                      </v-col>

                      <v-col cols="4" sm="12" md="4">
                        <v-text-field
                          v-model="editedItem.warranty"
                          :rules="editedItemRules.warranty"
                          prefix="S/"
                          label="Garantia"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" sm="12" md="4">
                        <v-text-field
                          type="number"
                          :value="diffMonths"
                          :rules="editedItemRules.contractMonths"
                          label="Meses de Contrato"
                          disabled
                          required
                        ></v-text-field>
                      </v-col>


                      <v-col cols="4" sm="12" md="4">
                       
                        <v-select
                          v-model="editedItem.status"
                          :items="itemsStatus"
                          :rules="editedItemRules.status"
                          label="Estado"
                          return-object
                        ></v-select>
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
      <template v-slot:item.warranty="{ item }">
        <span>{{
          new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
          }).format(item.warranty)
        }}</span>
      </template>
      <template v-slot:item.startDate="{ item }">
        <span>{{ item.startDate | moment("DD-MM-YYYY") }}</span>
      </template>

      <template v-slot:item.endDate="{ item }">
        <span>{{ item.endDate | moment("DD-MM-YYYY") }}</span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip v-if= "item.status == 'Pendiente'" class="ma-2" color="black" text-color="white">
          <v-avatar left>
            <v-icon>pending</v-icon>
          </v-avatar>
          {{item.status}}
        </v-chip>
        <v-chip v-if= "item.status == 'Deuda'" class="ma-2" color="red" text-color="white"  @click="deleteItem(item)" >
          <v-avatar left>
            <v-icon>report_problem</v-icon>
          </v-avatar>
          {{item.status}}
        </v-chip>
           <v-chip v-if= "item.status == 'Pagado'" class="ma-2" color="green" text-color="white">
          <v-avatar left>
            <v-icon>check_circle</v-icon>
          </v-avatar>
          {{item.status}}
        </v-chip>
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
        :length="pageCount"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
Vue.use(require("vue-moment"));
import DatetimePicker from "vuetify-datetime-picker";
// (Optional) import 'vuetify-datetime-picker/src/stylus/main.styl'

Vue.use(DatetimePicker);
import moment from "moment";
moment.locale("es");

export default {
  data: () => ({
    loading: true,
    valid: true,
    title1: "Renta",
    title2: "Renta",
    search: "",
    dialog: false,
    dialogDelete: false,
    menu1: false,
    menu2: false,
    textFieldProps1: {
      prependInnerIcon: "mdi-calendar",
      rules: [(v) => !!v || "Dato es requerido"],
    },
    textFieldProps2: {
      prependInnerIcon: "mdi-calendar",
      rules: [(v) => !!v || "Dato es requerido"],
    },
    datePickerProps: {
      locale: "ES",
    },
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers: [
      // { text: "N", value: "index" },
      { text: "Contrato ", value: "contractNumber" },
      { text: "Cliente ", value: "clientId.clientName" },
      { text: "Departamento", value: "aparmentId.code" },
      { text: "Propiedad", value: "aparmentId.propertyId.adressNickname" },
      { text: "Inicio Contrato", value: "startDate" },
      { text: "Fin Contrato", value: "endDate" },
      { text: "Garantia", value: "warranty" },
      { text: "Meses", value: "contractMonths" },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "actions", sortable: false },
    ],

    clients: [],
    aparments: [],
    itemsStatus: ["Pendiente", "Deuda", "Pagado"],
    items: [],
    editedIndex: -1,
    editedItem: {
      contractNumber: "",
      startDate: "",
      endDate: "",
      warranty: "",
      contractMonths: "",
      status: "",
      clientId: "",
      aparmentId: "",
    },
    editedItemRules: {
      contractNumber: [(v) => !!v || "Dato es requerido"],
      startDate: [(v) => !!v || "Dato es requerido"],
      endDate: [(v) => !!v || "Dato es requerido"],
      warranty: [(v) => !!v || "Dato es requerido"],
      contractMonths: [(v) => !!v || "Dato es requerido"],
      status: [(v) => !!v || "Dato es requerido"],
      clientId: [(v) => !!v || "Dato es requerido"],
      aparmentId: [(v) => !!v || "Dato es requerido"],
    },
    defaultItem: {
      contractNumber: "",
      startDate: "",
      endDate: "",
      warranty: "",
      contractMonths: "",
      status: "",
      clientId: "",
      aparmentId: "",
    },
    path: {
      getAll: "rents",
      create: "rent",
      update: "rent/",
      delete: "rent/",
    },
    config: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva " + this.title2
        : "Editar " + this.title2;
    }, 
    diffMonths(){
      
      if(this.editedItem.startDate&&this.editedItem.endDate) {
        let date1 = moment(this.editedItem.startDate);
        let date2 = moment(this.editedItem.endDate);
        return this.editedItem.contractMonths = date2.diff(date1,"months");
      }return null;
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
    this.getItems();
    this.getClients();
    this.getAparments();
  },

  methods: {
    // diffMonths(){
    //   if(this.editedItem.startDate&&this.editedItem.endDate) {
    //     let date1 = moment(this.editedItem.startDate);
    //     let date2 = moment(this.this.editedItem.endDate);
    //     return this.editedItem.contractMonths = date2.diff(date1,"months");
    //   }
    //   return null;
    // },
    
    headerRequests() {
      this.config = { headers: { "x-token": this.$store.state.token } };
    },

    getClients() {
      const api = "clients";
      let itemsArray;
      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.clients = response.data.clients;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAparments() {
      const api = "aparments";
      let itemsArray;
      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.aparments = response.data.aparments;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getItems() {
      const api = this.path.getAll;
      this.loading = true;
      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.loading = false;

          // Se debe cambiar en cada iteración
          this.items = response.data.rents;
          
          // Agregar Index para la Tabla
          let i = 0;
          for (const item of this.items) {
            item.index = i++;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      //TODO: Se tiene que transformar a Date los Items para que se pueda ver en el Picker

      item.endDate = new Date(item.endDate);
      item.startDate = new Date(item.startDate);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      // console.log(this.editedIndex);
      this.editedItem = { ...item };
      // console.log(this.editedItem);
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
  },
};
</script>