import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface WeekCardProps {
  weekData: {
    week: number
    goal: string
    roadmap: string
    tasks: { name: string; link: string }[]
  }
  isActive: boolean
  completedTasks: number
  onTaskCompletion: (completed: number) => void
  onTaskClick: (task: { name: string; link: string }) => void
}

export default function WeekCard({ weekData, isActive, completedTasks, onTaskCompletion, onTaskClick }: WeekCardProps) {
  const [tasks, setTasks] = useState(weekData.tasks.map(() => false))

  const handleTaskToggle = (index: number) => {
    const newTasks = [...tasks]
    newTasks[index] = !newTasks[index]
    setTasks(newTasks)
    onTaskCompletion(newTasks.filter(Boolean).length)
  }

  return (
    <Card className={`${isActive ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle>Week {weekData.week}</CardTitle>
        <CardDescription>{weekData.goal}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{weekData.roadmap}</p>
        <ul className="space-y-2">
          {weekData.tasks.map((task, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`task-${weekData.week}-${index}`}
                checked={tasks[index]}
                onCheckedChange={() => handleTaskToggle(index)}
              />
              <label
                htmlFor={`task-${weekData.week}-${index}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow"
              >
                <button
                  onClick={() => onTaskClick(task)}
                  className="text-left hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  {task.name}
                </button>
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

