import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest, getQueryFn } from "./queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const user = data || null;

  const login = async (username: string, password: string) => {
    await apiRequest("POST", "/api/auth/login", { username, password });
    await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
  };

  const register = async (username: string, email: string, password: string) => {
    await apiRequest("POST", "/api/auth/register", { username, email, password });
  };

  const logout = async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}