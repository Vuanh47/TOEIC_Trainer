import { Redirect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
import {
  AdminFlashcardService,
  AdminLearningModuleService,
  AdminLearningPathMilestoneService,
  AdminLearningPathService,
  AdminMilestoneModuleService,
  AdminPermissionService,
  AdminPracticeSetService,
  AdminQuestionService,
  AdminVideoLessonService,
} from "@/src/services/admin";
import {
  AdminFlashcardApiItem,
  LearningModuleApiItem,
  LearningPathApiItem,
  LearningPathMilestoneApiItem,
  MilestoneModuleApiItem,
  PermissionApiItem,
  PracticeSetApiItem,
  PracticeSetQuestionApiItem,
  QuestionApiItem,
  VideoLessonApiItem,
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

const videoFields = (modules: LearningModuleApiItem[]): AdminField[] => [
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
  { name: "courseId", label: "Course ID", type: "number" },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "videoUrl", label: "Video URL", type: "text", required: true },
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

const practiceSetQuestionFields: AdminField[] = [
  { name: "questionId", label: "Question ID", type: "number", required: true },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
];

export default function AdminDashboardScreen() {
  const { auth, isHydrated } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSectionKey>("paths");
  const [paths, setPaths] = useState<LearningPathApiItem[]>([]);
  const [milestones, setMilestones] = useState<LearningPathMilestoneApiItem[]>(
    [],
  );
  const [modules, setModules] = useState<LearningModuleApiItem[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const services = useMemo(() => {
    if (!auth.accessToken) return null;
    return {
      flashcards: new AdminFlashcardService(auth.accessToken),
      milestones: new AdminLearningPathMilestoneService(auth.accessToken),
      modules: new AdminLearningModuleService(auth.accessToken),
      paths: new AdminLearningPathService(auth.accessToken),
      permissions: new AdminPermissionService(auth.accessToken),
      practiceSets: new AdminPracticeSetService(auth.accessToken),
      questions: new AdminQuestionService(auth.accessToken),
      links: new AdminMilestoneModuleService(auth.accessToken),
      videos: new AdminVideoLessonService(auth.accessToken),
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
      error instanceof Error ? error.message : "Khong the xu ly yeu cau.",
    );
  }, []);

  const loadBaseData = useCallback(async () => {
    if (!services) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const [
        pathResponse,
        moduleResponse,
        questionResponse,
        permissionResponse,
      ] = await Promise.all([
        services.paths.getAll(),
        services.modules.getAll(),
        services.questions.getAll(),
        services.permissions.getAll(),
      ]);
      const nextPaths = pathResponse.data ?? [];
      const nextModules = moduleResponse.data ?? [];
      setPaths(nextPaths);
      setModules(nextModules);
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

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

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
        <Text style={styles.mobileNotice}>Admin dashboard chi ho tro web.</Text>
      </AdminShell>
    );
  }

  const requirePath = () => {
    if (!selectedPathId) throw new Error("Hay chon learning path truoc.");
    return selectedPathId;
  };

  const requireMilestone = () => {
    if (!selectedMilestoneId) throw new Error("Hay chon milestone truoc.");
    return selectedMilestoneId;
  };

  const requireModule = () => {
    if (!selectedModuleId) throw new Error("Hay chon module truoc.");
    return selectedModuleId;
  };

  const requirePracticeSet = () => {
    if (!selectedPracticeSetId) throw new Error("Hay chon practice set truoc.");
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
            <Text style={styles.selectorEmpty}>Chua co du lieu</Text>
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
            ? `Dang quan ly milestones cua ${selectedPath.title}`
            : "Chon learning path"
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
          confirmWeb(`Deactivate module "${item.title}"?`)
            ? runAction(
                () =>
                  services!.modules.deactivate(item.id).then(() => undefined),
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
            : "Chon module"
        }
        title="Flashcard APIs"
        working={working}
      />
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
        fields={videoFields(modules)}
        getInitialValues={(item?: VideoLessonApiItem) => ({
          courseId: String(item?.courseId ?? ""),
          description: item?.description ?? "",
          durationSeconds: String(item?.durationSeconds ?? 900),
          free: item?.free ?? false,
          moduleId: String(item?.moduleId ?? selectedModuleId ?? ""),
          published: item?.published ?? true,
          sortOrder: String(item?.sortOrder ?? videos.length + 1),
          title: item?.title ?? "",
          videoUrl: item?.videoUrl ?? "",
        })}
        getItemId={(item) => item.id}
        onCreate={(values) =>
          runAction(
            () => {
              const payload = {
                courseId: numberValue(values, "courseId"),
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
              console.log('Creating video payload', payload);
              return services!.videos.create(payload).then(() => undefined);
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
                courseId: numberValue(values, "courseId"),
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
          { label: "Question", render: (item) => String(item.questionId) },
          { label: "Order", render: (item) => String(item.sortOrder) },
        ]}
        fields={practiceSetQuestionFields}
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
          confirmWeb(`Go question #${item.questionId} khoi practice set?`)
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
            ? `Dang gan cau hoi cho ${selectedPracticeSet.title}`
            : "Chon practice set"
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

  const renderActiveSection = () => {
    if (activeSection === "paths") return renderPaths();
    if (activeSection === "milestones") return renderMilestones();
    if (activeSection === "modules") return renderModules();
    if (activeSection === "content") return renderContent();
    if (activeSection === "questions") return renderQuestions();
    return renderPermissions();
  };

  return (
    <AdminShell>
      <AdminTopBar adminName={auth.user?.fullName ?? "Admin"} />
      <View style={styles.layout}>
        <AdminSidebar
          activeItemId={activeSection}
          items={adminSidebarItems}
          onSelect={(id) => setActiveSection(id as AdminSectionKey)}
        />
        <View style={styles.mainPanel}>
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageEyebrow}>Backend Admin APIs</Text>
              <Text style={styles.pageTitle}>{activeSectionLabel}</Text>
            </View>
            <View style={styles.metricRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{paths.length}</Text>
                <Text style={styles.metricLabel}>Paths</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{modules.length}</Text>
                <Text style={styles.metricLabel}>Modules</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{questions.length}</Text>
                <Text style={styles.metricLabel}>Questions</Text>
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
