import { apiClient } from "./apiLayer";
import { User, AuthResponse } from "../types/auth";

export const authService = {
  // Login standard OAuth2 form data
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await apiClient.post<AuthResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Fetch current user details
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
