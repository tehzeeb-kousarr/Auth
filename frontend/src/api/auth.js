const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}

export const signup = ({ name, email, password }) =>
  request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const login = ({ email, password }) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const loginWithGoogle = (credential) =>
  request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });

export const loginWithFacebook = (accessToken) =>
  request("/auth/facebook", {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });

export const fetchMe = (token) =>
  request("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
