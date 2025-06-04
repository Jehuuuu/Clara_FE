import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="">
        <div className="flex flex-col items-center md:items-start">
          <div className="text-lg font-bold">Clara</div>
          <p className="text-sm text-muted-foreground mt-1">
            Making election information accessible
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-6 mb-4">
            {[
              { label: "About", href: "#" },
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Contact", href: "#" },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Clara Election Portal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 