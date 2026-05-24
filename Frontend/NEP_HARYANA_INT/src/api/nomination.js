const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

import { AUTH_TOKEN_KEY } from "./auth";

async function request(path, options = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const authHeader = token ? { Authorization: `Token ${token}` } : {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const fallbackMessage = "Request failed.";
    const firstMessage =
      data?.detail ||
      data?.message ||
      Object.values(data || {})?.flat?.()?.[0] ||
      fallbackMessage;
    throw new Error(firstMessage);
  }

  return data;
}

export function fetchNominationHeader() {
  return request("/nomination-header/");
}

export function openNominationHeaderForm() {
  return request("/nomination-header/open/", {
    method: "POST",
  });
}

export function fetchNominationHeaderById(formId) {
  return request(`/nomination-header/${formId}/`);
}

export function saveNominationHeaderById(formId, payload) {
  return request(`/nomination-header/${formId}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchIndicatorsByFormId(formId) {
  return request(`/nomination-header/${formId}/indicators/`);
}

export function saveIndicators(formId, indicatorsList) {
  return request(`/nomination-header/${formId}/indicators/save/`, {
    method: "POST",
    body: JSON.stringify(indicatorsList),
  });
}

export function uploadIndicatorFile(formId, indicatorNum, file) {
  const formData = new FormData();
  formData.append("file", file);

  const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
  ).replace(/\/$/, "");
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const authHeader = token ? { Authorization: `Token ${token}` } : {};

  return fetch(`${API_BASE_URL}/nomination-header/${formId}/indicators/${indicatorNum}/upload/`, {
    method: "POST",
    headers: {
      ...authHeader,
    },
    body: formData,
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.message || "File upload failed.");
    }
    return data;
  });
}
