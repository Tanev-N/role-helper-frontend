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
  async generateImage(prompt: string) {
    return (await axios.post(apiImageUrl.generateImage, {
      context: prompt,
    } as GeterateImageParams)) as GenerateImageResponse;
  },
};
