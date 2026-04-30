export type GoalPlan = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  accentColor: string;
  badge?: string;
};

export type FlashcardItem = {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  progressLabel: string;
};

export type LessonUnit = {
  id: string;
  title: string;
  status: "done" | "current" | "locked";
  progress: number;
};

export type NotebookEntry = {
  id: string;
  category: string;
  createdAt: string;
  title: string;
};

export type TestOption = {
  id: string;
  label: string;
  value: string;
};

export type TestQuestion = {
  id: string;
  part: string;
  progressText: string;
  prompt: string;
  highlight: string;
  options: TestOption[];
  correctOptionId: string;
};
