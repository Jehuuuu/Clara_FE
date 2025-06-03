"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronDown, User, Trophy, AlertTriangle, FileText, Calendar, RefreshCw, Search, Building2, MapPin, PanelLeftOpen, PanelLeftClose, Shield, Clock, Database, ExternalLink } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/common/Avatar";

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
  politicianImage?: string;
  politicianParty?: string;
}

export function ResearchPanel({ 
  researchData, 
  isLoading, 
  isCollapsed, 
  onToggleCollapse,
  onRefreshResearch,
  onStartResearch,
  politicianName,
  politicianImage,
  politicianParty
}: ResearchPanelProps) {
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDataStatusBadge = () => {
    if (!researchData) return null;
    
    const { is_fresh, age_days } = researchData.metadata;
    
    if (is_fresh) {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
          LIVE DATA
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3 mr-1" />
          {age_days} DAYS OLD
        </div>
      );
    }
  };

  const sections = [
    {
      id: 'summary',
      title: 'Executive Summary',
      subtitle: 'Key findings and overview',
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      content: researchData?.summary,
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-l-blue-500'
    },
    {
      id: 'background',
      title: 'Background & Biography',
      subtitle: 'Personal history and career path',
      icon: <User className="h-5 w-5 text-slate-600" />,
      content: researchData?.background,
      bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
      borderColor: 'border-l-slate-500'
    },
    {
      id: 'accomplishments',
      title: 'Key Accomplishments',
      subtitle: 'Notable achievements and successes',
      icon: <Trophy className="h-5 w-5 text-emerald-600" />,
      content: researchData?.accomplishments,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      borderColor: 'border-l-emerald-500'
    },
    {
      id: 'criticisms',
      title: 'Criticisms & Controversies',
      subtitle: 'Areas of concern and opposition',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      content: researchData?.criticisms,
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      borderColor: 'border-l-red-500'
    }
  ];

  return (
    <div className={`research-panel ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* Enhanced Header */}
      <div className="research-panel-header">
        {!isCollapsed && researchData && (
          <div className="research-header-title">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">POLITICAL RESEARCH REPORT</h1>
                <p className="text-blue-100 text-sm opacity-90 font-medium">Comprehensive Political Analysis</p>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-xs font-mono opacity-75">CLARA-RESEARCH</div>
                <div className="text-blue-200 text-xs font-mono font-bold">#{researchData.id.toString().padStart(6, '0')}</div>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-10 w-10 p-0 hover:bg-white/10 rounded-lg transition-colors"
          title={isCollapsed ? "Expand research panel" : "Collapse research panel"}
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5 text-gray-600" /> : <PanelLeftClose className="h-5 w-5 text-white" />}
        </Button>
      </div>

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="research-collapsed-content">
        </div>
      )}

      {/* Enhanced Expanded Content */}
      {!isCollapsed && (
        <div className="research-panel-content">
          {isLoading ? (
            <div className="research-loading-state">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Research Report</h3>
              <p className="text-sm text-gray-600 mb-4">Analyzing data sources and compiling research...</p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Database className="h-4 w-4" />
                <span>Processing information</span>
              </div>
            </div>
          ) : researchData ? (
            <div className="research-document-container">
              {/* Enhanced Politician Profile */}
              <div className="research-politician-profile bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 ring-4 ring-white/20 shadow-lg">
                        <AvatarImage 
                          src={politicianImage || `/api/placeholder/64/64`}
                          alt={politicianName || "Politician"}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(politicianName || "PL")}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h2 className="text-2xl font-bold text-white">{politicianName}</h2>
                        {researchData.position && (
                          <div className="flex items-center mt-1 text-slate-300">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span className="font-medium text-sm">{researchData.position}</span>
                          </div>
                        )}
                        {politicianParty && (
                          <div className="flex items-center mt-1 text-slate-300">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                              {politicianParty}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {getDataStatusBadge()}
                      <div className="mt-2 text-slate-400 text-xs font-mono">
                        Last Updated: {formatTime(researchData.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Research Sections */}
              <div className="research-sections-container space-y-4">
                {sections.map((section) => section.content && (
                  <div key={section.id} className="research-section-card bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Enhanced Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="research-section-header w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-gray-100">
                          {section.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{section.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {/* Enhanced Section Content */}
                    {expandedSections.has(section.id) && (
                      <div className="research-section-content">
                        <div className={`mx-6 mb-6 ${section.bgColor} border-l-4 ${section.borderColor} rounded-r-lg overflow-hidden`}>
                          <div className="p-6">
                            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
                              {section.content.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-4 last:mb-0 text-justify">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Footer */}
              <div className="research-document-footer bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-sm p-6 text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="text-lg font-bold text-white tracking-wider">CLARA RESEARCH SYSTEM</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                    <div className="text-left">
                      <p className="font-semibold text-white mb-1">CLASSIFICATION</p>
                      <p>Public Information Analysis</p>
                      <p>Automated Research Protocol</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white mb-1">DISCLAIMER</p>
                      <p>Data accuracy may vary</p>
                      <p>Verify information independently</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Enhanced Empty State
            <div className="research-empty-state">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm mb-4 inline-block">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Research Available</h3>
                <p className="text-gray-600 mb-6 max-w-sm leading-relaxed">
                  Start a new research request to generate a comprehensive political analysis report.
                </p>
                {onStartResearch && (
                  <Button onClick={onStartResearch} className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Search className="h-4 w-4 mr-2" />
                    Begin Research
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 