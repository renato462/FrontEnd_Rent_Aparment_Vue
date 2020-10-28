import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import Vuelidate from 'vuelidate'
import VueSweetalert2 from 'vue-sweetalert2';
import axios from 'axios'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

axios.defaults.baseURL="http://localhost:3000/api/"


Vue.use(Vuelidate);
Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
