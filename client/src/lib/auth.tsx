import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { data: user, refetch } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      } catch (error) {
        return null;
      }
    },
  });

  const login = async (username: string, password: string) => {
    await apiRequest("POST", "/api/auth/login", { username, password });
    await refetch();
  };

  const register = async (username: string, email: string, password: string) => {
    await apiRequest("POST", "/api/auth/register", { username, email, password });
    toast({
      title: "Registration successful",
      description: "Please log in with your credentials",
    });
  };

  const logout = async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    await refetch();
  };

  const value = {
    user: user || null,
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