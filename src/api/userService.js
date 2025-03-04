import apiClient from "@/utils/apiClient";

export default {
  async getUser(userId) {
    let user = {};

    try {
      const response = await apiClient.get(`/users/${userId}`);

      if (response.status !== 200) {
        throw new Error("User was not found, please try again.");
      }

      user = response.data;
    } catch (e) {
      console.error(e);
    } finally {
      return user;
    }
  },
  async followUser(userId) {
    let responseStatus;

    try {
      const response = await apiClient.post("/follow", { id: userId });

      if (response.status !== 201) {
        throw new Error("User follow failed, please try again.");
      }

      responseStatus = response.status;
    } catch (e) {
      console.error("Error following user:", e);
      throw e;
    } finally {
      return responseStatus;
    }
  },
  async removeFollow(userId) {
    let responseStatus;

    try {
      const response = await apiClient.delete(`/follow/${userId}`);

      if (response.status !== 200) {
        throw new Error("User unfollow failed, please try again.");
      }

      responseStatus = response.status;
    } catch (e) {
      console.error(e);
    } finally {
      return responseStatus;
    }
  },

  async searchUsers(query, limit = 100, page = 0) {
    let users = [];
    try {
      const response = await apiClient.get("/users", {
        params: { q: query, limit, page },
      });
      if (response.status !== 200) {
        throw new Error("Search failed, please try again.");
      }
      users = response.data.items;
    } catch (e) {
      console.error(e);
    } finally {
      return users;
    }
  },
};
