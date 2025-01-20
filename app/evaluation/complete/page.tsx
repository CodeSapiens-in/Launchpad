"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function EvaluationCompletePage() {
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Congratulations! Your Learning Journey Begins
          </h2>
          <p className="text-muted-foreground">
            You've taken the first step towards mastering new skills. Your personalized learning plan is ready!
          </p>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            className="animate-in"
            onClick={() => redirect("/learn")}
          >
            Start Learning
          </Button>
        </div>
      </Card>
    </div>
  );
}