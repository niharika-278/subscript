// Single place where the React frontend talks to the Spring Boot backend.
// Every function returns parsed JSON or throws an Error with a readable message.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach the Subscript server. Is the backend running on port 8080?");
  }

  if (response.status === 204) return null;

  let body = null;
  try {
    body = await response.json();
  } catch {
    // non-JSON response body: fall through to the status check
  }

  if (!response.ok) {
    const error = new Error(body?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = body?.details || null;
    throw error;
  }
  return body;
}

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  // --- subscriptions ---
  listSubscriptions: (filters = {}) =>
    request(`/subscriptions${buildQuery(filters)}`),

  getSubscription: (id) => request(`/subscriptions/${id}`),

  createSubscription: (data) =>
    request("/subscriptions", { method: "POST", body: JSON.stringify(data) }),

  updateSubscription: (id, data) =>
    request(`/subscriptions/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  updateSubscriptionStatus: (id, status) =>
    request(`/subscriptions/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),

  deleteSubscription: (id) =>
    request(`/subscriptions/${id}`, { method: "DELETE" }),

  // --- budget ---
  getBudget: () => request("/budget"),

  updateBudget: (monthlyLimit) =>
    request("/budget", { method: "PUT", body: JSON.stringify({ monthlyLimit }) }),

  // --- dashboard / analytics ---
  getDashboard: () => request("/dashboard"),
};
