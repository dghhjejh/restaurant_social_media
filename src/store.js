import { reactive } from "vue";
import favoriteService from "@/api/favoriteService";

export const store = reactive({
  currentUserFavorites: null,
  visitModalOpen: false,
  readOnlyVisitModal: false,
  visitModalContent: {
    comment: "",
    rating: 0,
    selectedDate: null,
    selectedTime: null,
  },
  favoritesModalOpen: false,
  currentAddingVisitRestaurantId: "",
  currentAddingVisitRestaurantVisits: [],

  favoriteLists: [],
  isFavoriteDialogOpen: false,

  setFavoriteLists(lists) {
    this.favoriteLists = lists;
  },

  async handleAddToFavorites({ restaurantId, listId }) {
    try {
      const favoriteList = await favoriteService.getFavoriteList(listId);
      const isRestaurantInList = favoriteList.restaurants.some(
        (restaurant) => restaurant.id === restaurantId,
      );
      if (isRestaurantInList) {
        return;
      }

      await favoriteService.addRestaurantToFavoriteList(listId, restaurantId);
    } catch (error) {
      console.error("Error adding restaurant to favorites:", error);
    }
  },
  handleVisitSubmittedFunction: () => {},
  setCurrentUserFavorites(newFavorites) {
    this.currentUserFavorites = newFavorites;
  },
  setVisitModalOpen(value) {
    this.visitModalOpen = value;
  },
  setReadOnlyVisitModal(value) {
    this.readOnlyVisitModal = value;
  },
  setVisitModalContent(value) {
    this.visitModalContent = value;
  },
  setFavoritesModalOpen(value) {
    this.favoritesModalOpen = value;
  },
  setCurrentAddingVisitRestaurantId(restaurantId) {
    this.currentAddingVisitRestaurantId = restaurantId;
  },
  setCurrentAddingVisitRestaurantVisits(visits) {
    this.currentAddingVisitRestaurantVisits = visits;
  },
  setHandleVisitSubmittedFunction(handleVisitSubmittedFunction) {
    this.handleVisitSubmittedFunction = handleVisitSubmittedFunction;
  },
});
