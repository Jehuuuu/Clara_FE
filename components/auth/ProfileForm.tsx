"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { Button } from "@/components/common/Button";

export function ProfileForm() {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useUI();
  
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [user]);
  
  if (!user) {
    return (
      <div className="w-full max-w-md p-6 mx-auto">
        <p className="text-center">You need to be logged in to view this page.</p>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      addToast({
        title: "Error",
        message: "Please fill in all required fields",
        type: "error"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateUser({ 
        first_name: firstName, 
        last_name: lastName,
      });

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
    <div className="w-full max-w-md p-6 mx-auto bg-white">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Your Profile
      </h2>
      
      {isEditing ? (
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
                setFirstName(user.first_name || "");
                setLastName(user.last_name || "");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-sm text-gray-900">
              {user.first_name} {user.last_name}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Username</h3>
            <p className="mt-1 text-sm text-gray-900">{user.username}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Saved Picks</h3>
            <p className="mt-1 text-sm text-gray-900">
              {user.savedPicks.length} candidates
            </p>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
            <Button variant="outline" onClick={logout}>
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
