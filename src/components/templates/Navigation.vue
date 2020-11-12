<template>
  <v-navigation-drawer app v-model="drawer" :mini-variant.sync="mini" permanent>
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>{{user.name}}</v-list-item-title>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="item in itemsSimple" :key="item.title" :to="item.to" color="primary">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        :prepend-icon="item.icon"
        active-class
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="child in item.items"
          :key="child.title"
          :to="child.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
              <v-icon v-text="child.icon"></v-icon>
            </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "Navigation",
  data() {
    return {
      drawer: true,
      items: [
        {
          title: "Mantenimiento",
          icon: "mdi-cogs",
          active:false,
          items: [
            { title: "Propiedades", icon:"mdi-city", to: "/properties" },
            { title: "Departamentos", icon:"mdi-home", to: "/aparments" },
            { title: "Clientes", icon:"person_add", to: "/clients" },
            { title: "Prueba", icon:"error", to: "/prueba" },
          ],
        },
      ],
      itemsSimple: [
        { title: "Dashboard", icon: "mdi-home-city", to: "/login" },
        { title: "Mi cuenta", icon: "mdi-account", to: "" },
        { title: "Usuarios", icon: "mdi-account-group", to: "" },
      ],
      mini: false,
    };
  },
  computed: {
    ...mapState(['user'])
  }
};
</script>

