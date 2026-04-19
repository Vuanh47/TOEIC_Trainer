import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '@/src/assets/styles/theme';
import { AdminCourse, AdminLesson } from '@/src/types/admin';

type CourseOutlinePanelProps = {
  activeLessonId: number;
  course: AdminCourse;
  onSelectLesson: (lesson: AdminLesson) => void;
};

export default function CourseOutlinePanel({
  activeLessonId,
  course,
  onSelectLesson,
}: CourseOutlinePanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.breadcrumb}>Home {'>'} Courses {'>'} {course.title}</Text>
      <Text style={styles.heading}>Courses & Lesson Manager</Text>

      <View style={styles.card}>
        <View style={styles.courseRow}>
          <Ionicons color={colors.textMuted} name="apps" size={18} />
          <Text style={styles.courseTitle}>
            {course.title}, {course.level}
          </Text>
        </View>
      </View>

      {course.modules.map((module) => (
        <View key={module.id} style={styles.card}>
          <View style={styles.moduleRow}>
            <Ionicons color={colors.textMuted} name="chevron-down" size={18} />
            <Ionicons color={colors.textMuted} name="folder-outline" size={18} />
            <Text style={styles.moduleTitle}>{module.title}</Text>
          </View>

          <View style={styles.lessonList}>
            {module.lessons.map((lesson) => {
              const active = lesson.id === activeLessonId;

              return (
                <Pressable
                  key={lesson.id}
                  onPress={() => onSelectLesson(lesson)}
                  style={[styles.lessonItem, active ? styles.lessonItemActive : null]}>
                  <Ionicons
                    color={active ? colors.textMuted : '#8E99AB'}
                    name={active ? 'apps' : 'chevron-forward'}
                    size={18}
                  />
                  <Text style={[styles.lessonText, active ? styles.lessonTextActive : null]}>
                    {lesson.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  breadcrumb: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: '#E3E8EF',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: spacing.md,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  courseRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  courseTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  heading: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 22,
  },
  lessonItem: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  lessonItemActive: {
    backgroundColor: '#EAF3FF',
  },
  lessonList: {
    gap: 8,
    marginTop: 16,
  },
  lessonText: {
    color: colors.text,
    fontSize: 15,
  },
  lessonTextActive: {
    color: colors.primaryDark,
    fontWeight: '500',
  },
  moduleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  moduleTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  panel: {
    flex: 1.1,
  },
});
