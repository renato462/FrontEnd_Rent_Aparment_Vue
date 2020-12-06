import Vue from "vue";
import Vuex from "vuex";
import decode from "jwt-decode";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    drawer:null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    setDrawer(state, drawer){
      state.drawer = drawer;
    }
  },
  actions: {
    drawer({commit},drawer){
      commit("setDrawer", drawer);
    },
    saveToken({ commit }, token) {
      commit("setToken", token);
      commit("setUser", decode(token));
      localStorage.setItem("token", token);
    },
    autoLogin({ commit }) {
      // TODO: Revisar el error cuando se reenvía.

      let token = localStorage.getItem("token");
      // console.log(token);
      if (decode(token).exp < new Date().getTime() / 1000) {

        this.dispatch("logout");
   
      } else {
        commit("setToken", token);
        commit("setUser", decode(token));
        // router.push("/properties");
      }
    },

    isTokenExpired ({ commit }){
      let token = localStorage.getItem("token");
      // console.log(token);
      if (decode(token).exp < new Date().getTime() / 1000) {

        this.dispatch("logout");
   
      }
    },

    logout({ commit }) {
      commit("setToken", null);
      commit("setUser", null);
      localStorage.removeItem("token");
      router.push("/login").catch(error =>(error));
    },
  },
  modules: {},
});
