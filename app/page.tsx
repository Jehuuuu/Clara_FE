"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Info, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/common/Button";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import { useCandidates } from "@/context/CandidateContext";

export default function Home() {
  const { candidates, issues, isLoading, getFilteredCandidates } = useCandidates();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get first 3 candidates for featuring
  const featuredCandidates = candidates.slice(0, 3);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would redirect to the candidates page with the search query
    window.location.href = `/candidates?search=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-r from-violet-500 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container relative px-4 mx-auto z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Informed Voting Starts Here
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Compare candidates, understand policy positions, and make confident decisions at the ballot box.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <input
                  type="text"
                  placeholder="Search candidates, parties, or issues..."
                  className="w-full py-3 pl-10 pr-16 rounded-full bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="absolute right-1 top-1 rounded-full"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Info className="h-8 w-8 text-violet-500" />,
                title: "Candidate Profiles",
                description: "Detailed information on each candidate's background, experience, and policy positions.",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-green-500" />,
                title: "Issue Comparisons",
                description: "Compare where candidates stand on the issues that matter most to you.",
              },
              {
                icon: <Users className="h-8 w-8 text-blue-500" />,
                title: "Voter Quiz",
                description: "Find out which candidates align with your values through our interactive quiz.",
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Candidates */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Candidates</h2>
            <Link href="/candidates" className="flex items-center text-primary">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">Loading candidates...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCandidates.map(candidate => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-accent">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Match?</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Take our interactive quiz to discover which candidates best align with your values and priorities.
            </p>
            <Link href="/quiz">
              <Button size="lg" className="font-medium">
                Take the Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 