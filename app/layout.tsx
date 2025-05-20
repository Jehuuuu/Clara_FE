"use client";

import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Toasts } from "@/components/common/Toasts";
import { Modal } from "@/components/common/Modal";
import { UIProvider } from "@/context/UIContext";
import { CandidateProvider } from "@/context/CandidateContext";
import { BookmarkProvider } from "@/context/BookmarkContext";
import { AuthProvider } from "@/context/AuthContext";
import { QuizProvider } from "@/context/QuizContext";
import { ChatProvider } from "@/context/ChatContext";
import "@/styles/globals.css";

// We're using a client component with manual head tags for metadata
// In a production app, you would use a separate layout file for metadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Clara | Election Awareness Portal</title>
        <meta
          name="description"
          content="Empowering voters with information about candidates and issues"
        />
      </head>
      <body>
        <AuthProvider>
          <UIProvider>
            <CandidateProvider>
              <BookmarkProvider>
                <QuizProvider>
                  <ChatProvider>
                    <div className="flex min-h-screen flex-col">
                      <Navbar />
                      <main className="flex-1">{children}</main>
                      <Footer />
                      <Toasts />
                      <Modal />
                    </div>
                  </ChatProvider>
                </QuizProvider>
              </BookmarkProvider>
            </CandidateProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 