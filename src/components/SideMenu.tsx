import React, { useCallback } from 'react';
import { Week, Topic } from '../types/courseTypes';

interface SideMenuProps {
  weeks: Week[];
  onTopicClick: (topic: Topic) => void;
  isSidebarOpen: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ weeks, onTopicClick, isSidebarOpen }) => {
  const handleKeyPress = useCallback((event: React.KeyboardEvent, topic: Topic) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTopicClick(topic);
    }
  }, [onTopicClick]);

  return (
    <nav 
      className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-transform duration-300 ease-in-out z-20`}
      aria-label="Course navigation"
      role="navigation"
    >
      <div className="space-y-6 overflow-y-auto max-h-full">
        {weeks.map((week) => (
          <div key={week.id} className="space-y-2">
            <h2 
              className="text-sm font-semibold text-gray-600 dark:text-gray-400"
              id={`week-${week.id}-heading`}
            >
              {week.title}
            </h2>
            <ul 
              className="space-y-1"
              aria-labelledby={`week-${week.id}-heading`}
              role="list"
            >
              {week.topics.map((topic) => (
                <li
                  key={topic.id}
                  onClick={() => onTopicClick(topic)}
                  onKeyDown={(e) => handleKeyPress(e, topic)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mx-1 px-2 py-2 rounded-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                  role="button"
                  tabIndex={0}
                  aria-label={`View topic: ${topic.title}`}
                >
                  {topic.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default SideMenu;