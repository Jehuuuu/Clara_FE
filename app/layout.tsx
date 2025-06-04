"use client";

import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Toasts } from "@/components/common/Toasts";
import { Modal } from "@/components/common/Modal";
import { UIProvider } from "@/context/UIContext";
import { PoliticianProvider } from "@/context/PoliticianContext";
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
          content="Empowering voters with information about politicians and issues"
        />
      </head>
      <body>
        <AuthProvider>
          <UIProvider>
            <PoliticianProvider>
              <BookmarkProvider>
                <QuizProvider>
                  <ChatProvider>
                    <div className="h-screen flex flex-col overflow-hidden">
                      <Navbar />
                      <main className="flex-1 min-h-0">{children}</main>
                      <Toasts />
                      <Modal />
                    </div>
                  </ChatProvider>
                </QuizProvider>
              </BookmarkProvider>
            </PoliticianProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 