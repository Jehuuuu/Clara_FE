import React from "react";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/common/Button";

interface ResearchProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  politicianName: string;
}

export function ResearchProgressModal({
  isOpen,
  onClose,
  politicianName
}: ResearchProgressModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-center py-6">
          <div className="relative mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-2"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Clara is researching {politicianName}
          </h3>
          
          <p className="text-gray-600 mb-6">
            We're gathering and analyzing information from multiple sources. 
            You'll receive a notification when the research is complete.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
            <Button 
              variant="default" 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-primary/90"
            >
              Continue Chatting
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Research typically takes 3-5 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
}