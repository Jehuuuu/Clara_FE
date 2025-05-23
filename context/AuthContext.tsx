"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api/auth";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; // adjust as needed

// Define user type
export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  savedPicks: string[]; // IDs of saved candidates
  token?: string; // JWT token for API authentication
  refreshToken?: string; // JWT refresh token
}


// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    first_name: string,
    last_name: string,
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}


// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("clara_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user data", error);
        localStorage.removeItem("clara_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("clara_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("clara_user");
    }
  }, [user]);

  // Get authentication token
  const getToken = async (): Promise<string | null> => {
    if (!user?.token) return null;

    // Check if token needs refreshing
    try {
      // Verify the current token
      await axios.post(`${API_URL}/auth/token/verify/`, {
        token: user.token
      });
      
      // Token is valid, return it
      return user.token;
    } catch (error) {
      // Token is invalid, try to refresh it
      console.log("Token invalid, attempting to refresh...");
      
      try {
        if (user.refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: user.refreshToken
          });
          
          // Update the access token
          const newToken = response.data.access;
          setUser(prev => prev ? { ...prev, token: newToken } : null);
          
          return newToken;
        }
      } catch (refreshError) {
        // Refresh failed, logout the user
        console.error("Token refresh failed", refreshError);
        await logout();
      }
    }
    
    return null;
  };

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const result = await loginUser(username, password); // result should return { success, user, tokens }

      setIsLoading(false);

      if (result.success && result.user && result.tokens) {
        const { user, tokens } = result;

        setUser({
          ...user,
          savedPicks: [], // optional
          token: tokens.access,
          refreshToken: tokens.refresh,
        });

        localStorage.setItem("clara_user", JSON.stringify({
          ...user,
          savedPicks: [],
          token: tokens.access,
          refreshToken: tokens.refresh,
        }));

        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, message: error.message || "Login failed" };
    }
  };



  // Register function
  const register = async (
    first_name: string,
    last_name: string,
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const data = await registerUser({ first_name, last_name, username, password });

      setUser({
        id: data.user.id.toString(), // Ensure this matches your expected User shape
        username: data.user.username,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        savedPicks: [],
      });

      // Store tokens if needed
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);

      return { success: true, message: "Registration successful" };
    } catch (error: any) {
      return { success: false, message: error.message || "Registration failed" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    router.push("/");
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // In a real app, you would make an API call here
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 