import apiClient from "@/utils/apiClient";
import restaurantService from "@/api/restaurantService";

export default {
  async getUserFavorites(userId, limit = 100, page = 0) {
    let userFavorites = [];

    try {
      const response = await apiClient.get(`/users/${userId}/favorites`, {
        params: { limit, page },
      });

      if (response.status !== 200) {
        throw new Error("User favorites were not found, please try again.");
      }

      userFavorites = response.data.items;
    } catch (e) {
      console.error(e);
    } finally {
      return userFavorites;
    }
  },
  async getFavoriteList(favoriteListId) {
    let favoriteList = {};

    try {
      const response = await apiClient.get(`/favorites/${favoriteListId}`);

      if (response.status !== 200) {
        throw new Error("Favorite list was not found, please try again.");
      }

      favoriteList = response.data;
    } catch (e) {
      console.error(e);
    } finally {
      return favoriteList;
    }
  },
  async createFavoriteList(listName, listOwner = null) {
    let createdList = {};
    let data = {};

    try {
      data.name = listName;
      if (listOwner) data.owner = listOwner;

      console.log(data);

      const response = await apiClient.post("/favorites", data);

      if (response.status !== 201) {
        throw new Error("Favorite list was not created, please try again.");
      }

      createdList = response.data;
    } catch (e) {
      console.error(e);
    } finally {
      return createdList;
    }
  },
  async updateFavoriteList(listId, newListName, listOwner = null) {
    let updatedList = {};
    let data = {};

    try {
      data.name = newListName;
      if (listOwner) data.owner = listOwner;

      const response = await apiClient.put(`/favorites/${listId}`, data);

      if (response.status !== 200) {
        throw new Error("Favorite list was not updated, please try again.");
      }

      updatedList = response.data.items;
    } catch (e) {
      console.error(e);
    } finally {
      return updatedList;
    }
  },
  async deleteFavoriteList(listId) {
    let responseStatus;

    try {
      const response = await apiClient.delete(`/favorites/${listId}`);

      if (response.status !== 200) {
        throw new Error("Favorite list was not deleted, please try again.");
      }

      responseStatus = response.status;
    } catch (e) {
      console.error(e);
    } finally {
      return responseStatus;
    }
  },
  async addRestaurantToFavoriteList(listId, restaurantId) {
    let updatedFavoriteList = [];

    try {
      const response = await apiClient.post(
        `/favorites/${listId}/restaurants`,
        { id: restaurantId },
      );

      if (response.status !== 200) {
        throw new Error(
          "Restaurant was not added to favorite list, please try again.",
        );
      }

      updatedFavoriteList = response.data;

      updatedFavoriteList.restaurants = await Promise.all(
        updatedFavoriteList.restaurants.map(async (restaurant) => {
          const detailsResponse = await restaurantService.getRestaurant(
            restaurant.id,
          );
          return detailsResponse;
        }),
      );
    } catch (e) {
      console.error(e);
    } finally {
      return updatedFavoriteList;
    }
  },
  async removeRestaurantFromFavoriteList(listId, restaurantId) {
    let updatedFavoriteList;

    try {
      const response = await apiClient.delete(
        `/favorites/${listId}/restaurants/${restaurantId}`,
      );

      if (response.status !== 200) {
        throw new Error(
          "Restaurant was not removed from favorite list, please try again.",
        );
      }

      updatedFavoriteList = response.data;

      updatedFavoriteList.restaurants = await Promise.all(
        updatedFavoriteList.restaurants.map(async (restaurant) => {
          const detailsResponse = await restaurantService.getRestaurant(
            restaurant.id,
          );
          return detailsResponse;
        }),
      );
    } catch (e) {
      console.error(e);
    } finally {
      return updatedFavoriteList;
    }
  },
};
