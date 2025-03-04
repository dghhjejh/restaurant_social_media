import { computed, ref } from "vue";
import favoriteService from "@/api/favoriteService";
import visitService from "@/api/visitService";
import restaurantService from "@/api/restaurantService";
import { store } from "@/store";

export async function useProfile(userStore) {
  const userRecentVisits = ref([]);
  const allRestaurantNames = ref([]);
  const allFavoriteListNames = ref([]);

  let currentUser = computed(() => userStore.getters.getCurrentUser);
  userStore.dispatch("updateConnectedUser", currentUser.value.id);
  currentUser = computed(() => userStore.getters.getCurrentUser);

  const getUserRecentVisits = async () => {
    try {
      const visits = await visitService.getRecentVisits(
        currentUser.value.id,
        0,
      );
      userRecentVisits.value = visits;
    } catch (e) {
      console.error(e);
    }
  };

  const getUserFavoriteLists = async () => {
    const lists = await favoriteService.getUserFavorites(
      currentUser.value.id,
      0,
    );

    for (const list of lists) {
      list.restaurants = await Promise.all(
        list.restaurants.map(async (restaurant) => {
          const detailsResponse = await restaurantService.getRestaurant(
            restaurant.id,
          );
          return detailsResponse;
        }),
      );
    }

    store.setCurrentUserFavorites(lists);
  };

  const getAllRestaurantNames = async () => {
    try {
      const response = await restaurantService.getRestaurants(0);

      const filteredRestaurants = response
        .filter((restaurant) => restaurant.name && restaurant.id)
        .map((restaurant) => ({
          name: restaurant.name,
          id: restaurant.id,
        }));

      allRestaurantNames.value = filteredRestaurants;
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurants :", error);
    }
  };

  const getAllFavoriteListNames = async () => {
    try {
      const response = await favoriteService.getUserFavorites(
        currentUser.value.id,
      );
      const filteredLists = response
        .filter((List) => List.name && List.id)
        .map((List) => ({
          id: List.id,
          name: List.name,
        }));
      allFavoriteListNames.value = filteredLists;
      const listNames = allFavoriteListNames.value.map((list) => list.name);
    } catch (error) {
      console.error("Erreur lors de la récupération des lests :", error);
    }
  };

  await getUserRecentVisits();
  await getUserFavoriteLists();
  await getAllRestaurantNames();
  await getAllFavoriteListNames();

  return {
    currentUser,
    userRecentVisits,
    allRestaurantNames,
    allFavoriteListNames,
  };
}
