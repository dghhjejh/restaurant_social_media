export const isAuthenticated = (state) => {
  const token = localStorage.getItem("authToken");
  return !!state.currentUser && !!token;
};

export const getCurrentUser = (state) => state.currentUser;

export const getAccountExists = (state) => state.accountExists;
