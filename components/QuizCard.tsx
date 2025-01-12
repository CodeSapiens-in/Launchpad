'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";

interface Question {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface QuizCardProps {
  questions: Question[];
  onComplete: (results: { knew: number; learnt: number; skipped: number }) => void;
}

export function QuizCard({ questions, onComplete }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState({ knew: 0, learnt: 0, skipped: 0 });

  const handleResponse = (type: 'knew' | 'learnt' | 'skipped') => {
    const newResults = { ...results };
    newResults[type]++;
    setResults(newResults);

    console.log('Current Index:', currentIndex, 'Questions Length:', questions.length);
    
    if (currentIndex === questions.length - 1) {
      // We're on the last question, complete the quiz
      console.log('Completing quiz with final results:', newResults);
      onComplete(newResults);
    } else {
      // Move to next question
      console.log('Moving to next question');
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div>
            <span className="font-bold">{currentIndex + 1}</span> / {questions.length}
          </div>
          <div className="flex gap-4">
            <span>Knew: {results.knew}</span>
            <span>Learnt: {results.learnt}</span>
            <span>Skipped: {results.skipped}</span>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-2 text-sm text-gray-500">
          {currentQuestion.category}
        </div>
        <h2 className="text-xl font-semibold mb-8">
          {currentQuestion.question}
        </h2>
        {showAnswer ? (
          <p className="mb-4 text-gray-700">{currentQuestion.answer}</p>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="text-blue-500 hover:underline"
          >
            Click to Reveal the Answer
          </button>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => handleResponse('knew')}
         
        >
          Already Know that
        </Button>
        <Button
          variant="outline"
          onClick={() => handleResponse('learnt')}
          
        >
          Didn't Know that
        </Button>
        <Button
          variant="outline"
          className="text-red-500 hover:bg-red-50"
          onClick={() => handleResponse('skipped')}
        >
          Skip Question
        </Button>
      </div>
    </div>
  );
}
