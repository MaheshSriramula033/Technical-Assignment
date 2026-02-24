import api from "./axios";

export const uploadFile = (formData) =>
  api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getBuyers = (page, limit, search) =>
  api.get(`/buyers?page=${page}&limit=${limit}&search=${search}`);