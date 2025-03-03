'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Welcome to AI Engineering Tutor</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your interactive learning companion for mastering AI and Machine Learning concepts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Begin your AI journey with our structured learning paths. Select a topic from the sidebar to start learning.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interactive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Use our AI-powered chat assistant to get instant help and clarification on any topic.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Featured Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Introduction to AI',
                description: 'Learn the fundamental concepts and history of Artificial Intelligence.'
              },
              {
                title: 'Machine Learning Basics',
                description: 'Understand the core principles of Machine Learning algorithms.'
              },
              {
                title: 'Neural Networks',
                description: 'Explore the architecture and applications of Neural Networks.'
              }
            ].map((topic, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}