import { createEndpointML } from "@/api/api";
import axios from "axios";

const apiImageUrl = {
  generateImage: createEndpointML("/image"),
  getImage(id: string) {
    return createEndpointML("/image/" + id);
  },
};

interface GenerateImageResponse {
  status: number;
  data: {
    img_id: string;
    img_path: string;
  };
}

interface GeterateImageParams {
  context: string;
}

export const apiImage = {
  async generateImage(prompt: string): Promise<GenerateImageResponse> {
    try {
      const response = await axios.post(apiImageUrl.generateImage, {
        context: prompt,
      } as GeterateImageParams);
      return {
        status: response.status,
        data: response.data,
      } as GenerateImageResponse;
    } catch (error: any) {
      // Обрабатываем ошибки, включая 500
      const status = error.response?.status || 500;
      return {
        status,
        data: {
          img_id: "",
          img_path: "",
        },
      } as GenerateImageResponse;
    }
  },
};
