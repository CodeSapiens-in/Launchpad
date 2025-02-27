import React from 'react';
import { Section } from '../types/courseTypes';

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
      <header>
        <h1 className="text-3xl font-bold text-primary mb-4" tabIndex={0}>
          {content.title}
        </h1>
        <p 
          className="text-lg text-secondary mb-8" 
          tabIndex={0}
        >
          {content.description}
        </p>
      </header>
      
      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <section 
            key={`section-${index}`} 
            className="card shadow-hover p-6"
            aria-labelledby={`section-title-${index}`}
          >
            <h2 
              id={`section-title-${index}`}
              className="text-xl font-semibold text-primary mb-4"
              tabIndex={0}
            >
              {section.title}
            </h2>
            <p 
              className="text-secondary"
              tabIndex={0}
            >
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
};

export default TopicContent;