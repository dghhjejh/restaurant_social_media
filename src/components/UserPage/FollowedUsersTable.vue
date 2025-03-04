<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userService from "@/api/userService";
import gravatarService from "@/api/gravatarService";

const props = defineProps({
  currentUser: Object,
});

const followedUsers = ref([]);
const headers = ref([
  { title: "", key: "gravatar", sortable: false },
  { title: "Nom de l'utilisateur", key: "name" },
  { title: "Courriel", key: "email" },
  { title: "Actions", key: "actions", sortable: false },
]);

const router = useRouter();

const fetchFollowedUsers = async () => {
  try {
    const user = await userService.getUser(props.currentUser.id);
    followedUsers.value = user.following;
  } catch (error) {
    alert("Une erreur s'est produite lors de la récupération des données.");
    console.error(error);
  }
};

const unfollowUser = async (userId) => {
  try {
    await userService.removeFollow(userId);
    followedUsers.value = followedUsers.value.filter(
      (user) => user.id !== userId,
    );
  } catch (error) {
    alert("Une erreur s'est produite lors de l'annulation du suivi.");
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
  await fetchFollowedUsers();
});
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="followedUsers"
    item-value="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <h2 class="table-title">UFooders suivis</h2>
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
      <v-btn color="red" icon @click="unfollowUser(item.id)">
        <v-icon>mdi-account-minus</v-icon>
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
