"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Search, User, Info } from "lucide-react";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Candidates", href: "/candidates" },
  { label: "Issues", href: "/issues/economy" },
  { label: "Compare", href: "/compare" },
  { label: "Quiz", href: "/quiz" },
  { label: "Ask", href: "/ask" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showMyPicksTooltip, setShowMyPicksTooltip] = useState(false);
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useUI();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <span className="text-2xl font-bold">Clara</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          
          {/* My Picks menu item with conditional rendering */}
          <div className="relative">
            {user ? (
              <Link
                href="/my-picks"
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === "/my-picks"
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                )}
              >
                My Picks
              </Link>
            ) : (
              <div
                className="px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed"
                onMouseEnter={() => setShowMyPicksTooltip(true)}
                onMouseLeave={() => setShowMyPicksTooltip(false)}
              >
                My Picks
                
                {showMyPicksTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                    <div className="absolute left-1/2 -top-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-800"></div>
                    Sign in to save your picks
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="flex-1" />
        
        {/* Right side items */}
        <div className="flex items-center space-x-2">
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
            className="hidden md:flex"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="hidden md:flex"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Authentication */}
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="hidden md:flex"
              >
                <User className="h-5 w-5" />
              </Button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link 
                    href="/my-picks" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    My Picks
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button
                size="sm"
                asChild
              >
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile My Picks with conditional rendering */}
            {user ? (
              <Link
                href="/my-picks"
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                  pathname === "/my-picks"
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                My Picks
              </Link>
            ) : (
              <div className="flex items-center px-3 py-2 text-base font-medium text-gray-400">
                <span>My Picks</span>
                <div className="ml-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                  <Info className="h-4 w-4" />
                </div>
                <span className="ml-2 text-xs">Sign in required</span>
              </div>
            )}
            
            {/* Mobile authentication links */}
            {user ? (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-base font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    className="block w-full text-left px-3 py-2 text-base font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3 flex flex-col space-y-1">
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-base font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 text-base font-medium rounded-md bg-primary text-primary-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-5 w-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full bg-background border-b">
          <div className="container px-4 py-4 sm:px-6">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search candidates, issues..."
                className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Escape") setIsSearchOpen(false);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Quick search results would go here */}
          </div>
        </div>
      )}
    </header>
  );
} 