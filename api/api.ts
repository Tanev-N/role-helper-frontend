const BASE_BACKEND_URL = "https://critical-roll.ru/api" as const;
const BASE_ML_URL = "https://critical-roll.ru/ml" as const;

export default function createEndpoint(path: string) {
  return `${BASE_BACKEND_URL}${path}`;
}

export function createEndpointML(path: string) {
  return `${BASE_ML_URL}${path}`;
}
