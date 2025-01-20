import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeekCardProps {
  week: {
    week: number;
    goal: string;
    roadmap: string;
    tasks: Array<{ name: string; link: string }>;
  };
  isActive: boolean;
  onTaskClick: (task: { name: string; link: string }) => void;
  onTaskComplete: (completed: number) => void;
  className?: string;
}

export default function WeekCard({
  week,
  isActive,
  onTaskClick,
  onTaskComplete,
  className
}: WeekCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      isActive ? "border-primary shadow-lg" : "hover:border-primary/50",
      className
    )}>
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70" />
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={isActive ? "default" : "secondary"} className="mb-2">
            Week {week.week + 1}
          </Badge>
        </div>
        <CardTitle className="text-xl">{week.goal}</CardTitle>
        <CardDescription className="line-clamp-2">{week.roadmap}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {week.tasks.map((task, index) => (
            <li
              key={index}
              onClick={() => onTaskClick(task)}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Circle className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-sm flex-1 text-muted-foreground hover:text-foreground transition-colors">
                {task.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

