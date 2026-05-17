const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

export const AUTH_TOKEN_KEY = 'nep_haryana_auth_token';
export const AUTH_USER_KEY = 'nep_haryana_auth_user';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const fallbackMessage = 'Authentication request failed.';
    const firstMessage = data?.detail || Object.values(data || {})?.flat?.()?.[0] || fallbackMessage;
    throw new Error(firstMessage);
  }

  return data;
}

export function registerCollege(payload) {
  return request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function loginCollege(payload) {
  return request('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function saveAuthSession(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}