const BASE_BACKEND_URL = "https://critical-roll.ru/api" as const;
const BASE_ML_URL = "https://critical-roll.ru/ml" as const;
const BASE_IMAGE_URL = "https://critical-roll.ru/app/images" as const;

export default function createEndpoint(path: string) {
  return `${BASE_BACKEND_URL}${path}`;
}

export function createEndpointML(path: string) {
  return `${BASE_ML_URL}${path}`;
}

export function createEndpointImage(raw_image_id: string) {
  const image_id = parseImageUrl(raw_image_id);
  return `${BASE_IMAGE_URL}${image_id}`;
}

const parseImageUrl = (raw_image_id: string) => {
  return raw_image_id.replace("./app/images", "");
};
