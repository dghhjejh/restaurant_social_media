<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userService from "@/api/userService";
import gravatarService from "@/api/gravatarService";

const props = defineProps({
  currentUser: Object,
});

const followers = ref([]);
const followedUsers = ref([]);
const headers = ref([
  { title: "", key: "gravatar", sortable: false },
  { title: "Nom de l'utilisateur", key: "name" },
  { title: "Courriel", key: "email" },
  { title: "Actions", key: "actions", sortable: false },
]);

const router = useRouter();

const fetchFollowers = async () => {
  try {
    const user = await userService.getUser(props.currentUser.id);
    followers.value = user.followers;
    followedUsers.value = user.following;
  } catch (error) {
    alert("Une erreur s'est produite lors de la récupération des données.");
    console.error(error);
  }
};

const followUser = async (userId) => {
  try {
    await userService.followUser(userId);
    const user = await userService.getUser(userId);
    followedUsers.value.push(user);
  } catch (error) {
    alert("Une erreur s'est produite lors du suivi de l'utilisateur.");
    console.error(error);
  }
};

const goToUserDetail = (userId) => {
  router.push({ name: "UserDetailView", query: { id: userId } });
};

const getGravatarUrl = (email) => {
  return gravatarService.getGravatarUrl(email);
};

onMounted(async () => {
  await fetchFollowers();
});
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="followers"
    item-value="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <h2 class="table-title">Mes abonnés</h2>
    </template>

    <template v-slot:[`item.gravatar`]="{ item }">
      <v-avatar class="user-avatar">
        <img
          :src="getGravatarUrl(item.email)"
          alt="User Avatar"
          class="avatar-img"
        />
      </v-avatar>
    </template>

    <template v-slot:[`item.name`]="{ item }">
      <a href="#" @click.prevent="goToUserDetail(item.id)">{{ item.name }}</a>
    </template>

    <template v-slot:[`item.email`]="{ item }">
      <a href="#" @click.prevent="goToUserDetail(item.id)">{{ item.email }}</a>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        v-if="!followedUsers.some((user) => user.id === item.id)"
        color="primary"
        icon
        @click="followUser(item.id)"
      >
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn v-else color="grey" icon>
        <v-icon color="green">mdi-account-check</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>
.user-avatar {
  margin: auto;
}

.avatar-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.table-title {
  margin-left: 20px;
}
</style>
