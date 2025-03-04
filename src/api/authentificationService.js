import { config } from "@/config";
import apiClient from "@/utils/apiClient";

export default {
  async login(formData) {
    let user = {};

    try {
      apiClient.defaults.baseURL = config.apiUrl;
      const response = await apiClient.post(`/login`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to login, please try again.");
      }

      user = response.data;
    } catch (e) {
      apiClient.defaults.baseURL = `${config.apiUrl}/unsecure`;
      user = false;
    } finally {
      return user;
    }
  },

  async signup(formData) {
    try {
      apiClient.defaults.baseURL = config.apiUrl;
      const response = await apiClient.post(`/signup`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.status !== 200) {
        throw new Error("Un compte existe déjà avec cette adresse e-mail.");
      }
      return response.data;
    } catch (e) {
      throw new Error("Un compte existe déjà avec cette adresse e-mail.");
    }
  },
};
