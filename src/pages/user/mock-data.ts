import { FlashcardItem, GoalPlan, LessonUnit, NotebookEntry, TestQuestion } from "@/src/types/user";

export const userProfile = {
  completionRate: 62,
  fullName: "Alex",
  studyHours: 124.5,
  streakDays: 7,
  targetScore: 800,
};

export const goalPlans: GoalPlan[] = [
  {
    accentColor: "#CFE0FF",
    description: "Danh cho nguoi moi bat dau hoac muon cung co lai kien thuc nen tang co ban nhat.",
    id: "goal-300",
    level: "Cap do 1",
    subtitle: "Hanh trinh bat dau tu day",
    title: "Muc tieu 300+",
  },
  {
    accentColor: "#D8F6D9",
    badge: "Pho bien nhat",
    description: "Dat chuan dau ra dai hoc va tu tin giao tiep trong moi truong cong so quoc te.",
    id: "goal-500",
    level: "Cap do 2",
    subtitle: "Danh cho ban da co nen tang",
    title: "Muc tieu 500+",
  },
  {
    accentColor: "#E2E5FF",
    description: "But pha gioi han, chinh phuc cac vi tri quan ly va hoc bong quoc te danh gia.",
    id: "goal-800",
    level: "Cap do 3",
    subtitle: "Tong on tang toc de ve dich",
    title: "Muc tieu 800+",
  },
];

export const focusAreas = [
  { accuracy: "42%", color: "#FFD7D1", title: "Prepositions of Time", tone: "Focus needed" },
  { accuracy: "88%", color: "#D7FFD8", title: "Business Vocabulary", tone: "Mastered" },
];

export const achievementCards = [
  { icon: "medal-outline", locked: false, title: "Chuoi hoc 7 ngay", subtitle: "Consistency master", tint: "#A7FF9B" },
  { icon: "book-outline", locked: false, title: "Thanh tu vung", subtitle: "1,000+ words learnt", tint: "#D3DFFF" },
  { icon: "flash-outline", locked: false, title: "Phan xa nhanh", subtitle: "Blitz drill expert", tint: "#9DFF9D" },
  { icon: "lock-closed-outline", locked: true, title: "Chuyen gia nghe", subtitle: "Locked", tint: "#EAEAF2" },
];

export const flashcards: FlashcardItem[] = [
  {
    example: "The interior design feels aesthetic and calming.",
    id: "flash-1",
    meaning: "co tinh tham my, dep ve mat nghe thuat",
    phonetic: "/es'0et.ik/",
    progressLabel: "42 / 100 Cards",
    word: "aesthetic",
  },
  {
    example: "Her supervisor praised the concise report.",
    id: "flash-2",
    meaning: "ngan gon, suc tich",
    phonetic: "/kənˈsaɪs/",
    progressLabel: "43 / 100 Cards",
    word: "concise",
  },
  {
    example: "The board approved the revised proposal.",
    id: "flash-3",
    meaning: "duoc chinh sua",
    phonetic: "/rɪˈvaɪzd/",
    progressLabel: "44 / 100 Cards",
    word: "revised",
  },
];

export const lessonUnits: LessonUnit[] = [
  { id: "nouns", progress: 100, status: "done", title: "Nouns & Pronouns" },
  { id: "sentence", progress: 100, status: "done", title: "Sentence Structure" },
  { id: "active-voices", progress: 45, status: "current", title: "Unit 3: Active Voices" },
  { id: "prepositions", progress: 0, status: "locked", title: "Prepositions" },
  { id: "conditional", progress: 0, status: "locked", title: "Conditional Clauses" },
];

export const notebookEntries: NotebookEntry[] = [
  {
    category: "Grammar",
    createdAt: "Added 2 days ago",
    id: "note-1",
    title: "Phan biet 'Since' vs 'For' trong thi hien tai hoan thanh",
  },
  {
    category: "Part 7 tip",
    createdAt: "Added 5 days ago",
    id: "note-2",
    title: "Cach quet tu khoa trong bai doc Email noi bo",
  },
  {
    category: "Vocabulary",
    createdAt: "Added 1 week ago",
    id: "note-3",
    title: "10 Phrasal Verbs pho bien ve chu de Tai chinh",
  },
];

export const transcriptSegments = [
  {
    id: "segment-1",
    noteTime: "05:22",
    time: "00:13",
    title: "Chu y thay dong tu",
    text: "Trong cau nay can nghen van 'to rent' de biet truong noi bien tai dien ra o dau trong boi canh.",
  },
  {
    id: "segment-2",
    noteTime: "06:17",
    time: "00:42",
    title: "Cau truc Present Continuous",
    text: "Dang cho van dang dien ra nen nghieng sang am vi du 'he was running water'.",
  },
  {
    id: "segment-3",
    noteTime: "01:25",
    time: "00:58",
    title: "Mot guest voi tips",
    text: "Gap tu location thi uu tien loai bo dap an mo ta hanh dong khong lien quan.",
  },
];

export const examQuestion: TestQuestion = {
  correctOptionId: "B",
  highlight: "immediately",
  id: "exam-142",
  options: [
    { id: "A", label: "A", value: "Immediate" },
    { id: "B", label: "B", value: "Immediately" },
    { id: "C", label: "C", value: "Immediacy" },
    { id: "D", label: "D", value: "Immediateness" },
  ],
  part: "Part 5: Incomplete Sentences",
  progressText: "Question 142 / 200",
  prompt:
    "The board of directors is pleased to announce that Mr. Henderson has been promoted to the position of Senior Vice President of Operations, effective immediately following the merger.",
};
