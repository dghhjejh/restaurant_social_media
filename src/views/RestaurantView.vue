<script setup>
import { useRestaurant } from "@/composables/useRestaurant";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import { store } from "@/store";
import { useStore } from "vuex";
import { useProfile } from "@/composables/useProfile";

import InteractiveMap from "@/components/RestaurantPage/InteractiveMap";
import RestaurantVisits from "@/components/RestaurantPage/RestaurantVisits.vue";
import FavoritesDialog from "@/components/Modals/FavoritesDialog.vue";
import restaurantService from "@/api/restaurantService";

const router = useRouter();
const vuexStore = useStore();
const isLoggedIn = computed(() => vuexStore.getters.isAuthenticated);
const currentUser = computed(() => vuexStore.getters.getCurrentUser);
const route = useRoute();
const currentRestaurantId = route.params.restaurantId;
const { restaurant, similarRestaurants, numberOfPages } =
  await useRestaurant(currentRestaurantId);
const visits = ref(
  await restaurantService.getRestaurantVisits(
    restaurant.value.id,
    10,
    numberOfPages.value,
  ),
);

const emits = defineEmits(["changePage"]);

const openFavoriteDialog = async () => {
  await useProfile(vuexStore).then(({ allFavoriteListNames }) => {
    store.setFavoriteLists(allFavoriteListNames.value);
    store.setFavoritesModalOpen(true);
  });
};
const openVisitModal = () => {
  store.setCurrentAddingVisitRestaurantId(restaurant.value.id);
  store.setCurrentAddingVisitRestaurantVisits(visits.value);
  store.setVisitModalOpen(true);
};
const handleVisitSubmitted = (visitData) => {
  visitData.user_id = currentUser.value.id;
  visits.value.items.unshift(visitData);
};

store.setHandleVisitSubmittedFunction(handleVisitSubmitted);
const handleChangePage = async (pageId) => {
  visits.value = await restaurantService.getRestaurantVisits(
    restaurant.value.id,
    10,
    pageId,
  );
  console.log(visits.value);
  console.log("From restaurant view Page changed to: ", pageId);
};
const load = ({ done }) => {
  done("empty");
};
const goToRestaurant = (restaurantId) => {
  router.push(`/restaurant/${restaurantId}`);
};
</script>

<template>
  <v-col>
    <v-row>
      <v-col cols="12" md="6">
        <v-card :restaurant="restaurant" class="mx-auto" height="100%">
          <v-carousel :show-arrows="false" cycle hide-delimiters height="70vh">
            <v-carousel-item
              v-for="(restaurantPicture, index) in restaurant.pictures"
              :key="index"
              :src="restaurantPicture"
              cover
            ></v-carousel-item>
          </v-carousel>

          <v-card-item>
            <v-card-title>{{ restaurant.name }}</v-card-title>

            <v-card-subtitle>
              <a :href="`tel:${restaurant.cleanedTel}`">{{ restaurant.tel }}</a>
            </v-card-subtitle>
            <v-card-subtitle>
              {{ restaurant.address }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text class="pb-2">
            <v-row class="mx-0 align-center">
              <v-rating
                :model-value="restaurant.rating"
                color="amber"
                density="compact"
                size="small"
                half-increments
                readonly
              ></v-rating>

              <div class="text-grey ms-2 mt-1">
                {{ Math.round(restaurant.rating * 100) / 100 }}
              </div>
            </v-row>

            <div class="mt-4 text-subtitle-1">
              <p v-for="n in restaurant.price_range" :key="n">$</p>
              •
              <p v-for="(genre, index) in restaurant.genres" :key="index">
                {{ genre
                }}<span v-if="index != restaurant.genres.length - 1">/</span>
              </p>
            </div>

            <v-card-actions class="justify-center">
              <span v-if="isLoggedIn">
                <v-btn
                  icon
                  color="error"
                  class="mx-2"
                  @click="openFavoriteDialog"
                >
                  <v-icon icon="mdi-heart-outline"></v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="primary"
                  class="mx-2"
                  @click="openVisitModal"
                >
                  <v-icon icon="mdi-plus-circle-outline"></v-icon>
                </v-btn>
              </span>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Horaire hebdomadaire</v-card-title>

              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">Jour</th>
                    <th class="text-left">Heures</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(hours, day, index) in restaurant.opening_hours"
                    :key="index"
                  >
                    <td>
                      <p>{{ day }}</p>
                    </td>
                    <td>{{ hours }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
          <v-col v-if="similarRestaurants.length > 0">
            <v-card height="340">
              <v-card-title>Restaurants similaires</v-card-title>

              <v-divider></v-divider>

              <v-infinite-scroll height="292" @load="load" empty-text="">
                <v-list-item
                  v-for="(restaurant, index) in similarRestaurants"
                  :key="index"
                >
                  <template v-slot:prepend>
                    <v-card-actions class="mr-2">
                      <v-btn
                        density="compact"
                        icon
                        color="secondary"
                        @click="goToRestaurant(restaurant.id)"
                      >
                        <v-icon icon="mdi-information-outline"></v-icon>
                      </v-btn>
                    </v-card-actions>
                  </template>
                  {{ restaurant.name }}
                </v-list-item>
              </v-infinite-scroll>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card width="100%">
              <InteractiveMap
                :longitude="restaurant.location.coordinates[0]"
                :latitude="restaurant.location.coordinates[1]"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="visits.items.length > 0">
      <v-col>
        <RestaurantVisits
          :visits="visits.items"
          @change-page="handleChangePage"
          :numberOfPages="numberOfPages"
        />
      </v-col>
    </v-row>
    <FavoritesDialog
      :isOpen="store.isFavoriteDialogOpen"
      :favoriteLists="store.favoriteLists"
      :restaurantId="restaurant.id"
      @close="store.setFavoritesModalOpen(false)"
      @add-to-favorites="store.handleAddToFavorites"
    />
  </v-col>
</template>

<style scoped>
p {
  display: inline-block;
}

p::first-letter {
  text-transform: capitalize;
}

th {
  font-weight: bold !important;
}
</style>
