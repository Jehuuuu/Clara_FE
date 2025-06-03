"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, User, Trophy, AlertTriangle, FileText, Calendar, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/common/Button";

interface ResearchData {
  id: number;
  position: string;
  background: string;
  accomplishments: string;
  criticisms: string;
  summary: string;
  created_at: string;
  updated_at: string;
  metadata: {
    is_fresh: boolean;
    age_days: number;
    request_method: string;
  };
}

interface ResearchPanelProps {
  researchData: ResearchData | null;
  isLoading: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRefreshResearch?: () => void;
  onStartResearch?: () => void;
  politicianName?: string;
}

export function ResearchPanel({ 
  researchData, 
  isLoading, 
  isCollapsed, 
  onToggleCollapse,
  onRefreshResearch,
  onStartResearch,
  politicianName 
}: ResearchPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sections = [
    {
      id: 'summary',
      title: 'Summary',
      icon: <FileText className="h-4 w-4" />,
      content: researchData?.summary || '',
    },
    {
      id: 'background',
      title: 'Background',
      icon: <User className="h-4 w-4" />,
      content: researchData?.background || '',
    },
    {
      id: 'accomplishments',
      title: 'Accomplishments',
      icon: <Trophy className="h-4 w-4" />,
      content: researchData?.accomplishments || '',
    },
    {
      id: 'criticisms',
      title: 'Criticisms',
      icon: <AlertTriangle className="h-4 w-4" />,
      content: researchData?.criticisms || '',
    },
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Research Report</h3>
            {researchData && (
              <span className="text-xs text-gray-500">
                ({researchData.position})
              </span>
            )}
          </div>
        )}
        <div className="flex items-center space-x-2">
          {!isCollapsed && researchData && onRefreshResearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshResearch}
              className="h-8 w-8 p-0"
              title="Refresh research"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-gray-600">Loading research...</span>
            </div>
          ) : researchData ? (
            <div className="space-y-4">
              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>Updated: {formatDate(researchData.updated_at)}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    researchData.metadata.is_fresh 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {researchData.metadata.is_fresh ? 'Fresh' : `${researchData.metadata.age_days}d old`}
                  </div>
                </div>
              </div>

              {/* Research Sections */}
              <div className="space-y-3">
                {sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        {section.icon}
                        <span className="font-medium text-gray-900">{section.title}</span>
                      </div>
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections.has(section.id) && section.content && (
                      <div className="px-3 pb-3">
                        <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap">
                          {section.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm mb-4">No research data available</p>
              {onStartResearch && (
                <Button onClick={onStartResearch} size="sm" className="mb-2">
                  <Search className="h-4 w-4 mr-2" />
                  Start Research
                </Button>
              )}
              {politicianName && (
                <p className="text-xs text-gray-400 mt-1">
                  Research a politician to see detailed information
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 