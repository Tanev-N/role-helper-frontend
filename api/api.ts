const BASE_BACKEND_URL = "https://critical-roll.ru/api" as const;
const BASE_ML_URL = "http://109.120.182.198:8081" as const;

export default function createEndpoint(path: string) {
  return `${BASE_BACKEND_URL}${path}`;
}

export function createEndpointML(path: string) {
  return `${BASE_ML_URL}${path}`;
}
