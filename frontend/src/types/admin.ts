export type AdminSidebarItem = {
  icon: string;
  id: string;
  label: string;
};

export type AdminLessonWord = {
  audio: string;
  id: number;
  pronunciation: string;
  status: 'Published' | 'Draft';
  translation: string;
  word: string;
};

export type AdminLesson = {
  id: number;
  title: string;
  type: 'lesson';
};

export type AdminModule = {
  id: number;
  lessons: AdminLesson[];
  title: string;
  type: 'module';
};

export type AdminCourse = {
  id: number;
  level: string;
  modules: AdminModule[];
  title: string;
};

export type AdminTabKey = 'video' | 'vocabulary' | 'exercises';
