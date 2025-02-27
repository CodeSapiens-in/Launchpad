import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Character, Message } from '../types/chatTypes';
import { characters } from '../constants/characters';

interface ChatInterfaceProps {
  isChatOpen: boolean;
  onClose: () => void;
  followUpQuestions: string[];
  contextTitle?: string;
  contextDescription?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isChatOpen,
  onClose,
  followUpQuestions,
  contextTitle = '',
  contextDescription = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleQuestionClick = async (question: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context: {
            title: contextTitle,
            description: contextDescription
          },
          characterPrompt: selectedCharacter.prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI's response message with formatted markdown content
      const assistantMessage: Message = {
        type: 'assistant',
        content: data.text,
        timestamp: new Date(),
        showLearnMore: true
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Add initial questions as a message when the component mounts
    if (followUpQuestions.length > 0) {
      const initialQuestionsMessage: Message = {
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        followUpButtons: followUpQuestions
      };
      setMessages([initialQuestionsMessage]);
    }
  }, [followUpQuestions]);

  const renderMessageContent = (message: Message) => {
    if (message.followUpButtons) {
      return (
        <div className="space-y-2">
          {message.followUpButtons.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionClick(question)}
              className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-600 mb-2 block w-full text-left"
            >
              {question}
            </button>
          ))}
        </div>
      );
    }
    return <ReactMarkdown>{message.content}</ReactMarkdown>;
  };

  return (
    <>
      <div className={`fixed inset-x-0 bottom-0 transform ${isChatOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="bg-white/95 dark:bg-gray-800/95 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_-8px_30px_-12px_rgba(255,255,255,0.1)] ring-2 ring-gray-900/20 dark:ring-white/20 rounded-t-xl mx-4 h-[80vh] min-h-[400px] max-h-[800px] flex flex-col border-2 border-gray-300 dark:border-gray-600 backdrop-blur-lg">
          <div className="p-4 border-b-2 border-blue-200 dark:border-blue-800 flex justify-between items-center bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-t-xl">
            <div className="flex items-center space-x-4">
              <select
                value={selectedCharacter.id}
                onChange={(e) => setSelectedCharacter(characters.find(c => c.id === e.target.value) || characters[0])}
                className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {characters.map(character => (
                  <option key={character.id} value={character.id}>
                    {character.name} ({character.source})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-300 ${isChatOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${message.type === 'user' ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 ml-auto' : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 mr-auto'} max-w-[80%] animate-fadeIn transform hover:-translate-y-0.5`}
              >
                <div className="text-sm text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none">
                  {renderMessageContent(message)}
                  {message.type === 'assistant' && message.showLearnMore && (
                    <button
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          const response = await fetch('/api/chat', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              question: `Generate 3 follow-up questions based on: "${message.content}". Rules:\n- Each question on a new line\n- Maximum 10 words per question\n- No explanatory text or numbering\n- Questions must be specific and focused`,
                              context: {
                                title: contextTitle,
                                description: contextDescription
                              }
                            }),
                          });

                          if (!response.ok) throw new Error('Failed to get follow-up questions');

                          const data = await response.json();
                          const questions = data.text.split('\n').filter((q: string) => q.trim()).slice(0, 3);

                          const questionsMessage: Message = {
                            type: 'assistant',
                            content: '',
                            timestamp: new Date(),
                            followUpButtons: questions
                          };
                          setMessages(prev => [...prev, questionsMessage]);
                        } catch (error) {
                          console.error('Error getting follow-up questions:', error);
                          setError('Failed to get follow-up questions');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      Learn More
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 opacity-75">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-bounce text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full shadow-md">
                  Processing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;