import { ApiResponse } from "@/src/types/auth";

export type LearningPath = {
  id: number;
  code: string;
  title: string;
  description: string;
  targetScore: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LearningPathListResponse = ApiResponse<LearningPath[]>;

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

export type UserStreak = {
  email: string;
  timezone: string;
  currentLoginStreak: number;
  longestLoginStreak: number;
  lastLoginDate: string | null;
  lastLoginAt: string | null;
  todayLoggedIn: boolean;
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
  completedAt?: string | null;
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

export type UserPracticeQuestionOptionResponse = {
  id: number;
  optionLabel: string;
  optionText: string;
};

export type UserPracticeQuestionResponse = {
  id: number;
  practiceSetQuestionId?: number;
  questionId: number;
  sortOrder: number;
  questionText: string;
  options: UserPracticeQuestionOptionResponse[];
};

export type UserPracticeSetDetailResponseData = {
  id: number;
  moduleId: number | null;
  title: string;
  description: string | null;
  partNo: number | null;
  targetScore: number | null;
  setType: string;
  durationMinutes: number | null;
  published: boolean;
  questionCount?: number | null;
  questions?: UserPracticeQuestionResponse[];
};

export type UserPracticeAttemptResponse = {
  id: number;
  attemptId?: number;
  userId?: number;
  practiceSetId: number;
  practiceSetTitle: string;
  moduleId?: number | null;
  moduleTitle?: string | null;
  startedAt: string;
  submittedAt?: string | null;
  score?: number | null;
  correctCount?: number | null;
  totalQuestions: number;
  durationSeconds?: number | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UserPracticeAnswerResult = {
  practiceSetQuestionId: number;
  questionId?: number;
  sortOrder?: number | null;
  partNo?: number | null;
  questionText: string;
  explanation?: string | null;
  difficultyLevel?: string | null;
  sourceType?: string | null;
  sourceYear?: number | null;
  selectedOptionId?: number | null;
  selectedLabel: string;
  selectedText?: string | null;
  correctOptionId?: number | null;
  correctLabel: string;
  correctText?: string | null;
  correct: boolean;
  options?: {
    id: number;
    optionLabel: string;
    optionText: string;
    correct?: boolean | null;
  }[];
};

export type UserPracticeAttemptDetailResponseData = {
  attemptId: number;
  practiceSetId: number;
  practiceSetTitle: string;
  startedAt: string;
  submittedAt?: string | null;
  score?: number | null;
  correctCount?: number | null;
  totalQuestions: number;
  answers?: UserPracticeAnswerResult[];
};

export type PracticeAnswerSubmission = {
  practiceSetQuestionId: number;
  selectedLabel: string;
};

export type SubmitPracticeAttemptRequest = {
  answers: PracticeAnswerSubmission[];
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

export type UserGrammarListItem = {
  id: number;
  title: string;
  content: string;
  tips: string | null;
  example: string | null;
  active: boolean;
  isFavorite: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UserFavoriteGrammarTitleItem = {
  id: number;
  savedAt: string;
  title: string;
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

export type UserTestResponse = {
  id: number;
  title: string;
  description: string | null;
  testType: string;
  totalDurationMinutes: number;
  published: boolean;
  parts?: UserTestPartResponse[];
};

export type UserTestPartResponse = {
  id: number;
  partName: string;
  partNumber: number;
  description: string | null;
  durationMinutes: number;
  questionCount: number;
  questions?: UserTestPartQuestionResponse[];
};

export type UserTestPartQuestionResponse = {
  id: number;
  questionId: number;
  sortOrder: number;
  questionText: string;
  options: {
    id: number;
    optionLabel: string;
    optionText: string;
  }[];
};

export type UserTestLeaderboardItem = {
  userId: number;
  fullName: string;
  avatarUrl: string | null;
  totalScore: number;
  totalAttempts: number;
  position: number;
};

export type TestAttemptResponse = {
  attemptId: number;
  testId: number;
  testTitle: string;
  startedAt: string;
  submittedAt?: string | null;
  score?: number | null;
  correctCount?: number | null;
  totalQuestions: number;
  answers?: QuestionAnswerResult[];
};

export type QuestionAnswerResult = {
  testPartQuestionId: number;
  partNo?: number | null;
  questionText: string;
  explanation?: string | null;
  difficultyLevel?: string | null;
  sourceType?: string | null;
  sourceYear?: number | null;
  selectedLabel: string;
  correctLabel: string;
  correct: boolean;
  options?: {
    optionLabel: string;
    optionText: string;
    correct?: boolean | null;
  }[];
};

export type ExplainQuestionRequest = {
  testPartQuestionId: number;
  selectedAnswer: string;
  type: "EXPLANATION" | "TIPS" | "BOTH";
};

export type QuestionExplainResponse = {
  correctAnswer: string;
  explanation: string;
  tips: string;
  userAnswer: string;
};

export type SubmitTestAttemptRequest = {
  answers: AnswerSubmission[];
};

export type AnswerSubmission = {
  testPartQuestionId: number;
  selectedLabel: string;
};

export type UserProfileResponse = ApiResponse<UserProfile>;
export type UserStreakResponse = ApiResponse<UserStreak>;
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

export type UserTestListResponse = ApiResponse<UserTestResponse[]>;
export type UserTestDetailResponse = ApiResponse<UserTestResponse>;
export type UserTestLeaderboardResponse = ApiResponse<UserTestLeaderboardItem[]>;
export type TestAttemptApiResponse = ApiResponse<TestAttemptResponse>;
export type TestAttemptListApiResponse = ApiResponse<TestAttemptResponse[]>;
export type QuestionExplainApiResponse = ApiResponse<QuestionExplainResponse>;

export type UserPracticeSetListApiResponse = ApiResponse<PracticeSetApiItem[]>;
export type UserPracticeSetDetailApiResponse = ApiResponse<UserPracticeSetDetailResponseData>;
export type UserPracticeAttemptApiResponse = ApiResponse<UserPracticeAttemptResponse>;
export type UserPracticeAttemptListApiResponse = ApiResponse<UserPracticeAttemptResponse[]>;
export type UserPracticeAttemptDetailApiResponse = ApiResponse<UserPracticeAttemptDetailResponseData>;

export type UserGrammarListResponse = ApiResponse<UserGrammarListItem[]>;
export type UserGrammarDetailResponse = ApiResponse<UserGrammarListItem>;
export type UserFavoriteGrammarTitleListResponse = ApiResponse<UserFavoriteGrammarTitleItem[]>;
