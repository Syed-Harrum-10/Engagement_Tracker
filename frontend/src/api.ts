const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is not configured. Add it to frontend/.env.");
}

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
