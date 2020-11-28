<template>
  <div>
    <v-card class="mx-auto" max-width="100%">
      <v-card-text class="pt-0">
        <div class="title mb-2">
          <v-chip class="mt-2 ma-2" color="pink" large label text-color="white">
            <v-icon large left> mdi-label </v-icon>
            Departamento: {{ rent.aparmentId.code }}
          </v-chip>

          <v-chip class="mt-2 ma-2" color="pink" large label text-color="white">
            <v-icon large left> mdi-home </v-icon>
            {{ rent.aparmentId.propertyId.adressNickname }}
          </v-chip>

          <v-chip class="mt-2 ma-2" large color="primary" label>
            <v-icon large left> mdi-account-circle-outline </v-icon>
            {{ rent.clientId.clientName }}
          </v-chip>
          <v-chip class="mt-2 ma-2" large color="green" dark label size="100%">
            <v-icon large left> mdi-cash </v-icon>
            S/. {{ rent.aparmentId.price }}
          </v-chip>
        </div>

        <div class="subheading">
          <v-icon class="mr-2" small> mdi-clock </v-icon>
          Vencimiento del Mes: {{ rent.startDate | moment("DD-MM-YYYY") }}
        </div>
        <v-divider class="my-2"></v-divider>
      </v-card-text>
    </v-card>

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
                        <v-col cols="4" sm="12" md="4">
                          <v-select
                            v-model="editedItem.voucherType"
                            :items="itemsVoucherType"
                            :rules="editedItemRules.voucherType"
                            label="Tipo Comprobante"
                            return-object
                          ></v-select>
                        </v-col>

                        <v-col cols="4" sm="12" md="4">
                          <v-text-field
                            v-model="editedItem.voucherSerie"
                            :rules="editedItemRules.voucherSerie"
                            prefix="N°"
                            label="Serie"
                            type="text"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4" sm="12" md="4">
                          <v-text-field
                            v-model="editedItem.voucherNumber"
                            :rules="editedItemRules.voucherNumber"
                            prefix="N°"
                            label="Numero"
                            type="number"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4" sm="12" md="4">
                          <v-text-field
                            v-model="editedItem.moneyIncome"
                            :rules="editedItemRules.moneyIncome"
                            prefix="S/"
                            label="Pago sin IGV"
                            type="number"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4" sm="12" md="4">
                          <v-text-field
                            :value="getTax"
                            
                            :rules="editedItemRules.tax"
                            prefix="S/"
                            label="IGV"
                            type="number"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4" sm="12" md="4">
                          <v-text-field
                            :value="getTotal"
                            :rules="editedItemRules.moneyIncomeTotal"
                            prefix="S/"
                            label="Total"
                            type="number"
                            required
                          ></v-text-field>
                        </v-col>

                        <v-col cols="6" sm="12" md="6">
                          <v-datetime-picker
                            :textFieldProps="textFieldProps1"
                            :datePickerProps="datePickerProps"
                            dateFormat="dd-MM-yyyy"
                            label="Inicio Perido"
                            v-model="editedItem.startPeriod"
                          >
                          </v-datetime-picker>
                        </v-col>
                        <v-col cols="6" sm="12" md="6">
                          <v-datetime-picker
                            :textFieldProps="textFieldProps2"
                            :datePickerProps="datePickerProps"
                            dateFormat="dd-MM-yyyy"
                            label="Fin de Periodo"
                            v-model="editedItem.endPeriod"
                          >
                          </v-datetime-picker>
                        </v-col>
                        <v-col cols="4" sm="12" md="4">
                          <v-text-field
                            :value="getPeriod"
                            :rules="editedItemRules.period"
                            
                            label="Mes de Periodo"
                            type="text"
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
        <template v-slot:item.moneyIncome="{ item }">
          <span>{{
            new Intl.NumberFormat("es-PE", {
              style: "currency",
              currency: "PEN",
            }).format(item.moneyIncome)
          }}</span>
        </template>
        <template v-slot:item.tax="{ item }">
          <span>{{
            new Intl.NumberFormat("es-PE", {
              style: "currency",
              currency: "PEN",
            }).format(item.tax)
          }}</span>
        </template>
        <template v-slot:item.moneyIncomeTotal="{ item }">
          <span>{{
            new Intl.NumberFormat("es-PE", {
              style: "currency",
              currency: "PEN",
            }).format(item.moneyIncomeTotal)
          }}</span>
        </template>
        <template v-slot:item.startPeriod="{ item }">
          <span>{{ item.startPeriod | moment("DD-MM-YYYY") }}</span>
        </template>

        <template v-slot:item.endPeriod="{ item }">
          <span>{{ item.endPeriod | moment("DD-MM-YYYY") }}</span>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            v-if="item.status == 'Pendiente'"
            class="ma-2"
            color="black"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>pending</v-icon>
            </v-avatar>
            {{ item.status }}
          </v-chip>
          <v-chip
            v-if="item.status == 'Deuda'"
            class="ma-2"
            color="red"
            text-color="white"
            @click="deleteItem(item)"
          >
            <v-avatar left>
              <v-icon>report_problem</v-icon>
            </v-avatar>
            {{ item.status }}
          </v-chip>
          <v-chip
            v-if="item.status == 'Pagado'"
            class="ma-2"
            color="green"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>check_circle</v-icon>
            </v-avatar>
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil-outline
          </v-icon>
          <!-- <v-icon small @click="deleteItem(item)"> mdi-delete-outline </v-icon> -->
        </template>

        <template v-slot:no-data> </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
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
    title1: "Pago",
    title2: "",
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
      { text: "Tipo", value: "voucherType" },
      { text: "Serie ", value: "voucherSerie" },
      { text: "Numero", value: "voucherNumber" },
      { text: "Pago Sin IGV", value: "moneyIncome" },
      { text: "IGV", value: "tax" },
      { text: "Total", value: "moneyIncomeTotal" },
      { text: "Inicio", value: "startPeriod" },
      { text: "Fin", value: "endPeriod" },
      { text: "Periodo", value: "period" },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    itemsVoucherType: ["Ticket", "Boleta", "Factura"],
    rent: "",
    itemsStatus: ["Pendiente", "Deuda", "Pagado"],
    items: [],
    editedIndex: -1,
    editedItem: {
      voucherType: "",
      voucherSerie: "",
      voucherNumber: "",
      moneyIncome: "",
      tax: "",
      moneyIncomeTotal: "",
      period: "",
      startPeriod: "",
      endPeriod: "",
      status: "",
      rentId: "",
    },
    editedItemRules: {
      voucherType: [(v) => !!v || "Dato es requerido"],
      voucherSerie: [(v) => !!v || "Dato es requerido"],
      voucherNumber: [(v) => !!v || "Dato es requerido"],
      moneyIncome: [(v) => !!v || "Dato es requerido"],
    //  tax: [(v) => !!v || "Dato es requerido"],
      moneyIncomeTotal: [(v) => !!v || "Dato es requerido"],
      period: [(v) => !!v || "Dato es requerido"],
      startPeriod: [(v) => !!v || "Dato es requerido"],
      endPeriod: [(v) => !!v || "Dato es requerido"],
    },
    defaultItem: {
      voucherType: "",
      voucherSerie: "",
      voucherNumber: "",
      moneyIncome: "",
      tax: "",
      moneyIncomeTotal: "",
      period: "",
      startPeriod: "",
      endPeriod: "",
      status: "",
      rentId: "",
    },
    path: {
      getAll: "payments",
      create: "payment",
      update: "payment/",
      delete: "payment/",
    },
    config: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva " + this.title2
        : "Editar " + this.title2;
    },

    getTax() {
      if (this.editedItem.moneyIncome) {
        if (this.editedItem.voucherType == "Ticket") {
          return this.editedItem.tax = this.editedItem.moneyIncome*0;
        }
        if (this.editedItem.voucherType == "Boleta") {
          return this.editedItem.tax = this.editedItem.moneyIncome * 0.18;
        }
        if (this.editedItem.voucherType == "Factura") {
          return this.editedItem.tax = this.editedItem.moneyIncome * 0.18;
        }
      }
      return null;
    },
    getTotal() {
      if (this.editedItem.moneyIncome) {
        if (this.editedItem.voucherType == "Ticket") {
          return this.editedItem.moneyIncomeTotal = this.editedItem.moneyIncome;
        }
        if (this.editedItem.voucherType == "Boleta") {
          return this.editedItem.moneyIncomeTotal = this.editedItem.moneyIncome*1.18;
        }
        if (this.editedItem.voucherType == "Factura") {
          return this.editedItem.moneyIncomeTotal = this.editedItem.moneyIncome*1.18;
        }
      }
      return null;
    },

    getPeriod() {
      if (this.editedItem.endPeriod) {
        let date1 = moment(this.editedItem.endPeriod);
        
        return (this.editedItem.period = date1.format("MMMM YYYY") );
      }
      return null;
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
    this.getRent();
  },

  methods: {
    headerRequests() {
      this.config = { headers: { "x-token": this.$store.state.token } };
    },
    getRent() {
      const api = `rent_one/${this.$route.params.id}`;
      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.rent = response.data.rent;
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
          this.items = response.data.items;

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

      item.startPeriod = new Date(item.startPeriod);
      item.endPeriod = new Date(item.endPeriod);
    //   console.log(item);
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
      this.editedItem.rentId = this.$route.params.id;
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
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>