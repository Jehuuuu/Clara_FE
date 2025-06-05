"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { addToast } = useUI();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      addToast({
        title: "Sign In Required",
        message: "You need to sign in to view your saved picks",
        type: "warning",
      });
      router.push("/auth/login");
    }
  }, [user, isLoading, router, addToast]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, show the children
  return user ? <>{children}</> : null;
} 
