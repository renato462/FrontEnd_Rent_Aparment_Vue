<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center display-1 teal--text text--accent-3 mt-mb-40"
                        >
                          Rent@ HOGAR
                        </h1>
                        <div class="text-center mt-4">
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-facebook-f</v-icon>
                          </v-btn>
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-google-plus-g</v-icon>
                          </v-btn>
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-linkedin-in</v-icon>
                          </v-btn>
                        </div>
                        <v-divider class="mt-4"></v-divider>
                        <h4 class="text-center mt-4">Ingrese su email para acceso</h4>
                        <v-form>
                          <v-text-field
                            label="Email"
                            name="Email"
                            prepend-icon="email"
                            type="text"
                            color="teal accent-3"
                            v-model="user.email"
                            :error-messages="errorsMsgEmail"
                            required
                            @blur="$v.user.email.$touch()"
                          />
                          <v-text-field
                            label="Password"
                            name="Password"
                            prepend-icon="lock"
                            type="password"
                            color="teal accent-3"
                            v-model="user.password"
                            :error-messages="errorsMsgPassword"
                            required
                            @blur="$v.user.password.$touch()"
                          />
                        </v-form>
                        <h3 class="text-center mt-3">Olvido su password ?</h3>
                      </v-card-text>
                      <div class="text-center mb-3">
                        <v-btn
                          rounded
                          color="teal accent-3"
                          dark
                          @click="login"
                        >
                          Ingresar</v-btn
                        >
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="teal accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Hola, Dueño !</h1>
                        <h5 class="text-center mt-4">
                          Registrate para ingresar a nuestro beneficios
                        </h5>
                      </v-card-text>
                      <div class="text-center mt-4">
                        <v-btn rounded outlined="" dark @click="step++"
                          >Registrar</v-btn
                        >
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="teal accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Hola, Familia !</h1>
                        <h3 class="text-center mt-4">
                          Ingresa a tu cuenta
                        </h3>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--"
                          >INGRESAR</v-btn
                        >
                      </div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center display-2 teal--text text--accent-3"
                        >
                          Crear cuenta
                        </h1>
                        <div class="text-center mt-4">
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-facebook-f</v-icon>
                          </v-btn>
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-google-plus-g</v-icon>
                          </v-btn>
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-linkedin-in</v-icon>
                          </v-btn>
                        </div>
                        <v-divider class="mt-4"></v-divider>
                        <h4 class="text-center mt-4">
                          Registra tus datos personales
                        </h4>
                        <v-form>
                          <v-text-field
                            label="Nombres"
                            name="Nombres"
                            prepend-icon="person"
                            type="text"
                            color="teal accent-3"
                            v-model="user.name"
                            :error-messages="errorsMsgName"
                            required
                            @blur="$v.user.name.$touch()"
                          />
                          <v-text-field
                            label="Apellidos"
                            name="Apellidos"
                            prepend-icon="person"
                            type="text"
                            color="teal accent-3"
                            v-model="user.lastName"
                            :error-messages="errorsMsgLastName"
                            required
                            @blur="$v.user.lastName.$touch()"
                          />
                          <v-text-field
                            label="Email"
                            name="Email"
                            prepend-icon="email"
                            type="text"
                            color="teal accent-3"
                            v-model="user.email"
                            :error-messages="errorsMsgEmail"
                            required
                            @blur="$v.user.email.$touch()"
                          />
                          <v-text-field
                            label="Password"
                            name="Password"
                            prepend-icon="lock"
                            color="teal accent-3"
                            v-model="user.password"
                            :error-messages="errorsMsgPassword"
                            required
                            @blur="$v.user.password.$touch()"
                          />
                          <p v-if="hasError" class="red--text text-center">
                            (*) El email se encuentra registrado
                          </p>
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-n5 mb-3">
                        <v-btn
                          rounded
                          color="teal accent-3"
                          dark
                          @click="register"
                          >REGISTRAR</v-btn
                        >
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data: () => ({
    step: 1,
    user: {
      email: "",
      password: "",
    },
    userDefault: {
      email: "",
      password: "",
    },
    hasError: false,
  }),
  props: {
    source: String,
  },
  validations: {
    user: {
      name: { required },
      lastName: { required },
      email: { required, email },
      password: { required },
    },
  },
  computed: {
    // Mensajes de Error para Validación
    errorsMsgEmail() {
      const errors = [];
      if (!this.$v.user.email.$dirty) return errors;
      !this.$v.user.email.required && errors.push("(*) Campo obligatorio.");
      !this.$v.user.email.email && errors.push("(*) Campo debe ser un email.");
      return errors;
    },
    errorsMsgPassword() {
      const errors = [];
      if (!this.$v.user.password.$dirty) return errors;
      !this.$v.user.password.required && errors.push("(*) Campo obligatorio.");
      return errors;
    },
    errorsMsgName() {
      const errors = [];
      if (!this.$v.user.name.$dirty) return errors;
      !this.$v.user.name.required && errors.push("(*) Campo obligatorio.");
      return errors;
    },
    errorsMsgLastName() {
      const errors = [];
      if (!this.$v.user.lastName.$dirty) return errors;
      !this.$v.user.lastName.required && errors.push("(*) Campo obligatorio.");
      return errors;
    },
  },
  methods: {
    login() {
      const api = "login";
      console.log(this.user);
      Vue.axios
        .post(api, this.user)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          this.$store.dispatch("saveToken", data.token);
          this.$router.push("/properties");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    register() {
      const api = "user";

      Vue.axios
        .post(api, this.user)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          this.$store.dispatch("saveToken", data.token);
          this.$router.push("/properties");
        })
        .catch((error) => {
          if (error.response.data.msg) {
            this.hasError = true;
          } else {
            this.hasError = false;
          }
        });
    },
  },
};
</script>
