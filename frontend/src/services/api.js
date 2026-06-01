const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const token = localStorage.getItem("sg_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || `Erreur ${res.status}`);
  }
  return data;
}

export const api = {
  login: (username, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  listUsers: () => request("/api/users"),

  searchUsers: (q) => request(`/api/users/search?q=${encodeURIComponent(q)}`),

  listPhotos: (category) => {
    const path = category ? `/api/gallery?category=${category}` : "/api/gallery";
    return request(path);
  },
};
