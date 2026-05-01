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

export type UserProfileResponse = ApiResponse<UserProfile>;
export type FlashcardsResponse = ApiResponse<FlashcardApiItem[]>;
export type UserLearningPathAssignmentResponse =
  ApiResponse<UserLearningPathAssignment>;
