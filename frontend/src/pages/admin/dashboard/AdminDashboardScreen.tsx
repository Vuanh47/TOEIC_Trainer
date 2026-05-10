import { Redirect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, spacing } from "@/src/assets/styles/theme";
import AdminCrudPanel, {
  AdminField,
  FormValues,
} from "@/src/components/admin/AdminCrudPanel";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminTopBar from "@/src/components/admin/AdminTopBar";
import { useAuth } from "@/src/hooks/use-auth";
import { adminSidebarItems } from "@/src/pages/admin/dashboard/mock-data";
import { logout } from "@/src/services/auth.service";
import {
  AdminFlashcardService,
  AdminGrammarService,
  AdminLearningModuleService,
  AdminLearningPathMilestoneService,
  AdminLearningPathService,
  AdminMilestoneModuleService,
  AdminPermissionService,
  AdminPracticeSetService,
  AdminQuestionService,
  AdminVideoLessonService,
  AdminTestService,
} from "@/src/services/admin";
import {
  AdminFlashcardApiItem,
  GrammarApiItem,
  LearningModuleApiItem,
  LearningPathApiItem,
  LearningPathMilestoneApiItem,
  MilestoneModuleApiItem,
  PermissionApiItem,
  PracticeSetApiItem,
  PracticeSetQuestionApiItem,
  QuestionApiItem,
  VideoLessonApiItem,
  TestApiItem,
  TestPartApiItem,
  TestPartQuestionApiItem,
} from "@/src/types/admin-api";
import { AdminSectionKey } from "@/src/types/admin";
import { confirmWeb } from "@/src/utils/web-dialog";

const moduleTypeOptions = [
  "VOCABULARY",
  "GRAMMAR",
  "PRACTICE",
  "MOCK_TEST",
  "VIDEO",
  "TIPS",
].map((value) => ({ label: value, value }));
const practiceSetTypeOptions = ["PRACTICE", "PLACEMENT"].map((value) => ({
  label: value,
  value,
}));
const sourceTypeOptions = ["ETS", "HACKER", "INTERNAL"].map((value) => ({
  label: value,
  value,
}));
const correctLabelOptions = ["A", "B", "C", "D"].map((value) => ({
  label: value,
  value,
}));

function text(values: FormValues, key: string, required = false) {
  const value = String(values[key] ?? "").trim();
  if (required && !value) {
    throw new Error(`Thieu truong ${key}.`);
  }
  return value;
}

function nullableText(values: FormValues, key: string) {
  const value = text(values, key);
  return value.length > 0 ? value : null;
}

function numberValue(values: FormValues, key: string, required = false) {
  const raw = text(values, key, required);
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${key} phai la so hop le.`);
  }
  return Math.floor(parsed);
}

function boolValue(values: FormValues, key: string) {
  return Boolean(values[key]);
}

function yesNo(value: boolean | null | undefined) {
  return value ? "Yes" : "No";
}

const pathFields: AdminField[] = [
  { name: "code", label: "Code", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "targetScore",
    label: "Target score",
    type: "number",
    required: true,
  },
  { name: "description", label: "Description", type: "textarea" },
  { name: "active", label: "Active", type: "switch" },
];

const milestoneFields: AdminField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea" },
];

const moduleFields: AdminField[] = [
  {
    name: "moduleType",
    label: "Module type",
    type: "select",
    options: moduleTypeOptions,
    required: true,
  },
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "estimatedMinutes",
    label: "Estimated minutes",
    type: "number",
    required: true,
  },
  { name: "difficultyLevel", label: "Difficulty level", type: "text" },
  { name: "thumbnailUrl", label: "Thumbnail URL", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "active", label: "Active", type: "switch" },
];

const milestoneModuleFields = (
  modules: LearningModuleApiItem[],
): AdminField[] => [
  {
    name: "moduleId",
    label: "Module ID",
    type: "select",
    required: true,
    options: modules.map((module) => ({
      label: `${module.id} - ${module.title}`,
      value: String(module.id),
    })),
  },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
  { name: "unlockCondition", label: "Unlock condition", type: "text" },
  { name: "required", label: "Required", type: "switch" },
];

const flashcardFields: AdminField[] = [
  { name: "englishWord", label: "English word", type: "text", required: true },
  { name: "meaningVi", label: "Meaning VI", type: "text", required: true },
  { name: "pronunciation", label: "Pronunciation", type: "text" },
  { name: "exampleSentence", label: "Example sentence", type: "textarea" },
  { name: "active", label: "Active", type: "switch" },
];

const grammarFields: AdminField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "content", label: "Content", type: "textarea", required: true },
  { name: "tips", label: "Tips", type: "textarea" },
  { name: "example", label: "Example", type: "textarea" },
  { name: "active", label: "Active", type: "switch" },
];

const videoFields = (
  modules: LearningModuleApiItem[],
  uploadedVideoUrl?: string,
): AdminField[] => [
  {
    name: "moduleId",
    label: "Module",
    type: "select",
    required: true,
    options: modules.map((module) => ({
      label: `${module.id} - ${module.title}`,
      value: String(module.id),
    })),
  },
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "videoUrl",
    label: "Video URL",
    placeholder: uploadedVideoUrl ? "Đã upload xong, giữ URL này để tạo lesson." : "https://...",
    type: "text",
    required: true,
  },
  {
    name: "durationSeconds",
    label: "Duration seconds",
    type: "number",
    required: true,
  },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "free", label: "Free", type: "switch" },
  { name: "published", label: "Published", type: "switch" },
];

const practiceSetFields: AdminField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "setType",
    label: "Set type",
    type: "select",
    options: practiceSetTypeOptions,
    required: true,
  },
  { name: "partNo", label: "Part No", type: "number" },
  { name: "targetScore", label: "Target score", type: "number" },
  {
    name: "durationMinutes",
    label: "Duration minutes",
    type: "number",
    required: true,
  },
  { name: "description", label: "Description", type: "textarea" },
  { name: "published", label: "Published", type: "switch" },
];

const questionFields: AdminField[] = [
  { name: "partNo", label: "Part No", type: "number", required: true },
  {
    name: "questionText",
    label: "Question text",
    type: "textarea",
    required: true,
  },
  { name: "difficultyLevel", label: "Difficulty level", type: "text" },
  {
    name: "sourceType",
    label: "Source type",
    type: "select",
    options: sourceTypeOptions,
  },
  { name: "sourceYear", label: "Source year", type: "number" },
  { name: "optionA", label: "Option A", type: "text", required: true },
  { name: "optionB", label: "Option B", type: "text", required: true },
  { name: "optionC", label: "Option C", type: "text", required: true },
  { name: "optionD", label: "Option D", type: "text", required: true },
  {
    name: "correctLabel",
    label: "Correct option",
    type: "select",
    options: correctLabelOptions,
    required: true,
  },
  { name: "explanation", label: "Explanation", type: "textarea" },
];

const testTypeOptions = [
  { label: "Full Test", value: "FULL_TEST" },
  { label: "Reading Only", value: "READING_ONLY" },
  { label: "Listening Only", value: "LISTENING_ONLY" },
  { label: "Practice", value: "PRACTICE" },
];

const testFields: AdminField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "testType", label: "Test type", type: "select", options: testTypeOptions, required: true },
  { name: "totalDurationMinutes", label: "Duration", type: "number", required: true },
  { name: "targetScore", label: "Target score", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "published", label: "Published", type: "switch" },
];

const partSectionOptions = [
  { label: "Listening", value: "LISTENING" },
  { label: "Reading", value: "READING" },
];

const testPartFields: AdminField[] = [
  { name: "partName", label: "Part name", type: "text", required: true },
  { name: "partNumber", label: "Part number", type: "number", required: true },
  { name: "partSection", label: "Section", type: "select", options: partSectionOptions, required: true },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
  { name: "durationMinutes", label: "Duration", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea" },
];
const testPartQuestionFields = (questions: QuestionApiItem[]): AdminField[] => [
  {
    name: "questionId",
    label: "Question",
    type: "select",
    required: true,
    options: questions.map((q) => ({
      label: `[#${q.id}] ${q.questionText.substring(0, 50)}${q.questionText.length > 50 ? "..." : ""}`,
      value: String(q.id),
    })),
  },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
];

const practiceSetQuestionFields = (questions: QuestionApiItem[]): AdminField[] => [
  {
    name: "questionId",
    label: "Question",
    type: "select",
    required: true,
    options: questions.map((q) => ({
      label: `[#${q.id}] ${q.questionText.substring(0, 50)}${q.questionText.length > 50 ? "..." : ""}`,
      value: String(q.id),
    })),
  },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
];

export default function AdminDashboardScreen() {
  const { auth, isHydrated, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSectionKey>("paths");
  const [paths, setPaths] = useState<LearningPathApiItem[]>([]);
  const [milestones, setMilestones] = useState<LearningPathMilestoneApiItem[]>(
    [],
  );
  const [modules, setModules] = useState<LearningModuleApiItem[]>([]);
  const [grammars, setGrammars] = useState<GrammarApiItem[]>([]);
  const [milestoneModules, setMilestoneModules] = useState<
    MilestoneModuleApiItem[]
  >([]);
  const [flashcards, setFlashcards] = useState<AdminFlashcardApiItem[]>([]);
  const [videos, setVideos] = useState<VideoLessonApiItem[]>([]);
  const [practiceSets, setPracticeSets] = useState<PracticeSetApiItem[]>([]);
  const [questions, setQuestions] = useState<QuestionApiItem[]>([]);
  const [practiceSetQuestions, setPracticeSetQuestions] = useState<
    PracticeSetQuestionApiItem[]
  >([]);
  const [permissions, setPermissions] = useState<PermissionApiItem[]>([]);
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number | null>(
    null,
  );
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedPracticeSetId, setSelectedPracticeSetId] = useState<
    number | null
  >(null);
  const [tests, setTests] = useState<TestApiItem[]>([]);
  const [testParts, setTestParts] = useState<TestPartApiItem[]>([]);
  const [testPartQuestions, setTestPartQuestions] = useState<TestPartQuestionApiItem[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [selectedTestPartId, setSelectedTestPartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [working, setWorking] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
  const [uploadedVideoDuration, setUploadedVideoDuration] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const services = useMemo(() => {
    if (!auth.accessToken) return null;
    return {
      flashcards: new AdminFlashcardService(auth.accessToken),
      grammars: new AdminGrammarService(auth.accessToken),
      milestones: new AdminLearningPathMilestoneService(auth.accessToken),
      modules: new AdminLearningModuleService(auth.accessToken),
      paths: new AdminLearningPathService(auth.accessToken),
      permissions: new AdminPermissionService(auth.accessToken),
      practiceSets: new AdminPracticeSetService(auth.accessToken),
      questions: new AdminQuestionService(auth.accessToken),
      links: new AdminMilestoneModuleService(auth.accessToken),
      videos: new AdminVideoLessonService(auth.accessToken),
      tests: new AdminTestService(auth.accessToken),
    };
  }, [auth.accessToken]);

  const selectedPath = paths.find((item) => item.id === selectedPathId) ?? null;
  const selectedMilestone =
    milestones.find((item) => item.id === selectedMilestoneId) ?? null;
  const selectedModule =
    modules.find((item) => item.id === selectedModuleId) ?? null;
  const selectedPracticeSet =
    practiceSets.find((item) => item.id === selectedPracticeSetId) ?? null;

  const getMilestoneTitle = (milestoneId: number | null) =>
    milestones.find((item) => item.id === milestoneId)?.title ??
    `#${milestoneId ?? "-"}`;
  const getModuleTitle = (moduleId: number | null) =>
    modules.find((item) => item.id === moduleId)?.title ??
    `#${moduleId ?? "-"}`;

  const activeSectionLabel =
    adminSidebarItems.find((item) => item.id === activeSection)?.label ??
    "Admin";

  const handleError = useCallback((error: unknown) => {
    setErrorMessage(
      error instanceof Error ? error.message : "Không thể xử lý yêu cầu.",
    );
  }, []);

  const handleUploadVideoFile = useCallback(async () => {
    if (!services) return;
    if (Platform.OS !== "web") {
      Alert.alert("Upload", "Upload file chỉ hỗ trợ trên web.");
      return;
    }

    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "video/*";
    picker.onchange = async () => {
      const file = picker.files?.[0];
      if (!file) return;

      try {
        setUploadingVideo(true);
        setErrorMessage(null);
        setSelectedVideoFile(file);
        const response = await services.videos.upload(file);
        const uploadedUrl = response.data?.playbackUrl ?? response.data?.secureUrl ?? "";
        if (!uploadedUrl) {
          throw new Error("Upload xong nhưng không nhận được URL video.");
        }

        setUploadedVideoUrl(uploadedUrl);
        setUploadedVideoDuration(response.data?.durationSeconds ?? null);
        Alert.alert("Upload", "Upload video thành công. URL đã được điền vào form video.");
      } catch (error) {
        handleError(error);
      } finally {
        setUploadingVideo(false);
      }
    };

    picker.click();
  }, [handleError, services]);

  const handleLogout = useCallback(async () => {
    if (!auth.accessToken || isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await logout(auth.accessToken, auth.tokenType ?? "Bearer");
    } catch {
      // Best-effort API logout. Local session still needs to be cleared.
    } finally {
      signOut();
      setIsLoggingOut(false);
    }
  }, [auth.accessToken, auth.tokenType, isLoggingOut, signOut]);

  const loadBaseData = useCallback(async () => {
    if (!services) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const [
        pathResponse,
        moduleResponse,
        grammarResponse,
        questionResponse,
        permissionResponse,
      ] = await Promise.all([
        services.paths.getAll(),
        services.modules.getAll(),
        services.grammars.getAll(),
        services.questions.getAll(),
        services.permissions.getAll(),
      ]);
      const nextPaths = pathResponse.data ?? [];
      const nextModules = moduleResponse.data ?? [];
      const nextGrammars = grammarResponse.data ?? [];
      setPaths(nextPaths);
      setModules(nextModules);
      setGrammars(nextGrammars);
      setQuestions(questionResponse.data ?? []);
      setPermissions(permissionResponse ?? []);
      setSelectedPathId((current) => current ?? nextPaths[0]?.id ?? null);
      setSelectedModuleId((current) => current ?? nextModules[0]?.id ?? null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError, services]);

  const loadMilestones = useCallback(async () => {
    if (!services || !selectedPathId) {
      setMilestones([]);
      return;
    }
    try {
      const response =
        await services.milestones.getByLearningPathId(selectedPathId);
      const nextMilestones = [...(response.data ?? [])].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      setMilestones(nextMilestones);
      setSelectedMilestoneId((current) =>
        current && nextMilestones.some((item) => item.id === current)
          ? current
          : (nextMilestones[0]?.id ?? null),
      );
    } catch (error) {
      handleError(error);
    }
  }, [handleError, selectedPathId, services]);

  const loadMilestoneModules = useCallback(async () => {
    if (!services || !selectedMilestoneId) {
      setMilestoneModules([]);
      return;
    }
    try {
      const response =
        await services.links.getByMilestoneId(selectedMilestoneId);
      setMilestoneModules(
        [...(response.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
      );
    } catch (error) {
      handleError(error);
    }
  }, [handleError, selectedMilestoneId, services]);

  const loadContent = useCallback(async () => {
    if (!services || !selectedModuleId) {
      setFlashcards([]);
      setVideos([]);
      setPracticeSets([]);
      return;
    }
    try {
      const [flashcardResponse, videoResponse, practiceSetResponse] =
        await Promise.all([
          services.flashcards.getByModuleId(selectedModuleId),
          services.videos.getByModuleId(selectedModuleId),
          services.practiceSets.getByModuleId(selectedModuleId),
        ]);
      const nextPracticeSets = practiceSetResponse.data ?? [];
      setFlashcards(flashcardResponse.data ?? []);
      setVideos(videoResponse.data ?? []);
      setPracticeSets(nextPracticeSets);
      setSelectedPracticeSetId((current) =>
        current && nextPracticeSets.some((item) => item.id === current)
          ? current
          : (nextPracticeSets[0]?.id ?? null),
      );
    } catch (error) {
      handleError(error);
    }
  }, [handleError, selectedModuleId, services]);

  const loadPracticeSetQuestions = useCallback(async () => {
    if (!services || !selectedPracticeSetId) {
      setPracticeSetQuestions([]);
      return;
    }
    try {
      const response = await services.practiceSets.getQuestions(
        selectedPracticeSetId,
      );
      setPracticeSetQuestions(
        [...(response.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
      );
    } catch (error) {
      handleError(error);
    }
  }, [handleError, selectedPracticeSetId, services]);

  const loadTests = useCallback(async () => {
    if (!services) return;
    try {
      const response = await services.tests.getAll();
      const nextTests = response.data ?? [];
      setTests(nextTests);
      setSelectedTestId((current) =>
        current && nextTests.some((item) => item.id === current)
          ? current
          : (nextTests[0]?.id ?? null),
      );
    } catch (error) {
      handleError(error);
    }
  }, [handleError, services]);

  const loadTestParts = useCallback(async () => {
    if (!services || !selectedTestId) {
      setTestParts([]);
      return;
    }
    try {
      const response = await services.tests.getParts(selectedTestId);
      const nextParts = [...(response.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
      setTestParts(nextParts);
      setSelectedTestPartId((current) =>
        current && nextParts.some((item) => item.id === current)
          ? current
          : (nextParts[0]?.id ?? null),
      );
    } catch (error) {
      handleError(error);
    }
  }, [handleError, selectedTestId, services]);

  const loadTestPartQuestions = useCallback(async () => {
    if (!services || !selectedTestPartId) {
      setTestPartQuestions([]);
      return;
    }
    try {
      const response = await services.tests.getPartQuestions(selectedTestPartId);
      setTestPartQuestions([...(response.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (error) {
      handleError(error);
    }
  }, [handleError, selectedTestPartId, services]);

  useEffect(() => {

    loadBaseData();
    loadTests();
  }, [loadBaseData, loadTests]);

  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  useEffect(() => {
    loadMilestoneModules();
  }, [loadMilestoneModules]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    loadPracticeSetQuestions();
  }, [loadPracticeSetQuestions]);

  useEffect(() => {
    loadTestParts();
  }, [loadTestParts]);

  useEffect(() => {
    loadTestPartQuestions();
  }, [loadTestPartQuestions]);

  const runAction = useCallback(

    async (action: () => Promise<void>, reload?: () => Promise<void>) => {
      try {
        setWorking(true);
        setErrorMessage(null);
        await action();
        await (reload ?? loadBaseData)();
      } catch (error) {
        handleError(error);
      } finally {
        setWorking(false);
      }
    },
    [handleError, loadBaseData],
  );

  if (!isHydrated) return null;
  if (!auth.accessToken || auth.user?.role !== "ADMIN")
    return <Redirect href="/admin" />;

  if (Platform.OS !== "web") {
    return (
      <AdminShell>
        <Text style={styles.mobileNotice}>Bảng điều khiển admin chỉ hỗ trợ trên web.</Text>
      </AdminShell>
    );
  }

  const requirePath = () => {
    if (!selectedPathId) throw new Error("Hãy chọn learning path trước.");
    return selectedPathId;
  };

  const requireMilestone = () => {
    if (!selectedMilestoneId) throw new Error("Hãy chọn milestone trước.");
    return selectedMilestoneId;
  };

  const requireModule = () => {
    if (!selectedModuleId) throw new Error("Hãy chọn module trước.");
    return selectedModuleId;
  };

  const requirePracticeSet = () => {
    if (!selectedPracticeSetId) throw new Error("Hãy chọn practice set trước.");
    return selectedPracticeSetId;
  };

  const questionPayload = (values: FormValues) => {
    const correctLabel = text(values, "correctLabel", true);
    return {
      difficultyLevel: nullableText(values, "difficultyLevel"),
      explanation: nullableText(values, "explanation"),
      options: ["A", "B", "C", "D"].map((label) => ({
        correct: label === correctLabel,
        optionLabel: label,
        optionText: text(values, `option${label}`, true),
      })),
      partNo: numberValue(values, "partNo", true),
      questionText: text(values, "questionText", true),
      sourceType: text(values, "sourceType") || null,
      sourceYear: numberValue(values, "sourceYear"),
    };
  };

  const getGrammarInitialValues = (item?: GrammarApiItem): FormValues => ({
    active: item?.active ?? true,
    content: item?.content ?? "",
    example: item?.example ?? "",
    tips: item?.tips ?? "",
    title: item?.title ?? "",
  });

  const reloadGrammars = async () => {
    await loadBaseData();
  };

  const renderSelector = <
    T extends { id: number; title?: string; code?: string },
  >(
    label: string,
    items: T[],
    selectedId: number | null,
    onSelect: (id: number) => void,
  ) => (
    <View style={styles.selectorBlock}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.selectorRow}>
          {items.map((item) => {
            const active = item.id === selectedId;
            return (
              <Pressable
                key={item.id}
                onPress={() => onSelect(item.id)}
                style={[
                  styles.selectorChip,
                  active ? styles.selectorChipActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.selectorText,
                    active ? styles.selectorTextActive : null,
                  ]}
                >
                  #{item.id} {item.title ?? item.code ?? ""}
                </Text>
              </Pressable>
            );
          })}
          {items.length === 0 ? (
            <Text style={styles.selectorEmpty}>Chưa có dữ liệu</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );

  const renderPaths = () => (
    <AdminCrudPanel
      columns={[
        { label: "ID", render: (item) => String(item.id) },
        { label: "Code", render: (item) => item.code },
        { label: "Title", render: (item) => item.title },
        { label: "Target", render: (item) => String(item.targetScore) },
        { label: "Active", render: (item) => yesNo(item.active) },
      ]}
      fields={pathFields}
      getInitialValues={(item?: LearningPathApiItem) => ({
        active: item?.active ?? true,
        code: item?.code ?? "",
        description: item?.description ?? "",
        targetScore: String(item?.targetScore ?? 500),
        title: item?.title ?? "",
      })}
      getItemId={(item) => item.id}
      loading={loading}
      onCreate={(values) =>
        runAction(
          () =>
            services!.paths
              .create({
                active: boolValue(values, "active"),
                code: text(values, "code", true),
                description: nullableText(values, "description"),
                targetScore: numberValue(values, "targetScore", true)!,
                title: text(values, "title", true),
              })
              .then(() => undefined),
          loadBaseData,
        )
      }
      onDelete={(item) =>
        confirmWeb(`Xoa learning path "${item.title}"?`)
          ? runAction(
              () => services!.paths.delete(item.id).then(() => undefined),
              loadBaseData,
            )
          : Promise.resolve()
      }
      onRefresh={loadBaseData}
      onUpdate={(item, values) =>
        runAction(
          () =>
            services!.paths
              .update(item.id, {
                active: boolValue(values, "active"),
                code: text(values, "code", true),
                description: nullableText(values, "description"),
                targetScore: numberValue(values, "targetScore", true)!,
                title: text(values, "title", true),
              })
              .then(() => undefined),
          loadBaseData,
        )
      }
      records={paths}
      subtitle="POST/GET/PUT/DELETE /api/admin/learning-paths"
      title="Learning Path APIs"
      working={working}
    />
  );

  const renderMilestones = () => (
    <View style={styles.stack}>
      {renderSelector(
        "Learning Path",
        paths,
        selectedPathId,
        setSelectedPathId,
      )}
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Path ID", render: (item) => String(item.learningPathId) },
          { label: "Title", render: (item) => item.title },
          { label: "Order", render: (item) => String(item.sortOrder) },
        ]}
        fields={milestoneFields}
        getInitialValues={(item?: LearningPathMilestoneApiItem) => ({
          description: item?.description ?? "",
          sortOrder: String(item?.sortOrder ?? milestones.length + 1),
          title: item?.title ?? "",
        })}
        getItemId={(item) => item.id}
        loading={loading}
        onCreate={(values) =>
          runAction(
            () =>
              services!.milestones
                .create(requirePath(), {
                  description: nullableText(values, "description"),
                  sortOrder: numberValue(values, "sortOrder", true)!,
                  title: text(values, "title", true),
                })
                .then(() => undefined),
            loadMilestones,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa milestone "${item.title}"?`)
            ? runAction(
                () =>
                  services!.milestones
                    .delete(requirePath(), item.id)
                    .then(() => undefined),
                loadMilestones,
              )
            : Promise.resolve()
        }
        onRefresh={loadMilestones}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.milestones
                .update(requirePath(), item.id, {
                  description: nullableText(values, "description"),
                  sortOrder: numberValue(values, "sortOrder", true)!,
                  title: text(values, "title", true),
                })
                .then(() => undefined),
            loadMilestones,
          )
        }
        records={milestones}
        subtitle={
          selectedPath
            ? `Đang quản lý milestones của ${selectedPath.title}`
            : "Chọn learning path"
        }
        title="Learning Path Milestone APIs"
        working={working}
      />
    </View>
  );

  const renderModules = () => (
    <View style={styles.stack}>
      <View style={styles.infoFlow}>
        <Text style={styles.infoFlowTitle}>Luồng gán module</Text>
        <Text style={styles.infoFlowText}>
          1) Chọn lộ trình muốn quản lý. 2) Chọn chặng tương ứng của lộ trình
          đó. 3) Gán module vào chặng và kiểm tra lại bảng bên dưới.
        </Text>
      </View>
      {renderSelector(
        "Learning Path",
        paths,
        selectedPathId,
        setSelectedPathId,
      )}
      {renderSelector(
        "Milestone của lộ trình đã chọn",
        milestones,
        selectedMilestoneId,
        setSelectedMilestoneId,
      )}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Paths</Text>
          <Text style={styles.summaryValue}>{paths.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Milestones</Text>
          <Text style={styles.summaryValue}>{milestones.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Milestone Modules</Text>
          <Text style={styles.summaryValue}>{milestoneModules.length}</Text>
        </View>
      </View>
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Type", render: (item) => item.moduleType },
          { label: "Title", render: (item) => item.title },
          { label: "Minutes", render: (item) => String(item.estimatedMinutes) },
          { label: "Active", render: (item) => yesNo(item.active) },
        ]}
        fields={moduleFields}
        getInitialValues={(item?: LearningModuleApiItem) => ({
          active: item?.active ?? true,
          description: item?.description ?? "",
          difficultyLevel: item?.difficultyLevel ?? "BEGINNER",
          estimatedMinutes: String(item?.estimatedMinutes ?? 30),
          moduleType: item?.moduleType ?? "VOCABULARY",
          thumbnailUrl: item?.thumbnailUrl ?? "",
          title: item?.title ?? "",
        })}
        getItemId={(item) => item.id}
        loading={loading}
        onCreate={(values) =>
          runAction(() =>
            services!.modules
              .create({
                active: boolValue(values, "active"),
                description: nullableText(values, "description"),
                difficultyLevel: nullableText(values, "difficultyLevel"),
                estimatedMinutes: numberValue(
                  values,
                  "estimatedMinutes",
                  true,
                )!,
                moduleType: text(values, "moduleType", true),
                thumbnailUrl: nullableText(values, "thumbnailUrl"),
                title: text(values, "title", true),
              })
              .then(() => undefined),
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa module "${item.title}"?`)
            ? runAction(
                () => services!.modules.delete(item.id).then(() => undefined),
                loadBaseData,
              )
            : Promise.resolve()
        }
        onRefresh={loadBaseData}
        onUpdate={(item, values) =>
          runAction(() =>
            services!.modules
              .update(item.id, {
                active: boolValue(values, "active"),
                description: nullableText(values, "description"),
                difficultyLevel: nullableText(values, "difficultyLevel"),
                estimatedMinutes: numberValue(
                  values,
                  "estimatedMinutes",
                  true,
                )!,
                moduleType: text(values, "moduleType", true),
                thumbnailUrl: nullableText(values, "thumbnailUrl"),
                title: text(values, "title", true),
              })
              .then(() => undefined),
          )
        }
        records={modules}
        subtitle="POST/GET/PUT/DELETE /api/admin/learning-modules"
        title="Learning Module APIs"
        working={working}
      />
      {renderSelector(
        "Milestone",
        milestones,
        selectedMilestoneId,
        setSelectedMilestoneId,
      )}
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          {
            label: "Milestone",
            render: (item) => getMilestoneTitle(item.milestoneId),
          },
          {
            label: "Module",
            render: (item) => getModuleTitle(item.moduleId),
          },
          { label: "Order", render: (item) => String(item.sortOrder) },
          { label: "Required", render: (item) => yesNo(item.required) },
        ]}
        fields={milestoneModuleFields(modules)}
        getInitialValues={(item?: MilestoneModuleApiItem) => ({
          moduleId: String(item?.moduleId ?? selectedModuleId ?? ""),
          required: item?.required ?? true,
          sortOrder: String(item?.sortOrder ?? milestoneModules.length + 1),
          unlockCondition: item?.unlockCondition ?? "NONE",
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.links
                .create(requireMilestone(), {
                  moduleId: numberValue(values, "moduleId", true)!,
                  required: boolValue(values, "required"),
                  sortOrder: numberValue(values, "sortOrder", true)!,
                  unlockCondition: nullableText(values, "unlockCondition"),
                })
                .then(() => undefined),
            loadMilestoneModules,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Go module #${item.moduleId} khoi milestone?`)
            ? runAction(
                () =>
                  services!.links
                    .delete(requireMilestone(), item.id)
                    .then(() => undefined),
                loadMilestoneModules,
              )
            : Promise.resolve()
        }
        onRefresh={loadMilestoneModules}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.links
                .update(requireMilestone(), item.id, {
                  moduleId: numberValue(values, "moduleId", true)!,
                  required: boolValue(values, "required"),
                  sortOrder: numberValue(values, "sortOrder", true)!,
                  unlockCondition: nullableText(values, "unlockCondition"),
                })
                .then(() => undefined),
            loadMilestoneModules,
          )
        }
        records={milestoneModules}
        subtitle={
          selectedPath
            ? selectedMilestone
              ? `Đang gán module cho ${selectedMilestone.title} trong lộ trình ${selectedPath.title}`
              : `Chọn chặng để gán module cho lộ trình ${selectedPath.title}`
            : "Chọn lộ trình trước"
        }
        title="Milestone Module APIs"
        working={working}
      />
    </View>
  );

  const renderContent = () => (
    <View style={styles.stack}>
      {renderSelector(
        "Learning Module",
        modules,
        selectedModuleId,
        setSelectedModuleId,
      )}
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Word", render: (item) => item.englishWord },
          { label: "Meaning", render: (item) => item.meaningVi },
          { label: "Active", render: (item) => yesNo(item.active) },
        ]}
        fields={flashcardFields}
        getInitialValues={(item?: AdminFlashcardApiItem) => ({
          active: item?.active ?? true,
          englishWord: item?.englishWord ?? "",
          exampleSentence: item?.exampleSentence ?? "",
          meaningVi: item?.meaningVi ?? "",
          pronunciation: item?.pronunciation ?? "",
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.flashcards
                .create({
                  active: boolValue(values, "active"),
                  englishWord: text(values, "englishWord", true),
                  exampleSentence: nullableText(values, "exampleSentence"),
                  meaningVi: text(values, "meaningVi", true),
                  moduleId: requireModule(),
                  pronunciation: nullableText(values, "pronunciation"),
                })
                .then(() => undefined),
            loadContent,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa flashcard "${item.englishWord}"?`)
            ? runAction(
                () =>
                  services!.flashcards.delete(item.id).then(() => undefined),
                loadContent,
              )
            : Promise.resolve()
        }
        onRefresh={loadContent}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.flashcards
                .update(item.id, {
                  active: boolValue(values, "active"),
                  englishWord: text(values, "englishWord", true),
                  exampleSentence: nullableText(values, "exampleSentence"),
                  meaningVi: text(values, "meaningVi", true),
                  moduleId: requireModule(),
                  pronunciation: nullableText(values, "pronunciation"),
                })
                .then(() => undefined),
            loadContent,
          )
        }
        records={flashcards}
        subtitle={
          selectedModule
            ? `Module #${selectedModule.id}: ${selectedModule.title}`
            : "Chọn module"
        }
        title="Flashcard APIs"
        working={working}
      />
      <View style={styles.uploadBox}>
        <Text style={styles.uploadTitle}>Tải video lên</Text>
        <Text style={styles.uploadSubtitle}>
          Upload file video len Cloudinary roi dung URL nay de tao lesson.
        </Text>
        <Pressable
          disabled={!services || uploadingVideo || working}
          onPress={handleUploadVideoFile}
          style={styles.uploadButton}
        >
          <Text style={styles.uploadButtonText}>
            {uploadingVideo ? "Đang upload..." : "Chọn file video và upload"}
          </Text>
        </Pressable>
        <Text style={styles.uploadHint}>
          URL moi nhat: {uploadedVideoUrl || "(chua upload)"}
        </Text>
        <Text style={styles.uploadHint}>
          File da chon: {selectedVideoFile?.name ?? "(chua chon file)"}
        </Text>
        {uploadedVideoDuration ? (
          <Text style={styles.uploadHint}>Thời lượng từ Cloudinary: {uploadedVideoDuration}s</Text>
        ) : null}
      </View>
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Title", render: (item) => item.title },
          {
            label: "Duration",
            render: (item) => String(item.durationSeconds ?? "-"),
          },
          { label: "Published", render: (item) => yesNo(item.published) },
        ]}
        fields={videoFields(modules, uploadedVideoUrl)}
        getInitialValues={(item?: VideoLessonApiItem) => ({
          description: item?.description ?? "",
          durationSeconds: String(item?.durationSeconds ?? uploadedVideoDuration ?? 900),
          free: item?.free ?? false,
          moduleId: String(item?.moduleId ?? selectedModuleId ?? ""),
          published: item?.published ?? true,
          sortOrder: String(item?.sortOrder ?? videos.length + 1),
          title: item?.title ?? "",
          videoUrl: item?.videoUrl ?? uploadedVideoUrl ?? "",
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () => {
              const payload = {
                description: nullableText(values, "description"),
                free: boolValue(values, "free"),
                moduleId: numberValue(values, "moduleId", true)!,
                published: boolValue(values, "published"),
                sortOrder: numberValue(values, "sortOrder", true)!,
                title: text(values, "title", true),
              };
              if (selectedVideoFile) {
                return services!.videos
                  .uploadAndCreate(selectedVideoFile, {
                    ...payload,
                    description: payload.description ?? null,
                  })
                  .then(() => {
                    setUploadedVideoUrl("");
                    setUploadedVideoDuration(null);
                    setSelectedVideoFile(null);
                  });
              }

              return services!.videos
                .create({
                  ...payload,
                  durationSeconds: numberValue(values, "durationSeconds", true)!,
                  videoUrl: text(values, "videoUrl", true),
                })
                .then(() => undefined);
            },
            loadContent,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa video "${item.title}"?`)
            ? runAction(
                () => services!.videos.delete(item.id).then(() => undefined),
                loadContent,
              )
            : Promise.resolve()
        }
        onRefresh={loadContent}
        onUpdate={(item, values) =>
          runAction(
            () => {
              const payload = {
                description: nullableText(values, "description"),
                durationSeconds: numberValue(
                  values,
                  "durationSeconds",
                  true,
                )!,
                free: boolValue(values, "free"),
                moduleId: numberValue(values, "moduleId", true)!,
                published: boolValue(values, "published"),
                sortOrder: numberValue(values, "sortOrder", true)!,
                title: text(values, "title", true),
                videoUrl: text(values, "videoUrl", true),
              };
              console.log('Updating video payload', payload);
              return services!.videos.update(item.id, payload).then(() => undefined);
            },
            loadContent,
          )
        }
        records={videos}
        subtitle="POST/GET/PUT/DELETE /api/admin/video-lessons"
        title="Video Lesson APIs"
        working={working}
      />
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Title", render: (item) => item.title },
          { label: "Type", render: (item) => item.setType },
          { label: "Published", render: (item) => yesNo(item.published) },
        ]}
        fields={practiceSetFields}
        getInitialValues={(item?: PracticeSetApiItem) => ({
          description: item?.description ?? "",
          durationMinutes: String(item?.durationMinutes ?? 20),
          partNo: String(item?.partNo ?? 1),
          published: item?.published ?? false,
          setType: item?.setType ?? "PRACTICE",
          targetScore: String(item?.targetScore ?? 300),
          title: item?.title ?? "",
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.practiceSets
                .create({
                  description: nullableText(values, "description"),
                  durationMinutes: numberValue(
                    values,
                    "durationMinutes",
                    true,
                  )!,
                  moduleId: requireModule(),
                  partNo: numberValue(values, "partNo"),
                  published: boolValue(values, "published"),
                  setType: text(values, "setType", true) as
                    | "PRACTICE"
                    | "PLACEMENT",
                  targetScore: numberValue(values, "targetScore"),
                  title: text(values, "title", true),
                })
                .then(() => undefined),
            loadContent,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa practice set "${item.title}"?`)
            ? runAction(
                () =>
                  services!.practiceSets.delete(item.id).then(() => undefined),
                loadContent,
              )
            : Promise.resolve()
        }
        onRefresh={loadContent}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.practiceSets
                .update(item.id, {
                  description: nullableText(values, "description"),
                  durationMinutes: numberValue(
                    values,
                    "durationMinutes",
                    true,
                  )!,
                  moduleId: requireModule(),
                  partNo: numberValue(values, "partNo"),
                  published: boolValue(values, "published"),
                  setType: text(values, "setType", true) as
                    | "PRACTICE"
                    | "PLACEMENT",
                  targetScore: numberValue(values, "targetScore"),
                  title: text(values, "title", true),
                })
                .then(() => undefined),
            loadContent,
          )
        }
        records={practiceSets}
        subtitle="POST/GET/PUT/DELETE /api/admin/practice-sets"
        title="Practice Set APIs"
        working={working}
      />
    </View>
  );

  const renderGrammars = () => (
    <View style={styles.stack}>
      <View style={styles.grammarTopBar}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng số</Text>
            <Text style={styles.summaryValue}>{grammars.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Đang hiển thị</Text>
            <Text style={styles.summaryValue}>
              {grammars.filter((item) => item.active).length}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tam an</Text>
            <Text style={styles.summaryValue}>
              {grammars.filter((item) => !item.active).length}
            </Text>
          </View>
        </View>
        <View style={styles.grammarTopActions}>
          <Pressable
            disabled={working}
            onPress={reloadGrammars}
            style={styles.grammarGhostButton}
          >
            <Text style={styles.grammarGhostButtonText}>Tai lai</Text>
          </Pressable>
        </View>
      </View>

      <AdminCrudPanel
        columns={[
          { label: "Title", render: (item) => item.title },
          { label: "Status", render: (item) => (item.active ? "Active" : "Inactive") },
        ]}
        fields={grammarFields}
        getInitialValues={getGrammarInitialValues}
        getItemId={(item) => item.id}
        loading={loading}
        onCreate={(values) =>
          runAction(
            () =>
              services!.grammars
                .create({
                  active: boolValue(values, "active"),
                  content: text(values, "content", true),
                  example: nullableText(values, "example"),
                  tips: nullableText(values, "tips"),
                  title: text(values, "title", true),
                })
                .then(() => undefined),
            reloadGrammars,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa grammar "${item.title}"?`)
            ? runAction(
                () => services!.grammars.delete(item.id).then(() => undefined),
                reloadGrammars,
              )
            : Promise.resolve()
        }
        onRefresh={reloadGrammars}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.grammars
                .update(item.id, {
                  active: boolValue(values, "active"),
                  content: text(values, "content", true),
                  example: nullableText(values, "example"),
                  tips: nullableText(values, "tips"),
                  title: text(values, "title", true),
                })
                .then(() => undefined),
            reloadGrammars,
          )
        }
        records={grammars}
        subtitle="Chi hien thi title, status va action. Sua se mo modal."
        title="Bang ngu phap"
        working={working}
      />
    </View>
  );

  const renderQuestions = () => (
    <View style={styles.stack}>
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Part", render: (item) => String(item.partNo ?? "-") },
          { label: "Question", render: (item) => item.questionText },
          { label: "Source", render: (item) => item.sourceType ?? "-" },
        ]}
        fields={questionFields}
        getInitialValues={(item?: QuestionApiItem) => {
          const option = (label: string) =>
            item?.options?.find((entry) => entry.optionLabel === label);
          const correct =
            item?.options?.find((entry) => entry.correct)?.optionLabel ?? "A";
          return {
            correctLabel: correct,
            difficultyLevel: item?.difficultyLevel ?? "BEGINNER",
            explanation: item?.explanation ?? "",
            optionA: option("A")?.optionText ?? "",
            optionB: option("B")?.optionText ?? "",
            optionC: option("C")?.optionText ?? "",
            optionD: option("D")?.optionText ?? "",
            partNo: String(item?.partNo ?? 1),
            questionText: item?.questionText ?? "",
            sourceType: item?.sourceType ?? "INTERNAL",
            sourceYear: String(item?.sourceYear ?? new Date().getFullYear()),
          };
        }}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.questions
                .create(questionPayload(values))
                .then(() => undefined),
            loadBaseData,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa question #${item.id}?`)
            ? runAction(
                () => services!.questions.delete(item.id).then(() => undefined),
                loadBaseData,
              )
            : Promise.resolve()
        }
        onRefresh={loadBaseData}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.questions
                .update(item.id, questionPayload(values))
                .then(() => undefined),
            loadBaseData,
          )
        }
        records={questions}
        subtitle="POST/GET/PUT/DELETE /api/admin/questions"
        title="Question Bank APIs"
        working={working}
      />
      {renderSelector(
        "Practice Set",
        practiceSets,
        selectedPracticeSetId,
        setSelectedPracticeSetId,
      )}
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          {
            label: "Practice set",
            render: (item) => String(item.practiceSetId),
          },
          { label: "Question", render: (item) => item.question?.questionText || String(item.questionId) },
          { label: "Order", render: (item) => String(item.sortOrder) },
        ]}
        fields={practiceSetQuestionFields(questions)}
        getInitialValues={(item?: PracticeSetQuestionApiItem) => ({
          questionId: String(item?.questionId ?? questions[0]?.id ?? ""),
          sortOrder: String(item?.sortOrder ?? practiceSetQuestions.length + 1),
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.practiceSets
                .assignQuestions(requirePracticeSet(), {
                  questions: [
                    ...practiceSetQuestions.map((item) => ({
                      questionId: item.questionId,
                      sortOrder: item.sortOrder,
                    })),
                    {
                      questionId: numberValue(values, "questionId", true)!,
                      sortOrder: numberValue(values, "sortOrder", true)!,
                    },
                  ],
                })
                .then(() => undefined),
            loadPracticeSetQuestions,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Gỡ question #${item.questionId} khỏi practice set?`)
            ? runAction(
                () =>
                  services!.practiceSets
                    .assignQuestions(requirePracticeSet(), {
                      questions: practiceSetQuestions
                        .filter((entry) => entry.id !== item.id)
                        .map((entry) => ({
                          questionId: entry.questionId,
                          sortOrder: entry.sortOrder,
                        })),
                    })
                    .then(() => undefined),
                loadPracticeSetQuestions,
              )
            : Promise.resolve()
        }
        onRefresh={loadPracticeSetQuestions}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.practiceSets
                .assignQuestions(requirePracticeSet(), {
                  questions: practiceSetQuestions.map((entry) =>
                    entry.id === item.id
                      ? {
                          questionId: numberValue(values, "questionId", true)!,
                          sortOrder: numberValue(values, "sortOrder", true)!,
                        }
                      : {
                          questionId: entry.questionId,
                          sortOrder: entry.sortOrder,
                        },
                  ),
                })
                .then(() => undefined),
            loadPracticeSetQuestions,
          )
        }
        records={practiceSetQuestions}
        subtitle={
          selectedPracticeSet
            ? `Đang gán câu hỏi cho ${selectedPracticeSet.title}`
            : "Chọn practice set"
        }
        title="Practice Set Question APIs"
        working={working}
      />
    </View>
  );

  const renderPermissions = () => (
    <AdminCrudPanel
      columns={[
        { label: "ID", render: (item) => String(item.id) },
        { label: "Code", render: (item) => item.code },
        { label: "Role", render: (item) => item.role },
      ]}
      fields={[]}
      getInitialValues={() => ({})}
      getItemId={(item) => item.id}
      loading={loading}
      onRefresh={loadBaseData}
      records={permissions}
      subtitle="GET /api/admin/permissions"
      title="Permission APIs"
      working={working}
    />
  );

  const renderTests = () => (
    <View style={styles.stack}>
      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Title", render: (item) => item.title },
          { label: "Type", render: (item) => item.testType },
          { label: "Duration", render: (item) => `${item.totalDurationMinutes}m` },
          { label: "Published", render: (item) => yesNo(item.published) },
        ]}
        fields={testFields}
        getInitialValues={(item?: TestApiItem) => ({
          title: item?.title ?? "",
          testType: item?.testType ?? "FULL_TEST",
          totalDurationMinutes: String(item?.totalDurationMinutes ?? 120),
          targetScore: String(item?.targetScore ?? 500),
          description: item?.description ?? "",
          published: item?.published ?? false,
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.tests
                .create({
                  title: text(values, "title", true),
                  testType: text(values, "testType", true),
                  totalDurationMinutes: numberValue(values, "totalDurationMinutes", true)!,
                  targetScore: numberValue(values, "targetScore", true)!,
                  description: text(values, "description"),
                  published: boolValue(values, "published"),
                })
                .then(() => undefined),
            loadTests,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa test "${item.title}"?`)
            ? runAction(
                () => services!.tests.delete(item.id).then(() => undefined),
                loadTests,
              )
            : Promise.resolve()
        }
        onRefresh={loadTests}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.tests
                .update(item.id, {
                  title: text(values, "title", true),
                  testType: text(values, "testType", true),
                  totalDurationMinutes: numberValue(values, "totalDurationMinutes", true)!,
                  targetScore: numberValue(values, "targetScore", true)!,
                  description: text(values, "description"),
                  published: boolValue(values, "published"),
                })
                .then(() => undefined),
            loadTests,
          )
        }
        records={tests}
        title="Test Management"
        working={working}
      />

      {renderSelector("Manage Parts for Test", tests, selectedTestId, setSelectedTestId)}

      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "No.", render: (item) => String(item.partNumber) },
          { label: "Name", render: (item) => item.partName },
          { label: "Section", render: (item) => item.partSection },
          { label: "Duration", render: (item) => `${item.durationMinutes}m` },
          { label: "Questions", render: (item) => String(item.questionCount) },
        ]}
        fields={testPartFields}
        getInitialValues={(item?: TestPartApiItem) => ({
          partName: item?.partName ?? "",
          partNumber: String(item?.partNumber ?? testParts.length + 1),
          partSection: item?.partSection ?? "LISTENING",
          sortOrder: String(item?.sortOrder ?? testParts.length + 1),
          durationMinutes: String(item?.durationMinutes ?? 45),
          description: item?.description ?? "",
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.tests
                .createPart(selectedTestId!, {
                  partName: text(values, "partName", true),
                  partNumber: numberValue(values, "partNumber", true)!,
                  partSection: text(values, "partSection", true),
                  sortOrder: numberValue(values, "sortOrder", true)!,
                  durationMinutes: numberValue(values, "durationMinutes", true)!,
                  description: text(values, "description"),
                })
                .then(() => undefined),
            loadTestParts,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Xoa part "${item.partName}"?`)
            ? runAction(
                () => services!.tests.deletePart(item.id).then(() => undefined),
                loadTestParts,
              )
            : Promise.resolve()
        }
        onRefresh={loadTestParts}
        onUpdate={(item, values) =>
          runAction(
            () =>
              services!.tests
                .updatePart(item.id, {
                  partName: text(values, "partName", true),
                  partNumber: numberValue(values, "partNumber", true)!,
                  partSection: text(values, "partSection", true),
                  sortOrder: numberValue(values, "sortOrder", true)!,
                  durationMinutes: numberValue(values, "durationMinutes", true)!,
                  description: text(values, "description"),
                })
                .then(() => undefined),
            loadTestParts,
          )
        }
        records={testParts}
        title="Test Part Management"
        working={working}
      />

      {renderSelector("Gán câu hỏi vào part", testParts, selectedTestPartId, setSelectedTestPartId)}

      <AdminCrudPanel
        columns={[
          { label: "ID", render: (item) => String(item.id) },
          { label: "Question", render: (item) => item.questionText || String(item.questionId) },
          { label: "Sort", render: (item) => String(item.sortOrder) },
        ]}
        fields={testPartQuestionFields(questions)}
        getInitialValues={(item?: TestPartQuestionApiItem) => ({
          questionId: String(item?.questionId ?? ""),
          sortOrder: String(item?.sortOrder ?? testPartQuestions.length + 1),
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () =>
              services!.tests
                .assignQuestions(selectedTestPartId!, {
                  questionIds: [numberValue(values, "questionId", true)!],
                })
                .then(() => undefined),
            loadTestPartQuestions,
          )
        }
        onDelete={(item) =>
          confirmWeb(`Gỡ question #${item.questionId} khỏi part?`)
            ? runAction(
                () => services!.tests.removeQuestion(selectedTestPartId!, item.id).then(() => undefined),
                loadTestPartQuestions,
              )
            : Promise.resolve()
        }
        onRefresh={loadTestPartQuestions}
        records={testPartQuestions}
        title="Gán câu hỏi cho part"
        working={working}
      />
    </View>
  );

  const renderActiveSection = () => {

    if (activeSection === "paths") return renderPaths();
    if (activeSection === "milestones") return renderMilestones();
    if (activeSection === "modules") return renderModules();
    if (activeSection === "grammars") return renderGrammars();
    if (activeSection === "content") return renderContent();
    if (activeSection === "questions") return renderQuestions();
    if (activeSection === "tests") return renderTests();
    return renderPermissions();
  };

  return (
    <AdminShell>
      <AdminTopBar
        adminName={auth.user?.fullName ?? "Admin"}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />
      <View style={styles.layout}>
        <AdminSidebar
          activeItemId={activeSection}
          items={adminSidebarItems}
          onSelect={(id) => setActiveSection(id as AdminSectionKey)}
        />
        <View style={styles.mainPanel}>
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageEyebrow}>API quản trị backend</Text>
              <Text style={styles.pageTitle}>{activeSectionLabel}</Text>
            </View>
            <View style={styles.metricRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{paths.length}</Text>
                <Text style={styles.metricLabel}>Lộ trình</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{modules.length}</Text>
                <Text style={styles.metricLabel}>Module</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{questions.length}</Text>
                <Text style={styles.metricLabel}>Câu hỏi</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{grammars.length}</Text>
                <Text style={styles.metricLabel}>Ngữ pháp</Text>
              </View>
            </View>
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <ScrollView style={styles.contentScroller}>
            {renderActiveSection()}
          </ScrollView>
        </View>
      </View>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  contentScroller: {
    flex: 1,
  },
  errorText: {
    backgroundColor: "rgba(249,112,102,0.1)",
    borderColor: "rgba(249,112,102,0.24)",
    borderRadius: 8,
    borderWidth: 1,
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  layout: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.lg,
  },
  mainPanel: {
    backgroundColor: "#101A2C",
    borderColor: "#2A3850",
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    padding: 26,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.26,
    shadowRadius: 48,
  },
  metricCard: {
    backgroundColor: "#132037",
    borderColor: "#2A3B57",
    borderRadius: 14,
    borderLeftColor: colors.accent,
    borderLeftWidth: 3,
    borderWidth: 1,
    minWidth: 94,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
    textTransform: "uppercase",
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  metricValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  mobileNotice: {
    color: colors.text,
    fontSize: 16,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  selectorBlock: {
    backgroundColor: "#111C30",
    borderColor: "#283A55",
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.md,
  },
  selectorChip: {
    backgroundColor: "#0D1627",
    borderColor: "#2B3B54",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectorChipActive: {
    backgroundColor: "#203A61",
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  selectorEmpty: {
    color: colors.textMuted,
    fontSize: 13,
  },
  selectorLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  selectorRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  selectorText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  selectorTextActive: {
    color: colors.text,
    fontWeight: "900",
  },
  detailCard: {
    backgroundColor: "#10213A",
    borderColor: "#2B4D7C",
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.md,
  },
  detailHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  detailSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  detailButton: {
    alignItems: "center",
    backgroundColor: "#2F6EA8",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  detailButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  detailItem: {
    backgroundColor: "#0D1627",
    borderColor: "#26374F",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: 220,
    padding: spacing.md,
  },
  detailItemWide: {
    backgroundColor: "#0D1627",
    borderColor: "#26374F",
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: "100%",
    padding: spacing.md,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },
  grammarWorkspace: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
    alignItems: "flex-start",
  },
  grammarTopBar: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  grammarTopActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginLeft: "auto",
  },
  grammarListCard: {
    backgroundColor: "#111C30",
    borderColor: "#283A55",
    borderRadius: 18,
    borderWidth: 1,
    flexBasis: 320,
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: 380,
    padding: spacing.md,
  },
  grammarDetailCard: {
    backgroundColor: "#13233C",
    borderColor: "#2B4264",
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    flexBasis: 560,
    flexGrow: 999,
    flexShrink: 1,
    minHeight: 520,
    minWidth: 0,
    padding: spacing.lg,
  },
  grammarTableWrap: {
    backgroundColor: "#111C30",
    borderColor: "#283A55",
    borderRadius: 18,
    borderWidth: 1,
    padding: spacing.lg,
  },
  grammarTableScroller: {
    borderColor: "#22364F",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  grammarTable: {
    backgroundColor: "#0F1B2E",
    minWidth: 1480,
  },
  grammarTableHeaderRow: {
    backgroundColor: "#16243A",
    borderBottomColor: "#22364F",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  grammarTableDataRow: {
    borderBottomColor: "#22364F",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  grammarTableDataRowActive: {
    backgroundColor: "rgba(47,110,168,0.12)",
  },
  grammarTableEmptyRow: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 88,
    paddingHorizontal: spacing.md,
  },
  grammarHeaderCell: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    paddingRight: spacing.md,
    textTransform: "uppercase",
  },
  grammarBodyCell: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
    paddingRight: spacing.md,
  },
  grammarIdCol: {
    width: 72,
  },
  grammarTitleCol: {
    width: 220,
  },
  grammarContentCol: {
    width: 360,
  },
  grammarTipsCol: {
    width: 280,
  },
  grammarExampleCol: {
    width: 280,
  },
  grammarStatusCol: {
    width: 120,
  },
  grammarActionsCol: {
    width: 180,
  },
  grammarStatusCellWrap: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  grammarActionsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  grammarMiniPrimaryButton: {
    alignItems: "center",
    backgroundColor: "#2F6EA8",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 36,
    minWidth: 72,
    paddingHorizontal: 12,
  },
  grammarMiniPrimaryButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "800",
  },
  grammarBlockHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  grammarBlockTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  grammarBlockSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  grammarHeaderActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "flex-start",
  },
  grammarGhostButton: {
    alignItems: "center",
    backgroundColor: "#16243A",
    borderColor: "#304764",
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  grammarGhostButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  grammarPrimaryButton: {
    alignItems: "center",
    backgroundColor: "#2F6EA8",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  grammarPrimaryButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },
  grammarDangerButton: {
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.16)",
    borderColor: "rgba(239,68,68,0.36)",
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  grammarDangerButtonText: {
    color: "#FFB4B4",
    fontSize: 13,
    fontWeight: "800",
  },
  grammarList: {
    gap: spacing.sm,
  },
  grammarListItem: {
    backgroundColor: "#0D1627",
    borderColor: "#23354F",
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.md,
  },
  grammarListItemActive: {
    backgroundColor: "#173155",
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  grammarListItemTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  grammarListItemTitle: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    paddingRight: spacing.sm,
  },
  grammarListItemExcerpt: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  grammarStatusBadge: {
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: "uppercase",
  },
  grammarStatusBadgeOn: {
    backgroundColor: "rgba(34,197,94,0.18)",
    color: "#9EF0B7",
  },
  grammarStatusBadgeOff: {
    backgroundColor: "rgba(148,163,184,0.18)",
    color: "#D0D9E5",
  },
  grammarHero: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  grammarHeroMain: {
    backgroundColor: "#0F1B2E",
    borderColor: "#22364F",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    flexBasis: 380,
    minWidth: 0,
    padding: spacing.lg,
  },
  grammarHeroTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  grammarHeroContent: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  grammarMetaCard: {
    backgroundColor: "#0F1B2E",
    borderColor: "#22364F",
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: 220,
    flexGrow: 1,
    justifyContent: "center",
    minWidth: 220,
    padding: spacing.lg,
  },
  grammarMetaLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  grammarMetaValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
  },
  grammarInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  grammarInfoCard: {
    backgroundColor: "#0F1B2E",
    borderColor: "#22364F",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minWidth: 260,
    padding: spacing.lg,
  },
  grammarMetaList: {
    gap: spacing.sm,
  },
  grammarMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grammarMetaRowLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  grammarMetaRowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  grammarInfoLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  grammarInfoValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  uploadBox: {
    backgroundColor: "#10213A",
    borderColor: "#2B4D7C",
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.md,
  },
  uploadButton: {
    alignItems: "center",
    backgroundColor: "#2F6EA8",
    borderRadius: 10,
    marginTop: spacing.sm,
    paddingVertical: 12,
  },
  uploadButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
  },
  uploadHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  uploadSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  uploadTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: "#0F1B2E",
    borderColor: "#22364F",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minWidth: 108,
    padding: spacing.md,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  infoFlow: {
    backgroundColor: "#0F2139",
    borderColor: "#1E3A62",
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
  },
  infoFlowText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  infoFlowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  stack: {
    gap: spacing.lg,
  },
  pageEyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  pageHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 2,
  },
});
