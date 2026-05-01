import { ApiResponse } from '@/src/types/auth';

export type LearningPathApiItem = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  targetScore: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LearningPathMilestoneApiItem = {
  id: number;
  learningPathId: number;
  title: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MilestoneModuleApiItem = {
  id: number;
  milestoneId: number;
  moduleId: number;
  sortOrder: number;
  required: boolean;
  unlockCondition: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LearningModuleApiItem = {
  id: number;
  moduleType: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  estimatedMinutes: number;
  difficultyLevel: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminFlashcardApiItem = {
  id: number;
  englishWord: string;
  meaningVi: string;
  exampleSentence: string | null;
  pronunciation: string | null;
  ownerId: number | null;
  moduleId: number | null;
  active: boolean;
  personalCard: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PracticeSetApiItem = {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  partNo: number | null;
  targetScore: number | null;
  setType: string;
  durationMinutes: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VideoLessonApiItem = {
  id: number;
  moduleId: number | null;
  title: string;
  description: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  sortOrder: number | null;
  free: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VideoUploadApiItem = {
  publicId: string | null;
  resourceType: string | null;
  format: string | null;
  secureUrl: string | null;
  playbackUrl: string | null;
  durationSeconds: number | null;
  bytes: number | null;
};

export type QuestionOptionApiItem = {
  id: number;
  questionId: number;
  optionLabel: string;
  optionText: string;
  correct: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionApiItem = {
  id: number;
  partNo: number | null;
  questionText: string;
  explanation: string | null;
  difficultyLevel: string | null;
  sourceType: string | null;
  sourceYear: number | null;
  options: QuestionOptionApiItem[];
  createdAt: string;
  updatedAt: string;
};

export type PracticeSetQuestionApiItem = {
  id: number;
  practiceSetId: number;
  questionId: number;
  sortOrder: number;
  question: QuestionApiItem;
  createdAt: string;
  updatedAt: string;
};

export type PermissionApiItem = {
  id: number;
  code: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateAdminFlashcardRequest = {
  active?: boolean;
  englishWord: string;
  exampleSentence?: string | null;
  meaningVi: string;
  moduleId: number;
  pronunciation?: string | null;
};

export type CreateLearningPathRequest = {
  active?: boolean;
  code: string;
  description?: string | null;
  targetScore: number;
  title: string;
};

export type UpdateLearningPathRequest = Partial<CreateLearningPathRequest>;

export type CreateLearningPathMilestoneRequest = {
  description?: string | null;
  sortOrder: number;
  title: string;
};

export type UpdateLearningPathMilestoneRequest =
  Partial<CreateLearningPathMilestoneRequest>;

export type ModuleType =
  | 'VOCABULARY'
  | 'GRAMMAR'
  | 'PRACTICE'
  | 'MOCK_TEST'
  | 'VIDEO'
  | 'TIPS';

export type CreateLearningModuleRequest = {
  active?: boolean;
  description?: string | null;
  difficultyLevel?: string | null;
  estimatedMinutes: number;
  moduleType: ModuleType | string;
  thumbnailUrl?: string | null;
  title: string;
};

export type UpdateLearningModuleRequest = Partial<CreateLearningModuleRequest>;

export type CreateMilestoneModuleRequest = {
  moduleId: number;
  required?: boolean;
  sortOrder: number;
  unlockCondition?: string | null;
};

export type UpdateMilestoneModuleRequest = Partial<CreateMilestoneModuleRequest>;

export type UpdateAdminFlashcardRequest = {
  active?: boolean;
  englishWord?: string;
  exampleSentence?: string | null;
  meaningVi?: string;
  moduleId?: number;
  pronunciation?: string | null;
};

export type CreateVideoLessonRequest = {
  description?: string | null;
  durationSeconds: number;
  free?: boolean;
  moduleId: number;
  published?: boolean;
  sortOrder: number;
  title: string;
  videoUrl: string;
};

export type UpdateVideoLessonRequest = {
  description?: string | null;
  durationSeconds?: number;
  free?: boolean;
  moduleId?: number;
  published?: boolean;
  sortOrder?: number;
  title?: string;
  videoUrl?: string;
};

export type PracticeSetType = 'PLACEMENT' | 'PRACTICE';
export type QuestionSourceType = 'ETS' | 'HACKER' | 'INTERNAL';

export type CreatePracticeSetRequest = {
  description?: string | null;
  durationMinutes?: number;
  moduleId: number;
  partNo?: number | null;
  published?: boolean;
  setType?: PracticeSetType;
  targetScore?: number | null;
  title: string;
};

export type UpdatePracticeSetRequest = {
  description?: string | null;
  durationMinutes?: number;
  moduleId?: number;
  partNo?: number | null;
  published?: boolean;
  setType?: PracticeSetType;
  targetScore?: number | null;
  title?: string;
};

export type CreateQuestionOptionRequest = {
  correct: boolean;
  optionLabel: string;
  optionText: string;
};

export type CreateQuestionRequest = {
  difficultyLevel?: string | null;
  explanation?: string | null;
  options: CreateQuestionOptionRequest[];
  partNo?: number | null;
  questionText: string;
  sourceType?: QuestionSourceType | string | null;
  sourceYear?: number | null;
};

export type UpdateQuestionRequest = Partial<CreateQuestionRequest>;

export type AssignPracticeSetQuestionItemRequest = {
  questionId: number;
  sortOrder: number;
};

export type AssignPracticeSetQuestionsRequest = {
  questions: AssignPracticeSetQuestionItemRequest[];
};

export type LearningPathListResponse = ApiResponse<LearningPathApiItem[]>;
export type LearningPathMilestoneListResponse = ApiResponse<
  LearningPathMilestoneApiItem[]
>;
export type MilestoneModuleListResponse = ApiResponse<MilestoneModuleApiItem[]>;
export type LearningModuleListResponse = ApiResponse<LearningModuleApiItem[]>;
export type FlashcardListResponse = ApiResponse<AdminFlashcardApiItem[]>;
export type PracticeSetListResponse = ApiResponse<PracticeSetApiItem[]>;
export type VideoLessonListResponse = ApiResponse<VideoLessonApiItem[]>;
export type VideoUploadResponse = ApiResponse<VideoUploadApiItem>;
export type QuestionListResponse = ApiResponse<QuestionApiItem[]>;
export type PracticeSetQuestionListResponse = ApiResponse<PracticeSetQuestionApiItem[]>;

export type FlashcardResponse = ApiResponse<AdminFlashcardApiItem>;
export type LearningPathResponse = ApiResponse<LearningPathApiItem>;
export type LearningPathMilestoneResponse = ApiResponse<LearningPathMilestoneApiItem>;
export type MilestoneModuleResponse = ApiResponse<MilestoneModuleApiItem>;
export type LearningModuleResponse = ApiResponse<LearningModuleApiItem>;
export type PracticeSetResponse = ApiResponse<PracticeSetApiItem>;
export type VideoLessonResponse = ApiResponse<VideoLessonApiItem>;
export type QuestionResponse = ApiResponse<QuestionApiItem>;
export type ApiVoidResponse = ApiResponse<null>;
