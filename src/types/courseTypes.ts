export interface Topic {
  id: string;
  title: string;
  content: {
    title: string;
    description: string;
    sections: Section[];
  };
  followUpQuestions: string[];
}

export interface Week {
  id: number;
  title: string;
  topics: Topic[];
}

export interface Section {
  title: string;
  content: string;
}