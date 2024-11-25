import store from "../store/store";
import { getCookie } from "../assets/cookie";
import routes from "../routes/routes";
import { client } from "../api/fetchClient";
import EventBus from "../EventBus";

export function logout() {
  routes.replace("/Authentication/login");
  resetTheUser();
  client.get("/user/logout");
}

export function resetTheUser() {
  store.commit("selectedChat/reset");
  store.commit("user/reset");
  store.commit("chats/reset");

  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

export function setTokenExpirationWatcher() {
  // Assuming the token expiration time is stored in the cookie
  const tokenCookie = getCookie("token");

  if (tokenCookie) {
    const expirationTime = new Date(tokenCookie).getTime(); // Parse the expiration date from the cookie
    const currentTime = new Date().getTime();
    const timeUntilExpiration = expirationTime - currentTime;

    if (timeUntilExpiration > 0) {
      setTimeout(() => {
        logout();
        EventBus.emit('notify', {duration: 5, text: 'session is expired'})
      }, timeUntilExpiration);
    } else {
      logout();
    }
  }
}
