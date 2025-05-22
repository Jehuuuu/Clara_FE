"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Define user type
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  savedPicks: string[]; // IDs of saved candidates
  token?: string; // JWT token for API authentication
  refreshToken?: string; // JWT refresh token
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  getToken: () => Promise<string | null>; // Function to get the auth token
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
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Try Django JWT authentication
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username: email, // Using email as username
        password: password
      });
      
      // Extract tokens from response
      const { access, refresh } = response.data;
      
      // Get user profile data
      const userResponse = await axios.get(`${API_URL}/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      
      const userData = userResponse.data;
      
      // Build the user object
      const userObj: User = {
        id: userData.id.toString(),
        username: userData.username,
        email: userData.email,
        name: userData.first_name || userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        savedPicks: [],
        token: access,
        refreshToken: refresh
      };
      
      setUser(userObj);
      setIsLoading(false);
      return { success: true, message: "Login successful" };
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle API error responses
      if (error.response) {
        if (error.response.status === 401) {
          return { success: false, message: "Invalid email or password" };
        }
        return { 
          success: false, 
          message: error.response.data.detail || "Authentication failed"
        };
      }
      
      return { 
        success: false, 
        message: "Connection error. Please check your internet connection."
      };
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Parse first and last name
      const names = name.split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      
      // Register user via Django
      const response = await axios.post(`${API_URL}/auth/register/`, {
        username: email, // Using email as username
        email: email,
        password: password,
        password2: password,
        first_name: firstName,
        last_name: lastName
      });
      
      // If registration includes tokens, set user directly
      if (response.data.tokens) {
        const { access, refresh } = response.data.tokens;
        const userData = response.data.user;
        
        const userObj: User = {
          id: userData.id.toString(),
          username: userData.username,
          email: userData.email,
          name: userData.first_name || userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
          savedPicks: [],
          token: access,
          refreshToken: refresh
        };
        
        setUser(userObj);
        setIsLoading(false);
        return { success: true, message: "Registration successful" };
      } else {
        // Otherwise login after registration
        setIsLoading(false);
        return await login(email, password);
      }
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle API error responses
      if (error.response) {
        const errorData = error.response.data;
        
        // Flatten error messages
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${messages}`;
            })
            .join('; ');
            
          return { success: false, message: errorMessages };
        }
        
        return { success: false, message: String(errorData) };
      }
      
      return { 
        success: false, 
        message: "Connection error. Please check your internet connection."
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Try to blacklist the refresh token on the server
      if (user?.refreshToken) {
        const token = await getToken();
        if (token) {
          await axios.post(`${API_URL}/auth/logout/`, 
            { refresh: user.refreshToken },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    } catch (error) {
      console.error("Error during logout", error);
    } finally {
      // Clear user data locally regardless of server response
      setUser(null);
      router.push("/");
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const token = await getToken();
      if (!token) return false;
      
      // Prepare data for API update
      const updateData: any = {};
      if (userData.firstName) updateData.first_name = userData.firstName;
      if (userData.lastName) updateData.last_name = userData.lastName;
      if (userData.email) updateData.email = userData.email;
      
      // Only send update if we have data to update
      if (Object.keys(updateData).length > 0) {
        await axios.patch(
          `${API_URL}/auth/profile/`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Update local user state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Failed to update user profile", error);
      return false;
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
        updateUser,
        getToken
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