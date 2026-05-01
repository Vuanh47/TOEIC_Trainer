import { ApiResponse } from "@/src/types/auth";

export type UserProfile = {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  authProvider: string;
  providerUserId: string | null;
  currentLevel: string;
  targetScore: number;
  premium: boolean;
  role: string;
  status: string;
  profileId: number;
  createdAt: string;
  updatedAt: string;
};

export type FlashcardApiItem = {
  id: number;
  englishWord: string;
  meaningVi: string;
  exampleSentence: string;
  pronunciation: string;
  ownerId: number;
  moduleId: number | null;
  active: boolean;
  personalCard: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserLearningPathAssignment = {
  id: number;
  userId: number;
  learningPathId: number;
  source: string;
  status: string;
  assignedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserLessonApiItem = {
  lessonId: number;
  moduleId: number | null;
  moduleTitle: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
  videoUrl: string;
  durationSeconds: number;
  sortOrder: number;
  free: boolean;
  completionPercent: number;
  lastPositionSeconds: number;
  progressStatus: string;
};

export type UserRoadmapModuleItem = {
  moduleId: number;
  title: string;
  description: string | null;
  moduleType: string;
  estimatedMinutes: number | null;
  difficultyLevel: string | null;
  sortOrder: number;
  required: boolean;
  unlockCondition: string | null;
  progressStatus: string;
  progressPercent: number;
  videoLessonCount: number;
  flashcardCount: number;
  practiceSetCount: number;
};

export type UserRoadmapMilestoneItem = {
  id: number;
  title: string;
  description: string | null;
  sortOrder: number;
  modules: UserRoadmapModuleItem[];
};

export type UserRoadmap = {
  assignmentId: number;
  learningPathId: number;
  learningPathCode: string;
  learningPathTitle: string;
  learningPathDescription: string | null;
  targetScore: number;
  status: string;
  progressPercent: number;
  currentModuleId: number | null;
  assignedAt: string;
  milestones: UserRoadmapMilestoneItem[];
};

export type PracticeSetApiItem = {
  id: number;
  moduleId: number | null;
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

export type UserModuleContent = {
  moduleId: number;
  title: string;
  description: string | null;
  moduleType: string;
  estimatedMinutes: number | null;
  difficultyLevel: string | null;
  videoLessons: UserLessonApiItem[];
  flashcards: FlashcardApiItem[];
  practiceSets: PracticeSetApiItem[];
};

export type LessonProgressUpdate = {
  lessonId: number;
  moduleId: number;
  lessonStatus: string;
  lessonCompletionPercent: number;
  lastPositionSeconds: number;
  watchedSeconds: number;
  moduleStatus: string;
  moduleProgressPercent: number;
  nextModuleId: number | null;
  nextModuleUnlocked: boolean;
  pathCompleted: boolean;
};

export type ModuleUnlock = {
  moduleId: number;
  moduleStatus: string;
  moduleProgressPercent: number;
  moduleCompleted: boolean;
  nextModuleId: number | null;
  nextModuleUnlocked: boolean;
  pathCompleted: boolean;
};

export type FlashcardCollectionApiItem = {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  flashcardCount: number;
  flashcards?: FlashcardApiItem[] | null;
  createdAt: string;
  updatedAt: string;
};

export type UserProfileResponse = ApiResponse<UserProfile>;
export type FlashcardsResponse = ApiResponse<FlashcardApiItem[]>;
export type FlashcardResponse = ApiResponse<FlashcardApiItem>;
export type UserLearningPathAssignmentResponse =
  ApiResponse<UserLearningPathAssignment>;
export type UserLessonsResponse = ApiResponse<UserLessonApiItem[]>;
export type UserRoadmapResponse = ApiResponse<UserRoadmap>;
export type UserModuleContentResponse = ApiResponse<UserModuleContent>;
export type LessonProgressUpdateResponse = ApiResponse<LessonProgressUpdate>;
export type ModuleUnlockResponse = ApiResponse<ModuleUnlock>;
export type FlashcardCollectionListResponse = ApiResponse<FlashcardCollectionApiItem[]>;
export type FlashcardCollectionResponse = ApiResponse<FlashcardCollectionApiItem>;
