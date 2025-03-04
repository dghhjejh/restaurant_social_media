import apiClient from "@/utils/apiClient";
import restaurantService from "@/api/restaurantService";

export default {
  async getRecentVisits(userId, limit = 10, page = 0) {
    try {
      const response = await apiClient.get(
        `/users/${userId}/restaurants/visits`,
        {
          params: { limit, page },
        },
      );

      const restaurantVisits = {};
      for (const visit of response.data.items) {
        const restaurantId = visit.restaurant_id;

        if (!restaurantVisits[restaurantId]) {
          const restaurantDetails =
            await restaurantService.getRestaurant(restaurantId);
          restaurantVisits[restaurantId] = {
            restaurant_id: restaurantId,
            name: restaurantDetails.name,
            rating: parseFloat(restaurantDetails.rating.toFixed(2)),
            visits: 1,
          };
        } else {
          restaurantVisits[restaurantId].visits += 1;
        }
      }

      return Object.values(restaurantVisits);
    } catch (error) {
      console.error("Error fetching recent visits:", error);
      throw error;
    }
  },
  createVisit(userId, visitData) {
    try {
      return apiClient.post(`/users/${userId}/restaurants/visits`, visitData);
    } catch (error) {
      console.error("Erreur lors de la création de la visite :", error);
      throw error;
    }
  },
  async getVisitsForRestaurant(userId, restaurantId, limit = 10, page = 0) {
    let restaurantVisitsOfUser = [];

    try {
      const response = await apiClient.get(
        `/users/${userId}/restaurants/${restaurantId}/visits`,
        { params: { limit, page } },
      );

      if (response.status !== 200) {
        throw new Error(
          "Restaurant visits for specified user were not found, please try again.",
        );
      }

      restaurantVisitsOfUser = response.data.items;
    } catch (e) {
      console.error(e);
    } finally {
      return restaurantVisitsOfUser;
    }
  },
};
