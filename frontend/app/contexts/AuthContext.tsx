"use client";

import React, { createContext, useState, useEffect } from "react";
import { User, AuthContextType } from "../types/auth";
import { authService } from "../services/authService";
import { useRouter, usePathname } from "next/navigation";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    } else {
      setIsLoading(false);
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profiles. Token might be invalid.", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    router.push("/"); // Redirect to dashboard after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login"); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
