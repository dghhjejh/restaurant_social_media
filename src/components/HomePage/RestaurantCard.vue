<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { defineProps, defineEmits } from "vue";
import { store } from "@/store";
import { useStore } from "vuex";
import { useProfile } from "@/composables/useProfile";

const vuexStore = useStore();
const isLoggedIn = computed(() => vuexStore.getters.isAuthenticated);

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const showCopiedMessage = ref(false);

const openVisitModal = () => {
  store.setCurrentAddingVisitRestaurantId(props.restaurant.id);
  store.setVisitModalOpen(true);
};

const emit = defineEmits(["toggle-favorite"]);

const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showCopiedMessage.value = true;
      setTimeout(() => {
        showCopiedMessage.value = false;
      }, 1000);
    })
    .catch((err) => {
      console.error("Erreur lors de la copie dans le presse-papiers :", err);
    });
};

const priceSymbols = computed(() => {
  return "$".repeat(props.restaurant.price_range);
});

const goToRestaurant = () => {
  router.push(`/restaurant/${props.restaurant.id}`);
};

const openFavoriteDialog = async () => {
  await useProfile(vuexStore).then(({ allFavoriteListNames }) => {
    if (allFavoriteListNames) {
      store.setCurrentAddingVisitRestaurantId(props.restaurant.id);
      store.setFavoriteLists(allFavoriteListNames.value);
      store.setFavoritesModalOpen(true);
    }
  });
};
</script>

<template>
  <v-col cols="12" sm="6" md="4" lg="3">
    <v-card>
      <v-img
        :src="props.restaurant.pictures[0]"
        alt="Image du restaurant"
        height="200"
        cover
      ></v-img>
      <v-card-subtitle class="text-center mt-2">{{
        props.restaurant.name
      }}</v-card-subtitle>
      <v-card-text>
        <div
          class="text-center address"
          :title="props.restaurant.address"
          @click="copyToClipboard(props.restaurant.address)"
        >
          {{ props.restaurant.address }}
        </div>
        <span v-if="showCopiedMessage" class="copied-message"
          >Adresse copiée !</span
        >
        <br />
        <strong>Téléphone :</strong> {{ props.restaurant.tel }} <br />
        <strong>Prix :</strong> {{ priceSymbols }} <br />
        <strong>Type :</strong> {{ props.restaurant.genres.join(", ") }}
        <br /><br />
        <v-row class="mx-0 align-center">
          <v-rating
            :model-value="props.restaurant.rating"
            color="amber"
            density="compact"
            size="medium"
            half-increments
            readonly
          ></v-rating>

          <div class="text-grey ms-2 mt-1">
            {{ Math.round(props.restaurant.rating * 100) / 100 }}
          </div>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-center">
        <span v-if="isLoggedIn">
          <v-btn icon color="error" class="mx-2" @click="openFavoriteDialog">
            <v-icon icon="mdi-heart-outline"></v-icon>
          </v-btn>
          <v-btn icon color="primary" class="mx-2" @click="openVisitModal">
            <v-icon icon="mdi-plus-circle-outline"></v-icon>
          </v-btn>
        </span>
        <v-btn icon color="secondary" class="mx-2" @click="goToRestaurant">
          <v-icon icon="mdi-information-outline"></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<style scoped>
.v-card {
  max-width: 100%;
}

.v-img {
  object-fit: cover;
}

.address {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  max-width: 100%;
  cursor: pointer;
}

.copied-message {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 3px;
  font-size: 0.8rem;
  color: #000000;
  background-color: #e0e7ff;
  border: 1px solid #606060;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
