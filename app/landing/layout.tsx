import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Clara - Your Election Assistant',
  description: 'Clara helps you make informed voting decisions',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`landing-layout ${inter.variable} font-sans`}>
      {children}
    </div>
  );
}
