const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000/api`
).replace(/\/$/, "");

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

export async function request(path, options = {}) {
  // Always include credentials to send HttpOnly cookies
  options.credentials = "include";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // If unauthorized or forbidden (due to missing/expired cookie) and it's not an auth flow endpoint, attempt to refresh tokens
  if (
    (response.status === 401 || response.status === 403) &&
    path !== "/auth/refresh/" &&
    path !== "/auth/login/" &&
    path !== "/auth/signup/"
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        await refreshSession();
        isRefreshing = false;
        onRefreshed();
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        // Broadcast custom event for logout state sync
        window.dispatchEvent(new Event("auth-session-expired"));
        throw err;
      }
    }

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(() => {
        request(path, options).then(resolve).catch(reject);
      });
    });
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const fallbackMessage = "Request failed.";
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

export function refreshSession() {
  return request("/auth/refresh/", {
    method: "POST",
  });
}

export function logoutCollege() {
  return request("/auth/logout/", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return request("/auth/me/");
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

export function getDashboardPathForUser(user) {
  const role = String(user?.role || "").toLowerCase();

  if (role === "principal") {
    const nameSlug = String(user?.college_name || "college")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const codeSlug = String(user?.aishe_code || "code")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    return `/institution/${nameSlug}/${codeSlug}/dashboard`;
  }

  if (role === "admin") {
    return "/admin/dashboard";
  }

  return "/admin/dashboard";
}
