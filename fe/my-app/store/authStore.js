import { proxy } from "valtio";

const isBrowser = typeof window !== "undefined";
const authToken = isBrowser ? localStorage.getItem("jwt_token") : null;
const refreshToken = isBrowser ? localStorage.getItem("refresh_token") : null;
const username = isBrowser ? localStorage.getItem("username") : null;
export const authStore = proxy({
  isAuthenticated: authToken,
  jwtToken: authToken,
  refreshToken: refreshToken,
  username: username,
});
export const loginAction = (token, refreshToken, username) => {
  authStore.isAuthenticated = token;
  authStore.jwtToken = token;
  authStore.refreshToken = refreshToken;
  authStore.username = username;
  localStorage.setItem("jwt_token", token);
  localStorage.setItem("refresh_token", refreshToken);
  localStorage.setItem("username", username);
};
export const logoutAction = () => {
  authStore.isAuthenticated = null;
  authStore.jwtToken = null;
  authStore.refreshToken = null;
  authStore.username = null;

  localStorage.removeItem("jwt_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
  if (isBrowser) window.location.href = "/login";
};
