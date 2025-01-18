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
  const [currentWeek, setCurrentWeek] = useState(0)
  const [streak, setStreak] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<{[key: number]: number}>({0: 0, 1: 0, 2: 0, 3: 0})
  const [selectedTask, setSelectedTask] = useState<{ name: string, link: string } | null>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const handleCheckIn = () => {
    setStreak(prev => prev + 1)
  }

  const handleTaskCompletion = (week: number, completed: number) => {
    setCompletedTasks(prev => ({...prev, [week]: completed}))
  }

  const handleTaskClick = (task: { name: string, link: string }) => {
    setSelectedTask(task)
    setIsBottomSheetOpen(true)
  }

  const totalTasks = learningPlanData.reduce((acc, week) => acc + week.tasks.length, 0)
  const completedTasksCount = Object.values(completedTasks).reduce((acc, count) => acc + count, 0)
  const overallProgress = (completedTasksCount / totalTasks) * 100

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>4-Week Web Development Learning Plan</CardTitle>
        <CardDescription>Track your progress and maintain your learning streak</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-medium">Overall Progress</p>
            <Progress value={overallProgress} className="w-[60%]" />
          </div>
          <CheckInButton streak={streak} onCheckIn={handleCheckIn} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {learningPlanData.map((week) => (
            <WeekCard
              key={week.week}
              weekData={week}
              isActive={currentWeek === week.week}
              completedTasks={completedTasks[week.week]}
              onTaskCompletion={(completed) => handleTaskCompletion(week.week, completed)}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </CardContent>
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        task={selectedTask}
      />
    </Card>
  )
}

