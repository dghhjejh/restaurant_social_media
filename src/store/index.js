import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import * as actions from "./actions";
import * as getters from "./getters";
import mutations from "./mutations";

const state = {
  currentUser: null,
  currentUserFavorites: null,
  accountExists: true,
};

export default createStore({
  state,
  actions,
  getters,
  mutations,
  plugins: [createPersistedState()],
});
