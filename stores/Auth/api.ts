import createEndpoint from "@/api/api";
import axios from "axios";

const apiAuthUrl = {
  login: createEndpoint("/auth/login"),
  logout: createEndpoint("/auth/logout"),
  register: createEndpoint("/auth/register"),
  uploadAvatar: createEndpoint("/auth/avatar"),
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
  async uploadAvatar(avatarUri: string, fileName?: string) {
    const formData = new FormData();
    // В React Native FormData принимает объект с uri, type и name
    const fileExtension = avatarUri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
    const name = fileName || `avatar.${fileExtension}`;
    
    formData.append("avatar", {
      uri: avatarUri,
      type: mimeType,
      name: name,
    } as any);
    
    return await axios.post(apiAuthUrl.uploadAvatar, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
