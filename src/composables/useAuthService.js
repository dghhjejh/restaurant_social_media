import authentificationService from "@/api/authentificationService";
import { config } from "@/config";
import apiClient from "@/utils/apiClient";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export function useAuthService() {
  const store = useStore();
  const router = useRouter();

  const setCurrentUser = async (userInfo = null) => {
    if (userInfo) {
      store.dispatch("setConnectedUser", userInfo);
      localStorage.setItem("authToken", userInfo.token);
      localStorage.setItem("refreshToken", userInfo.refreshToken);
      router.push({ name: "Profile" });
    } else if (userInfo == null) {
      store.dispatch("setConnectedUser", null);
      apiClient.defaults.baseURL = `${config.apiUrl}/unsecure`;
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      router.push({ name: "Home" });
    } else {
      store.dispatch("setAccountExists", false);
    }
  };

  const login = async (userEmail, userPassword) => {
    let formData = new URLSearchParams();
    formData.append("email", userEmail);
    formData.append("password", userPassword);

    const userConnected = await authentificationService.login(formData);
    setCurrentUser(userConnected);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Refresh token absent");

    const formData = new URLSearchParams();
    formData.append("refresh_token", refreshToken);

    const refreshedData = await authentificationService.refreshToken(formData);
    localStorage.setItem("authToken", refreshedData.token);
  };

  const signup = async (name, email, password) => {
    try {
      let formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      await authentificationService.signup(formData);
    } catch (error) {
      throw new Error("Un compte existe déjà avec cette adresse e-mail.");
    }
  };

  const logout = () => {
    setCurrentUser();
  };

  return { login, signup, logout, refreshAccessToken };
}
