import { defineStore } from "pinia";
import authService from "../services/authService";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("userData") || "null"),
    token: localStorage.getItem("userToken") || "",
    lastActivity: localStorage.getItem("userLastActivity") || Date.now(),
  }),

  getters: {
    isLoggedIn: (state) => {
      return !!(state.token && state.user)
    },
  },

  actions: {
    async login(email, password) {
      try {
        const res = await authService.loginUser(email, password);
        localStorage.setItem("userToken", res.token);
        localStorage.setItem("userData", JSON.stringify(res.user));
        localStorage.setItem("userLastActivity", Date.now().toString());
        this.token = res.token;
        this.user = res.user;
        this.lastActivity = Date.now();
        return res;
      } catch (error) {
        throw error;
      }
    },

    async register(data) {
      try {
        const res = await authService.registerUser(data);
        localStorage.setItem("userToken", res.token);
        localStorage.setItem("userData", JSON.stringify(res.user));
        localStorage.setItem("userLastActivity", Date.now().toString());
        this.token = res.token;
        this.user = res.user;
        this.lastActivity = Date.now();
        return res;
      } catch (error) {
        throw error;
      }
    },

    logout() {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userLastActivity");
      this.user = null;
      this.token = "";
      this.lastActivity = 0;
    },

    updateActivity() {
      const now = Date.now();
      localStorage.setItem("userLastActivity", now.toString());
      this.lastActivity = now;
    },

    initialize() {
      try {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");
        if (token && userData) {
          this.token = token;
          this.user = JSON.parse(userData);
          this.lastActivity = parseInt(localStorage.getItem("userLastActivity") || Date.now().toString());
        } else {
          this.user = null;
          this.token = "";
          this.lastActivity = 0;
        }
      } catch (error) {
        console.error('User store initialization error:', error);
      }
    }
  }
});