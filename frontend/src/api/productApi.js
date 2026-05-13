import apiClient from "./axiosConfig";

export const productApi = {
  getAll: (categoryId) =>
    apiClient.get("/products", {
      params: categoryId ? { categoryId } : {}
    }),
  seed: () => apiClient.post("/products/seed")
};
