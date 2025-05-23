"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api/auth";

// Define user type
export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  savedPicks: string[]; // IDs of saved candidates
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

// Mock users for demo purposes (replace with API calls in production)
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "demouser",
    first_name: "Demo",
    last_name: "User",
    savedPicks: ["1", "3"],
  },
];


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

  // Login function
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Mock login (replace with actual API call)
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.username === username);
      
      if (foundUser && password === "password") { // Simplified for demo
        setUser(foundUser);
        setIsLoading(false);
        return { success: true, message: "Login successful" };
      } else {
        setIsLoading(false);
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: "An error occurred during login" };
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