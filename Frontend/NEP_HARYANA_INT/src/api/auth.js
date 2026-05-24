const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export const AUTH_TOKEN_KEY = "nep_haryana_auth_token";
export const AUTH_USER_KEY = "nep_haryana_auth_user";

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
    // If token is invalid/expired, clear local session to force re-auth
    if (response.status === 401) {
      logout();
    }

    const fallbackMessage = "Authentication request failed.";
    const firstMessage =
      data?.detail ||
      Object.values(data || {})?.flat?.()?.[0] ||
      fallbackMessage;
    throw new Error(firstMessage);
  }

  return data;
}

export function registerCollege(payload) {
  return request("/auth/signup/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export function fetchColleges() {
  return request("/colleges/");
}

export function loginCollege(payload) {
  return request("/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function requestPasswordReset(payload) {
  return request("/auth/forgot-password/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function confirmPasswordReset(payload) {
  return request("/auth/reset-password/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function saveAuthSession(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getSavedAuthUser() {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function getDashboardPathForUser(user) {
  const role = String(user?.role || "").toLowerCase();

  if (role === "principal") {
    return "/college/dashboard";
  }

  if (role === "admin") {
    return "/admin/dashboard";
  }

  return "/dashboard";
}

export function getDashboardPathFromSession(defaultPath = "/dashboard") {
  const user = getSavedAuthUser();

  if (!user) {
    return defaultPath;
  }

  return getDashboardPathForUser(user);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
