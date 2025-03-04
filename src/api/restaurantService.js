import apiClient from "@/utils/apiClient";

export default {
  async getRestaurants(
    limit = 10,
    page = 0,
    q = null,
    genres = null,
    price_range = null,
    lon = null,
    lat = null,
  ) {
    let restaurants = [];
    let queryParams = { limit, page };

    if (q) queryParams.q = q;
    if (genres) queryParams.genres = genres;
    if (price_range) queryParams.price_range = price_range;
    if (lon && lat) {
      queryParams.lon = lon;
      queryParams.lat = lat;
    }

    try {
      const response = await apiClient.get("/restaurants", {
        params: queryParams,
      });

      if (response.status !== 200) {
        throw new Error("Restaurants were not found, please try again.");
      }

      restaurants = response.data.items;
    } catch (error) {
      console.error(error);
    } finally {
      return restaurants;
    }
  },

  async getRestaurant(restaurantId) {
    let restaurant = {};

    try {
      const response = await apiClient.get(`/restaurants/${restaurantId}`);

      if (response.status !== 200) {
        throw new Error("Restaurant was not found, please try another one.");
      }

      restaurant = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      return restaurant;
    }
  },

  async getRestaurantVisits(restaurantId, limit = 10, page = 0) {
    let restaurantVisits = [];

    try {
      const response = await apiClient.get(
        `/restaurants/${restaurantId}/visits`,
        { params: { limit, page } },
      );

      if (response.status !== 200) {
        throw new Error("Restaurant visits were not found, please try again.");
      }

      let orderedList = response.data;
      orderedList.items.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      orderedList.items = orderedList.items.filter(
        (visit) => new Date(visit.date) <= new Date(),
      );

      restaurantVisits = orderedList;
    } catch (error) {
      console.error(error);
    } finally {
      return restaurantVisits;
    }
  },
};
