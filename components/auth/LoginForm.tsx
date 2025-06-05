"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { Button } from "@/components/common/Button";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useUI();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      addToast({
        title: "Error",
        message: "Please fill in all fields",
        type: "error",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        addToast({
          title: "Success",
          message: "You have successfully logged in",
          type: "success"
        });
        router.push("/");
      } else {
        addToast({
          title: "Error",
          message: result.message,
          type: "error"
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        message: "An unexpected error occurred",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 mx-auto bg-white">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Log In to Clara
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white"
            placeholder="your username"
            required
          />
        </div>
        
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label 
              htmlFor="remember-me" 
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a 
              href="#" 
              className="font-medium text-primary hover:text-primary/80"
            >
              Forgot password?
            </a>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link 
            href="/auth/register" 
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
      
      {/* Demo credentials */}
      <div className="mt-4 p-3 bg-gray-100">
        <p className="font-bold mb-1">Demo Credentials</p>
        <p>Username: demouser</p>
        <p>Password: password</p>
      </div>
    </div>
  );
} 
