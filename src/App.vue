<template>
  <v-app>
    <Login v-if="viewLogin"> </Login>
    <NavBar v-if="!viewLogin"/>

    <Navigation v-if="!viewLogin"/>

    <!-- Sizes your content based upon application components -->
    <v-main v-if="!viewLogin">
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
       
      </v-container>
    </v-main>
    <!-- <Footer v-if="!viewLogin" /> -->
  </v-app>
</template>
 

<script>
import NavBar from "./components/templates/NavBar.vue";
import Navigation from "./components/templates/Navigation.vue";
import Footer from "./components/templates/Footer.vue";
import HelloWorld from "./components/HelloWorld.vue";
import Login from "./views/Login.vue";


export default {
  name: "App",
  components: {
    NavBar,
    Navigation,
    HelloWorld,
    Footer,
    Login,
    
  },
  data: () => ({
   
  }),
  computed: {
    viewLogin() {
      return this.$route.path == "/login";
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  methods: {},
};
</script>
