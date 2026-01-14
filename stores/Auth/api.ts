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
    console.log("uploadAvatar called with URI:", avatarUri);
    
    let file: File | Blob;
    
    if (avatarUri.indexOf('blob:') === 0) {
      try {
        const response = await fetch(avatarUri);
        const blob = await response.blob();
        const isPng = blob.type.indexOf('png') !== -1;
        const fileExtension = isPng ? 'png' : 'jpg';
        const mimeType = blob.type || (fileExtension === 'png' ? 'image/png' : 'image/jpeg');
        const name = fileName || `avatar.${fileExtension}`;
        file = new File([blob], name, { type: mimeType });
        const fileInfo = file instanceof File ? `${file.name}, ${file.type}, ${file.size}` : 'File created';
        console.log("Created File from blob:", fileInfo);
      } catch (error) {
        console.error("Error converting blob to File:", error);
        throw error;
      }
    } else {
      const fileExtension = avatarUri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
      const name = fileName || `avatar.${fileExtension}`;
      
      file = {
        uri: avatarUri,
        type: mimeType,
        name: name,
      } as any;
    }
    
    const formData = new FormData();
    formData.append("avatar", file);
    
    console.log("Sending request to:", apiAuthUrl.uploadAvatar);
    
    return await axios.post(apiAuthUrl.uploadAvatar, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
