import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Properties from "../components/Properties.vue";
import Aparments from "../components/Aparments.vue";
import Prueba from "../components/Prueba.vue";
import Error from "../views/Error.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/properties",
    name: "Property",
    component: Properties,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/aparments",
    name: "Aparment",
    component: Aparments,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/prueba",
    name: "Prueba",
    component: Prueba,
    
  },

  { path: '*', component: Error }
  // {
  //   path: '/property/new',
  //   name: 'Property',
  //   component: () => import('../views/properties/Property.vue')
  // },
  // {
  //   path: '/properties',
  //   name: 'Properties',
  //   component: () => import('../views/properties/Properties.vue')
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.state.user) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

export default router;
