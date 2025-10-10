const BASE_BACKEND_URL = "http://localhost:8080/api" as const;

export default function createEndpoint(path: string) {
  return `${BASE_BACKEND_URL}${path}`;
}
