<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import userService from "@/api/userService";
import { useProfile } from "@/composables/useProfile";
import gravatarService from "@/api/gravatarService";
import { useStore } from "vuex";

const userStore = useStore();
const route = useRoute();
const router = useRouter();
const user = ref(null);
const userId = ref(route.query.id || "");
const userDetails = ref(null);
const isFollowing = ref(false);
const activeUserId = ref("");
const avatarSize = ref(200);
const { currentUser } = await useProfile(userStore);

const fetchUser = async (userId) => {
  try {
    user.value = await userService.getUser(userId);
  } catch (error) {
    console.error(error);
    user.value = null;
  }
};

const fetchUserDetails = async () => {
  try {
    const activeUser = await userService.getUser(activeUserId.value);
    userDetails.value = await userService.getUser(userId.value);
    isFollowing.value = activeUser.following.some(
      (user) => user.id === userId.value,
    );
  } catch (error) {
    alert("Erreur lors de la récupération des détails de l'utilisateur.");
    console.error(error);
  }
};

const followUser = async () => {
  try {
    await userService.followUser(userId.value);
    isFollowing.value = true;
  } catch (error) {
    alert("Erreur lors du suivi de l'utilisateur.");
    console.error(error);
  }
};

const getGravatarUrl = (email) => {
  return gravatarService.getGravatarUrl(email);
};

const unfollowUser = async () => {
  try {
    await userService.removeFollow(userId.value);
    isFollowing.value = false;
  } catch (error) {
    alert("Erreur lors de l'annulation du suivi.");
    console.error(error);
  }
};

onMounted(async () => {
  activeUserId.value = currentUser.value.id;
  const userId = route.query.id;
  if (!userId) {
    router.push("/users");
    return;
  }

  await fetchUser(userId);

  if (!user.value.name) {
    router.push("/users");
  }
  await fetchUserDetails();
});

const updateAvatarSize = () => {
  if (window.innerWidth < 600) {
    avatarSize.value = 100;
  } else {
    avatarSize.value = 200;
  }
};

window.addEventListener("resize", updateAvatarSize);
onMounted(updateAvatarSize);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <h3>Détails de l'utilisateur</h3>
        <v-card>
          <v-row>
            <v-col cols="12" md="6">
              <v-card-title>
                {{ userDetails?.name }}
              </v-card-title>
              <!--              <v-card-subtitle>ID : {{ userDetails?.id }}</v-card-subtitle>-->
              <v-card-text>
                <p>{{ userDetails?.email }}</p>
                <p>Nombre d'abonnés : {{ userDetails?.followers.length }}</p>
                <p>Personnes suivies : {{ userDetails?.following.length }}</p>
                <br />
                <h4 class="text-left">
                  Score:
                  {{ userDetails?.rating }}
                  <v-icon color="amber" class="ms-2">mdi-star-shooting</v-icon>
                </h4>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="!isFollowing"
                  color="primary"
                  @click="followUser"
                  :disabled="userDetails?.id === activeUserId"
                >
                  Suivre
                </v-btn>
                <v-btn
                  v-else
                  color="red"
                  @click="unfollowUser"
                  :disabled="userDetails?.id === activeUserId"
                >
                  Ne plus suivre
                </v-btn>
              </v-card-actions>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-center align-center">
              <v-avatar :size="avatarSize" class="user-avatar">
                <img
                  :src="getGravatarUrl(userDetails?.email)"
                  alt="User Avatar"
                  class="avatar-img"
                />
              </v-avatar>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
h3 {
  margin-bottom: 20px;
}

.user-avatar {
  margin: auto;
}

.avatar-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
