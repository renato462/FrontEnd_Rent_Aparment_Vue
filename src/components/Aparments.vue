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
                          v-model="editedItem.code"
                          :rules="editedItemRules.code"
                          label="Codigo"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.floor"
                          :rules="editedItemRules.floor"
                          label="Piso"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.price"
                          :rules="editedItemRules.price"
                          label="Precio"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
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

      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleDateString() }}</span>
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
      <v-pagination
        v-model="page"
        :length="pageNumber"
        @input="handlePageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import {
  required,
  maxLength,
  minLength,
  email,
} from "vuelidate/lib/validators";

Vue.use(VueAxios, axios);

export default {
  data: () => ({
    loading: true,
    valid: true,
    title1: "Departamentos",
    title2: "Departamento",
    search: "",
    dialog: false,
    dialogDelete: false,

    page: 1,
    pageCount: 0,
    pageNumber: 0,
    itemsPerPage: 10,
    headers: [
      { text: "N", value: "index" },
      { text: "Codigo ", value: "code" },
      { text: "Piso ", value: "floor" },
      { text: "Precio", value: "price" },
      { text: "Propiedad", value: "propertyId.adressNickname" },
      { text: "Creado", value: "createdAt" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    properties: [],
    items: [],
    editedIndex: -1,
    editedItem: {
      code: "",
      floor: "",
      price: "",
      propertyId: "",
    },
    editedItemRules: {
      code: [(v) => !!v || "Codido es requerido"],
      floor: [(v) => !!v || "Piso es requerido"],
      price: [(v) => !!v || "Precio es requerido"],
      propertyId: [(v) => !!v || "Propiedad es requerido"],
    },
    defaultItem: {
      code: "",
      floor: "",
      price: "",
      propertyId: "",
    },
    path: {
      getAll: "aparments",
      create: "aparment",
      update: "aparment/",
      delete: "aparment/",
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
    this.getProperties();
  },

  methods: {
    handlePageChange(value) {
      this.page = value;
      console.log("renato");
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
          this.properties = response.data.properties;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getItems() {
      const api = this.path.getAll + "?page=" + this.page;
      this.loading = true;

      Vue.axios
        .get(api, this.config)
        .then((response) => {
          this.loading = false;

          // Se debe cambiar en cada iteración
          this.items = response.data.aparments;
          this.pageNumber = +Math.ceil(
            response.data.aparmentTotal / this.itemsPerPage
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
  },
};
</script>