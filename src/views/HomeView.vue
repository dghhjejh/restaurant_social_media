<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRestaurants } from "@/composables/useRestaurants";
import { useRoute } from "vue-router";

import RestaurantFilters from "@/components/HomePage/RestaurantFilters.vue";
import RestaurantCard from "@/components/HomePage/RestaurantCard.vue";
import ModeMap from "@/components/HomePage/ModeMap.vue";

const tab = ref("one");
const route = useRoute();
const search = ref(route.query.search || "");
const loading = ref(true);
const { restaurants, specialities, priceRanges } =
  await useRestaurants(loading);
const selectedPrice = ref(null);
const selectedSpeciality = ref(null);
const filteredRestaurants = ref([]);
const paginatedRestaurants = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(12);

const totalPages = computed(() => {
  return Math.ceil(filteredRestaurants.value.length / itemsPerPage.value);
});

const updateFilteredRestaurants = async () => {
  const searchTerm = (search.value || "").toLowerCase();
  filteredRestaurants.value = restaurants.value.filter((restaurant) => {
    const matchesSearch = searchTerm
      ? restaurant.name.toLowerCase().includes(searchTerm)
      : true;

    const selectedRange = selectedPrice.value;
    const matchesPrice = selectedRange
      ? restaurant.price_range == selectedRange
      : true;

    const matchesSpeciality =
      selectedSpeciality.value && selectedSpeciality.value.length > 0
        ? selectedSpeciality.value.some(
            (speciality) =>
              restaurant.genres && restaurant.genres.includes(speciality),
          )
        : true;

    return matchesSearch && matchesPrice && matchesSpeciality;
  });

  currentPage.value = 1;
  updatePaginatedRestaurants();
};

const updatePaginatedRestaurants = () => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  paginatedRestaurants.value = filteredRestaurants.value.slice(start, end);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

watch(
  [search, selectedPrice, selectedSpeciality, restaurants],
  updateFilteredRestaurants,
);

watch(currentPage, updatePaginatedRestaurants);

updateFilteredRestaurants();

const toggleFavorite = (restaurant) => {
  restaurant.isFavorite = !restaurant.isFavorite;
};

const viewDetails = (restaurant) => {
  alert(`Détails du restaurant : ${restaurant.name}`);
};

onMounted(() => {
  search.value = route.query.search || "";
});
</script>

<template>
  <div>
    <div class="text-h3 text-center my-5">Bienvenue sur UFood</div>
    <v-container fluid>
      <v-row class="justify-center">
        <v-col cols="11">
          <v-card class="pa-5 mb-5">
            <v-row class="justify-center">
              <v-col cols="11">
                <h1 class="text-center">Filtre des restaurants</h1>
              </v-col>
            </v-row>

            <!-- Filtres -->
            <RestaurantFilters
              v-if="!loading"
              :priceRanges="priceRanges"
              :specialities="specialities"
              :search="search"
              @update:search="search = $event"
              :selectedPrice="selectedPrice"
              :selectedSpeciality="selectedSpeciality"
              @update:selectedPrice="selectedPrice = $event"
              @update:selectedSpeciality="selectedSpeciality = $event"
            />
          </v-card>

          <v-card>
            <v-tabs v-model="tab" align-tabs="center" bg-color="primary">
              <v-tab :value="one">Liste de restaurants</v-tab>
              <v-tab :value="two">Mode Map</v-tab>
            </v-tabs>

            <v-card-text>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                  <v-row>
                    <template v-if="paginatedRestaurants.length > 0">
                      <RestaurantCard
                        v-for="restaurant in paginatedRestaurants"
                        :key="restaurant.place_id"
                        :restaurant="restaurant"
                        @toggle-favorite="toggleFavorite"
                        @view-details="viewDetails"
                      />
                    </template>
                    <template v-else>
                      <v-col cols="12" class="text-center">
                        <v-alert type="info" color="red" outlined>
                          Aucun restaurant trouvé correspondant à la recherche
                          "{{ search }}"
                        </v-alert>
                      </v-col>
                    </template>
                  </v-row>
                  <v-pagination
                    v-if="totalPages > 1"
                    v-model="currentPage"
                    :length="totalPages"
                    :total-visible="7"
                    class="mt-4"
                    @input="updatePaginatedRestaurants"
                  ></v-pagination>
                </v-tabs-window-item>
                <v-tabs-window-item value="two">
                  <ModeMap :filtered-restaurants="filteredRestaurants" />
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.text-h3 {
  font-size: 1.75rem;
}
</style>
