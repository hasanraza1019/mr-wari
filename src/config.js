export const API_URL = import.meta.env.VITE_API_URL || "https://mr-wari-backend-production.up.railway.app";

export function resolveAssetUrl(value = "") {
  if (!value || /^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
}
