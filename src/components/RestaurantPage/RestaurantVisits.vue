<script setup>
import { ref, computed, onMounted, watch } from "vue";
import * as momentUtils from "@/utils/momentUtils";
import { useStore } from "vuex";
import userService from "@/api/userService";
import { useRouter } from "vue-router";

const props = defineProps(["visits", "numberOfPages"]);
let localVisits = ref([...props.visits]);
const emit = defineEmits(["change-page"]);
const router = useRouter();

const currentPage = ref(props.numberOfPages);

const updateChangePage = (page) => {
  currentPage.value = page;
  emit("change-page", page);
};

const vuexStore = useStore();
const isLoggedIn = computed(() => vuexStore.getters.isAuthenticated);

const fetchUserName = async (userId) => {
  try {
    const userDetails = await userService.getUser(userId);
    if (userDetails.name === " ") {
      return "Anonyme";
    } else {
      return userDetails.name;
    }
    return userDetails.name || "Utilisateur inconnu";
  } catch (error) {
    console.error(error);
    return "Erreur de récupération";
  }
};

const loadUserNames = async () => {
  if (Array.isArray(localVisits.value)) {
    for (let i = 0; i < localVisits.value.length; i++) {
      const name = await fetchUserName(localVisits.value[i].user_id);
      localVisits.value[i] = { ...localVisits.value[i], name };
    }
  } else {
    console.error("Impossible de charger les noms d'utilisateur");
  }
};

onMounted(async () => {
  await loadUserNames();
});

watch(props, async () => {
  localVisits.value = [...props.visits];
  await loadUserNames();
});

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div>
    <v-card v-if="localVisits && localVisits.length" class="text-subtitle-1">
      <v-card-title class="mt-4">Avis des visiteurs</v-card-title>

      <v-alert
        v-if="!isLoggedIn"
        type="info"
        color="light-grey"
        outlined
        class="ma-4"
      >
        Vous devez être connecté pour laisser un avis sur le restaurant !
        <v-btn class="loginButton" color="primary" @click="goToLogin"
          >Se connecter</v-btn
        >
      </v-alert>

      <v-divider></v-divider>

      <v-card-item
        v-for="visit in localVisits"
        :key="visit.id"
        class="visit-card mt-4"
      >
        <v-row class="d-flex align-center" justify="space-between">
          <v-col class="text-start" cols="6">
            <p class="text-body-2">
              {{ visit.name }}
            </p>
          </v-col>
          <v-col class="text-end" cols="6">
            <p class="text-body-2 text-grey">
              {{ momentUtils.formatDateForReview(visit.date) }}
            </p>
          </v-col>
        </v-row>

        <v-card-text class="rating">
          <v-row class="mx-0 align-center">
            <v-rating
              :model-value="visit.rating"
              color="amber"
              density="compact"
              size="small"
              half-increments
              readonly
            >
            </v-rating>

            <span class="text-grey ms-2 mt-1">
              {{ visit.rating }}
            </span>
          </v-row>

          <div class="comment mt-4 text-subtitle-1">
            <p>
              {{ visit.comment }}
            </p>
          </div>
        </v-card-text>
      </v-card-item>
    </v-card>
    <v-pagination
      v-if="props.numberOfPages > 1"
      v-model="currentPage"
      :length="props.numberOfPages"
      :total-visible="7"
      class="mt-4"
      @update:modelValue="(e) => updateChangePage(e)"
    ></v-pagination>
  </div>
</template>

<style scoped>
.visit-card {
  background-color: #f0f0f5;
  border-radius: 8px;
  margin: 20px;
}
.loginButton {
  margin-left: 20px;
}
</style>
