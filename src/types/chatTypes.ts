export interface Character {
  id: string;
  name: string;
  source: string;
  prompt: string;
}

export interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  showLearnMore?: boolean;
  followUpButtons?: string[];
}

export interface ChatContext {
  title: string;
  description: string;
}

export interface ChatResponse {
  response: string;
}