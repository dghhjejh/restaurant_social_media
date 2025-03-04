<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProfile } from "@/composables/useProfile";
import UserList from "@/components/UserPage/UserList.vue";
import { useStore } from "vuex";

const userStore = useStore();
const searchQuery = ref("");
const { currentUser } = await useProfile(userStore);

const route = useRoute();

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    searchQuery.value = event.target.value;
  }
};

onMounted(() => {
  searchQuery.value = route.query.q || "";
});
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="searchQuery"
            label="Rechercher un utilisateur"
            append-icon="mdi-magnify"
            @keypress="handleKeyPress"
            @click:append="handleKeyPress"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <UserList :searchQuery="searchQuery" :currentUser="currentUser" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
