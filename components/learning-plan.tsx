"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import WeekCard from './week-card'
import CheckInButton from './check-in-button'
import BottomSheet from './bottom-sheet'

// Mock data structure for the learning plan (unchanged)
const learningPlanData = [
  {
    week: 0,
    goal: "Set up development environment",
    roadmap: "Install necessary tools and familiarize with basics",
    tasks: [
      { name: "Install Visual Studio Code", link: "https://code.visualstudio.com/docs/setup/setup-overview" },
      { name: "Set up Git and GitHub account", link: "https://docs.github.com/en/get-started/quickstart/set-up-git" },
      { name: "Install Node.js and npm", link: "https://nodejs.org/en/download/package-manager/" },
      { name: "Complete 'Introduction to Web Development' course", link: "https://www.coursera.org/learn/web-development" }
    ]
  },
  {
    week: 1,
    goal: "Learn HTML and CSS fundamentals",
    roadmap: "Understand structure and styling of web pages",
    tasks: [
      { name: "Complete HTML basics tutorial", link: "https://www.w3schools.com/html/" },
      { name: "Practice CSS layouts and flexbox", link: "https://flexboxfroggy.com/" },
      { name: "Build a simple static webpage", link: "https://www.freecodecamp.org/news/how-to-build-a-website-with-html-and-css-step-by-step/" },
      { name: "Start learning CSS Grid", link: "https://cssgridgarden.com/" }
    ]
  },
  {
    week: 2,
    goal: "JavaScript basics and DOM manipulation",
    roadmap: "Grasp core JS concepts and interact with web pages",
    tasks: [
      { name: "Complete JavaScript fundamentals course", link: "https://javascript.info/" },
      { name: "Practice DOM manipulation", link: "https://www.freecodecamp.org/news/what-is-the-dom-document-object-model-meaning-in-javascript/" },
      { name: "Build a simple interactive web app", link: "https://www.freecodecamp.org/news/build-a-todo-app-with-javascript-and-local-storage/" },
      { name: "Learn about event handling in JS", link: "https://developer.mozilla.org/en-US/docs/Web/Events" }
    ]
  },
  {
    week: 3,
    goal: "Introduction to React",
    roadmap: "Understand React basics and component-based architecture",
    tasks: [
      { name: "Set up a React development environment", link: "https://reactjs.org/docs/create-a-new-react-app.html" },
      { name: "Learn about JSX and React components", link: "https://reactjs.org/docs/introducing-jsx.html" },
      { name: "Build a simple React app", link: "https://reactjs.org/tutorial/tutorial.html" },
      { name: "Understand state and props in React", link: "https://reactjs.org/docs/state-and-lifecycle.html" }
    ]
  }
]

export default function LearningPlan() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ name: string; link: string } | null>(null);

  const handleCheckIn = () => {
    // Implementation
  };

  const handleTaskCompletion = (week: number, completed: number) => {
    // Implementation
  };

  const handleTaskClick = (task: { name: string; link: string }) => {
    setSelectedTask(task);
    setShowBottomSheet(true);
  };

  return (
    <div className="w-full max-w-4xl px-4 py-8 space-y-8 animate-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Your Learning Journey
        </h1>
        <p className="text-center text-muted-foreground">
          Track your progress and stay on course
        </p>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Week {selectedWeek + 1} of 12</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={((selectedWeek + 1) / 12) * 100} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPlanData.map((week, index) => (
          <WeekCard
            key={week.week}
            week={week}
            isActive={selectedWeek === index}
            onTaskClick={handleTaskClick}
            onTaskComplete={(completed) => handleTaskCompletion(index, completed)}
            className="card transform transition-all duration-200 hover:scale-105"
          />
        ))}
      </div>

      <div className="fixed bottom-8 right-8">
        <CheckInButton onClick={handleCheckIn} className="shadow-lg hover:shadow-xl transition-shadow" />
      </div>

      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        task={selectedTask}
      />
    </div>
  );
}

