export default {
  setConnectedUser(state, userInfo) {
    state.currentUser = userInfo;
  },
  setAccountExists(state, accountExists) {
    state.accountExists = accountExists;
  },
};
