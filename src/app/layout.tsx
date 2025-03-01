"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import TopicContent from "../components/TopicContent";
import SideMenu from "../components/SideMenu";
import ChatInterface from "../components/ChatInterface";
import courseContent from "../data/courseContent.json";
import { Topic } from "../types/courseTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    localStorage.clear();
    setIsAuthenticated(false);
    setUserProfile(null);
    window.location.href = '/';
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setFollowUpQuestions(topic.followUpQuestions || []);
    setIsSidebarOpen(false);
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col h-screen bg-background">
        {isAuthenticated && (
          <header className="border-b">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden mr-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-2xl font-bold">AI Tutor</h1>
              </div>
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage src={userProfile?.avatar_url || "/vercel.svg"} alt={userProfile?.name || "User"} />
                        <AvatarFallback>{userProfile?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm text-muted-foreground">Course Progress</p>
                      <div className="mt-2">
                        <Progress value={progress} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% Complete</p>
                    </div>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
              <Button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 z-40"
                size="icon"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </Button>
            </>
          )}
        </div>
      </body>
    </html>
  );
}
