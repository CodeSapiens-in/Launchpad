'use client';

import { QuizCard } from "@/components/QuizCard";

interface EvaluationFormProps {
  questions: any[];
  action: (formData: FormData) => Promise<void>;
}

export function EvaluationForm({ questions, action }: EvaluationFormProps) {
  const handleQuizComplete = (results: { knew: number; learnt: number; skipped: number }) => {
    console.log('Quiz completed with results:', results);
    
    // Create and submit form data
    const formData = new FormData();
    formData.set('knew', results.knew.toString());
    formData.set('learnt', results.learnt.toString());
    formData.set('skipped', results.skipped.toString());
    
    action(formData);
  };

  return (
    <QuizCard 
      questions={questions}
      onComplete={handleQuizComplete}
    />
  );
}
