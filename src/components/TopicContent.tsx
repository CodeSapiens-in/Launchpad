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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" tabIndex={0}>
          {content.title}
        </h1>
        <p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-8" 
          tabIndex={0}
        >
          {content.description}
        </p>
      </header>
      
      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <section 
            key={`section-${index}`} 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            aria-labelledby={`section-title-${index}`}
          >
            <h2 
              id={`section-title-${index}`}
              className="text-xl font-semibold text-gray-800 dark:text-white mb-4"
              tabIndex={0}
            >
              {section.title}
            </h2>
            <p 
              className="text-gray-600 dark:text-gray-300"
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