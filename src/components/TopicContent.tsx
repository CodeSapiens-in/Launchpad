import React from 'react';
import { Section } from '../types/courseTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicContentProps {
  content: {
    title: string;
    description: string;
    sections: Section[];
  };
}

const TopicContent: React.FC<TopicContentProps> = ({ content }) => {
  if (!content) {
    return (
      <div className="p-8" role="alert" aria-live="polite">
        <p className="text-gray-600 dark:text-gray-400">Select a topic to view its content.</p>
      </div>
    );
  }

  return (
    <article className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4" tabIndex={0}>
          {content.title}
        </h1>
        <p 
          className="text-lg text-muted-foreground" 
          tabIndex={0}
        >
          {content.description}
        </p>
      </header>
      
      <div className="space-y-6">
        {content.sections.map((section, index) => (
          <Card 
            key={`section-${index}`} 
            className="transition-all duration-200 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle 
                id={`section-title-${index}`}
                className="text-xl"
                tabIndex={0}
              >
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p 
                className="text-muted-foreground"
                tabIndex={0}
              >
                {section.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </article>
  );
};

export default TopicContent;