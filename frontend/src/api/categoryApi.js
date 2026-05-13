import apiClient from "./axiosConfig";

export const categoryApi = {
  getAll: () => apiClient.get("/categories"),
  getById: (id) => apiClient.get(`/categories/${id}`),
  getStats: () => apiClient.get("/categories/stats"),
  create: (payload) => apiClient.post("/categories", payload),
  update: (id, payload) => apiClient.put(`/categories/${id}`, payload),
  remove: (id) => apiClient.delete(`/categories/${id}`),
  getProducts: (id) => apiClient.get(`/categories/${id}/products`)
};
