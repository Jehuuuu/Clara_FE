"use client";

import { ProfileForm } from "@/components/auth/ProfileForm";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        <ProfileForm />
      </div>
    </ProtectedRoute>
  );
} 
