import { httpClient } from "./httpClient";

export const login = async (credentials) => {
  return httpClient.post("/auth/login", credentials);
};

export const register = async (userData) => {
  return httpClient.post("/auth/register", userData);
};
