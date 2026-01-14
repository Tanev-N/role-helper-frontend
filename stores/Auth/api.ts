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
    
    let file: File | Blob | any;
    
    // Проверяем, это blob URI (веб) или file/content URI (мобильный)
    if (avatarUri.indexOf('blob:') === 0) {
      // Для веба: преобразуем blob URI в File
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
      // Для мобильных платформ: используем объект с uri, type и name
      let fileExtension = 'jpg';
      let mimeType = 'image/jpeg';
      
      if (fileName) {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
          fileExtension = ext === 'jpeg' ? 'jpg' : ext;
          mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
        }
      } else {
        const uriExt = avatarUri.split('.').pop()?.toLowerCase();
        if (uriExt === 'png' || uriExt === 'jpg' || uriExt === 'jpeg') {
          fileExtension = uriExt === 'jpeg' ? 'jpg' : uriExt;
          mimeType = uriExt === 'png' ? 'image/png' : 'image/jpeg';
        }
      }
      
      const name = fileName || `avatar.${fileExtension}`;
      
      file = {
        uri: avatarUri,
        type: mimeType,
        name: name,
      };
      console.log("Created file object for mobile:", file);
    }
    
    const formData = new FormData();
    formData.append("avatar", file);
    
    console.log("Sending request to:", apiAuthUrl.uploadAvatar);
    
    // Для мобильных устройств не устанавливаем Content-Type явно,
    // чтобы axios автоматически установил правильный boundary
    const headers: any = {};
    
    // Для веба устанавливаем Content-Type явно
    if (avatarUri.indexOf('blob:') === 0) {
      headers["Content-Type"] = "multipart/form-data";
    }
    
    return await axios.post(apiAuthUrl.uploadAvatar, formData, {
      headers,
    });
  },
};
