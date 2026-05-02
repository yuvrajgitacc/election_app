export interface Country {
  name: string;
  code: string;
  flag: string;
  region: string;
}

export interface StepData {
  stepNumber: number;
  title: string;
  description: string;
  visualType: string;
  details: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  stepData?: StepData;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalSteps: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  country: string;
  completedPaths: string[];
  currentPath: string;
  currentStep: number;
  badges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
}
