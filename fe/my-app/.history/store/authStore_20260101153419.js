import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { proxy } from "valtio";

const isBrowser = typeof window !== "undefined";
const authToken = isBrowser ? localStorage.getItem("jwt_token") : null;
const refreshToken = isBrowser ? localStorage.getItem("refresh_token") : null;
const username = isBrowser ? localStorage.getItem("username") : null;
const userId = isBrowser ? localStorage.getItem("userId") : null;
const role = isBrowser ? JSON.parse(localStorage.getItem("role")) : null;
export const authStore = proxy({
  isAuthenticated: authToken,
  jwtToken: authToken,
  refreshToken: refreshToken,
  role: role || null,
  username: username,
});
export const loginAction = (token, refreshToken, username, role) => {
  authStore.isAuthenticated = true;
  authStore.jwtToken = token;
  authStore.refreshToken = refreshToken;
  authStore.username = username;
  authStore.role = role;
  if (isBrowser) {
    localStorage.setItem("jwt_token", token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("username", username);
    localStorage.setItem("role", JSON.stringify(role));
  }
};
export const logoutAction = () => {
  Promise.resolve(AuthService.logout()).then(() => {
    authStore.isAuthenticated = null;
    authStore.jwtToken = null;
    authStore.refreshToken = null;
    authStore.username = null;
    authStore.role = null;

    if (isBrowser) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
    }
  });
};
