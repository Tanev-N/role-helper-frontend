import createEndpoint from "@/api/api";
import axios from "axios";

const apiAuthUrl = {
  login: createEndpoint("/auth/login"),
  logout: createEndpoint("/auth/logout"),
  register: createEndpoint("/auth/register"),
};

export const apiAuth = {
  async login(username: string, password: string) {
    return await axios.post(apiAuthUrl.login, {
      username: username,
      password: password,
    });
  },
  async register(username: string, password: string, repassword: string) {
    return await axios.post(apiAuthUrl.register, {
      username: username,
      password: password,
      repassword: repassword,
    });
  },
  async logout() {
    return await axios.post(apiAuthUrl.logout);
  },
};
