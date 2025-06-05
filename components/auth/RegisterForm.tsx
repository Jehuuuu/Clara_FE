"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { Button } from "@/components/common/Button";

export function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { addToast } = useUI();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!firstName || !lastName || !username || !password || !confirmPassword) {
      addToast({
        title: "Error",
        message: "Please fill in all fields",
        type: "error",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      addToast({
        title: "Error",
        message: "Passwords don't match",
        type: "error"
      });
      return;
    }
    
    if (password.length < 6) {
      addToast({
        title: "Error",
        message: "Password must be at least 6 characters",
        type: "error"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await register(firstName, lastName, username, password);
      
      if (result.success) {
        addToast({
          title: "Success",
          message: "Registration successful! You are now logged in.",
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
        Create Your Clara Account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="firstName" 
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white"
            placeholder="John"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="lastName" 
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white"
            placeholder="Doe"
            required
          />
        </div>
        
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
            placeholder="your_username"
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
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 6 characters
          </p>
        </div>
        
        <div>
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            required
          />
          <label 
            htmlFor="terms" 
            className="ml-2 block text-sm text-gray-700"
          >
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </label>
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link 
            href="/auth/login" 
            className="font-medium text-primary hover:text-primary/80"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
} 
