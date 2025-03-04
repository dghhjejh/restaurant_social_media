import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index";
import apiClient from "@/utils/apiClient";
import { config } from "@/config";

import HomeView from "@/views/HomeView";
import RestaurantView from "@/views/RestaurantView";
import ProfileView from "@/views/ProfileView";
import LoginView from "@/views/LoginView.vue";
import UserView from "@/views/UserView";
import UserDetailView from "@/views/UserDetailView";
import RegisterView from "@/views/RegisterView.vue";

const checkRestaurantExists = async (to, from, next) => {
  const restaurantId = to.params.restaurantId;
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}`);
    if (response.status === 200) {
      next();
    } else {
      next("/");
    }
  } catch (error) {
    next("/");
  }
};

const routes = [
  {
    path: "/restaurant/:restaurantId",
    name: "Restaurant",
    component: RestaurantView,
    beforeEnter: checkRestaurantExists,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: { guest: true },
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/users",
    name: "Users",
    component: UserView,
    meta: { requiresAuth: true },
  },
  {
    path: "/user-detail",
    name: "UserDetailView",
    component: UserDetailView,
    props: (route) => ({ id: route.query.id }),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  store.dispatch("setAccountExists", true);

  const token = localStorage.getItem("authToken");
  const isAuthenticated = store.getters.isAuthenticated;

  if (isAuthenticated && !token) {
    store.dispatch("logout");
    next("/login");
    return;
  } else if (!isAuthenticated) {
    apiClient.defaults.baseURL = `${config.apiUrl}/unsecure`;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated && token) {
      next();
    } else {
      next("/login");
    }
    return;
  }

  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/profile");
    } else {
      next();
    }
    return;
  }

  next();
});

export default router;
