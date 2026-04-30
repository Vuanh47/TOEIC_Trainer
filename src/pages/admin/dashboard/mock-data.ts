import { AdminCourse, AdminLessonWord, AdminSidebarItem } from '@/src/types/admin';

export const adminSidebarItems: AdminSidebarItem[] = [
  { id: 'paths', icon: 'map-outline', label: 'Learning Paths' },
  { id: 'milestones', icon: 'flag-outline', label: 'Milestones' },
  { id: 'modules', icon: 'albums-outline', label: 'Modules' },
  { id: 'content', icon: 'document-text-outline', label: 'Content APIs' },
  { id: 'questions', icon: 'help-circle-outline', label: 'Questions' },
  { id: 'permissions', icon: 'key-outline', label: 'Permissions' },
];

export const adminCourseData: AdminCourse = {
  id: 1,
  level: 'Level 1',
  title: 'Basic English',
  modules: [
    {
      id: 11,
      title: 'Module 1: Greetings',
      type: 'module',
      lessons: [
        { id: 101, title: 'Lesson 1: Hello & Goodbye', type: 'lesson' },
        { id: 102, title: 'Lesson 2: Introductions', type: 'lesson' },
        { id: 103, title: 'Lesson 3: Communication', type: 'lesson' },
        { id: 104, title: 'Lesson 4: Film English', type: 'lesson' },
      ],
    },
  ],
};

export const adminVocabularyData: AdminLessonWord[] = [
  {
    id: 1,
    audio: 'audio-1',
    pronunciation: "/həˈləʊ/",
    status: 'Published',
    translation: 'Xin chao',
    word: 'Hello',
  },
  {
    id: 2,
    audio: 'audio-2',
    pronunciation: "/ɡʊdˈbaɪ/",
    status: 'Published',
    translation: 'Tam biet',
    word: 'Goodbye',
  },
  {
    id: 3,
    audio: 'audio-3',
    pronunciation: "/siː juː/",
    status: 'Draft',
    translation: 'Hen gap lai',
    word: 'See you',
  },
];
