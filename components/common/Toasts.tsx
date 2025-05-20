"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

export function Toasts() {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "p-4 rounded-md shadow-lg pointer-events-auto flex items-center justify-between",
            toast.type === "success" && "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
            toast.type === "error" && "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
            toast.type === "warning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
            toast.type === "info" && "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
          )}
        >
          <div className="flex items-center space-x-3">
            {toast.type === "success" && <CheckCircle className="h-5 w-5" />}
            {toast.type === "error" && <AlertCircle className="h-5 w-5" />}
            {toast.type === "warning" && <AlertTriangle className="h-5 w-5" />}
            {toast.type === "info" && <Info className="h-5 w-5" />}
            
            <div>
              {toast.title && (
                <h4 className="font-medium">{toast.title}</h4>
              )}
              <p className="text-sm">{toast.message}</p>
            </div>
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
} 