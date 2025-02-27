"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import TopicContent from "../components/TopicContent";
import SideMenu from "../components/SideMenu";
import ChatInterface from "../components/ChatInterface";
import courseContent from "../data/courseContent.json";
import { Topic } from "../types/courseTypes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setFollowUpQuestions(topic.followUpQuestions || []);
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden mr-4 text-gray-600 dark:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Tutor</h1>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Sign In
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <SideMenu
            weeks={courseContent.weeks}
            onTopicClick={handleTopicClick}
            isSidebarOpen={isSidebarOpen}
          />

          <main className="flex-1 overflow-auto">
            {selectedTopic ? <TopicContent content={selectedTopic.content} /> : children}
          </main>

          <ChatInterface
            isChatOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            followUpQuestions={followUpQuestions}
          />
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </body>
    </html>
  );
}
