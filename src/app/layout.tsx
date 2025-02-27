"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
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
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(courseContent.weeks[0].topics[0]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>(courseContent.weeks[0].topics[0].followUpQuestions || []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; avatar_url: string } | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);

      if (token) {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile);
            setUserProfile(profile);
          } catch (error) {
            console.error('Error parsing user profile:', error);
            setUserProfile(null);
          }
        }
      } else {
        setUserProfile(null);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.clear();
    setIsAuthenticated(false);
    setUserProfile(null);
    setIsProfileMenuOpen(false);
    // Redirect to the root path which will show the SignIn component
    window.location.href = '/';
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setFollowUpQuestions(topic.followUpQuestions || []);
    setIsSidebarOpen(false); // Close sidebar when topic is selected
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {isAuthenticated && (
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
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <img
                      src={userProfile?.avatar_url || "/vercel.svg"}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {userProfile?.name || "User"}
                    </span>
                  </div>

                  {isProfileMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Course Progress</p>
                        <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{progress}% Complete</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        <div className="flex flex-1 overflow-hidden">
          {isAuthenticated && (
            <SideMenu
              weeks={courseContent.weeks}
              onTopicClick={handleTopicClick}
              isSidebarOpen={isSidebarOpen}
            />
          )}

          <main className="flex-1 overflow-auto">
            {isAuthenticated && selectedTopic ? <TopicContent content={selectedTopic.content} /> : children}
          </main>

          {isAuthenticated && (
            <>
              <ChatInterface
                isChatOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                followUpQuestions={followUpQuestions}
              />
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 z-40"
                aria-label="Open chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </body>
    </html>
  );
}
