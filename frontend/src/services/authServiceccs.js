import api from "../libs/axios.js";

export const authService = {
  signUp: async (firstName, lastName, username, email, password) => {
    const res = await api.post(
      "/auth/signup",
      { firstName, lastName, username, email, password },
      { withCredentials: true },
    );
    return res.data;
  },
  signIn: async (username, password) => {
    const res = await api.post(
      "/auth/signin",
      { username, password },
      { withCredentials: true },
    );
    return res.data;
  },
  signOut: async () => {
    return api.post("/auth/signout", {}, {withCredentials: true})
  },
  fetchMe: async () => {
    const res = await api.get("/user/me", {withCredentials: true})
    return res.data.user
  },
  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true })
    return res.data.accessToken
  }
};
