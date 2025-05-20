"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { Button } from "@/components/common/Button";

export function ProfileForm() {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useUI();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) {
    return (
      <div className="w-full max-w-md p-6 mx-auto">
        <p className="text-center">You need to be logged in to view this page.</p>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      addToast({
        title: "Error",
        message: "Please fill in all fields",
        type: "error"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      updateUser({ name, email });
      
      addToast({
        title: "Success",
        message: "Profile updated successfully",
        type: "success"
      });
      
      setIsEditing(false);
    } catch (error) {
      addToast({
        title: "Error",
        message: "An error occurred while updating your profile",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">
        Your Profile
      </h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setName(user.name);
                setEmail(user.email);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{user.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{user.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Picks</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
              {user.savedPicks.length} candidates
            </p>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={logout}
            >
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 