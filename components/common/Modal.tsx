"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

export function Modal() {
  const { isModalOpen, modalContent, closeModal } = useUI();
  
  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    
    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      // Re-enable scrolling
      document.body.style.overflow = "";
    };
  }, [isModalOpen, closeModal]);
  
  if (!isModalOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeModal}
      />
      
      {/* Modal content */}
      <div
        className={cn(
          "relative max-h-[90vh] w-[90%] max-w-lg overflow-auto bg-background p-6 rounded-lg shadow-lg",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        
        {modalContent}
      </div>
    </div>
  );
} 