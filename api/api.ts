const BASE_BACKEND_URL = "http://localhost:8080/api" as const;
const BASE_ML_URL = "http://localhost:5000/api/" as const;

export default function createEndpoint(path: string) {
  return `${BASE_BACKEND_URL}${path}`;
}

export function createEndpointML(path: string) {
  return `${BASE_ML_URL}${path}`;
}
