<script setup>
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import gravatarService from "@/api/gravatarService";
import { useStore } from "vuex";

const store = useStore();
const isLoggedIn = computed(() => store.getters.isAuthenticated);
const currentUser = computed(() => store.getters.getCurrentUser);
const props = defineProps({
  drawerToggle: Boolean,
  isLogged: Boolean,
  username: String,
});

const emit = defineEmits(["update:drawer", "logout"]);

const localDrawer = ref(props.drawerToggle);

watch(localDrawer, (newVal) => {
  emit("update:drawer", newVal);
});

const logout = () => {
  emit("logout");
};

const getGravatarUrl = (email) => {
  return gravatarService.getGravatarUrl(email);
};
</script>

<template>
  <v-navigation-drawer temporary v-model="localDrawer" class="d-md-none">
    <v-list>
      <v-list-item v-if="isLoggedIn" id="userNameDrawer">
        <v-avatar class="user-avatar">
          <img
            :src="getGravatarUrl(currentUser.email)"
            alt="User Avatar"
            class="avatar-img"
          />
        </v-avatar>
        <span class="mr-4">{{ currentUser.name }}</span>
      </v-list-item>

      <v-list-item link to="/" exact>
        <v-icon>mdi-home</v-icon>
        <v-list-item-title>Accueil</v-list-item-title>
      </v-list-item>

      <template v-if="isLoggedIn">
        <v-list-item link to="/users">
          <v-icon>mdi-account-multiple</v-icon>
          <v-list-item-title>Utilisateurs</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/profile">
          <v-icon>mdi-account</v-icon>
          <v-list-item-title>Profil</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-icon>mdi-logout</v-icon>
          <v-list-item-title>Déconnexion</v-list-item-title>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item link to="/login">
          <v-icon>mdi-login</v-icon>
          <v-list-item-title>Connexion</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
#userNameDrawer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  font-weight: bold;
  font-size: 1.2em;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.avatar-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
