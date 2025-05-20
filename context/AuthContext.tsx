"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  savedPicks: string[]; // IDs of saved candidates
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes (replace with API calls in production)
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "Demo User",
    savedPicks: ["1", "3"]
  }
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
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Mock login (replace with actual API call)
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
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
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        setIsLoading(false);
        return { success: false, message: "Email already in use" };
      }
      
      // Create new user (in a real app, this would be an API call)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        savedPicks: []
      };
      
      // Add to mock users (this is just for demo)
      MOCK_USERS.push(newUser);
      
      // Set user in state
      setUser(newUser);
      setIsLoading(false);
      return { success: true, message: "Registration successful" };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: "An error occurred during registration" };
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