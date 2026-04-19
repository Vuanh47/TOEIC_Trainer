import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/assets/styles/theme';
import AdminShell from '@/src/components/admin/AdminShell';
import AdminSidebar from '@/src/components/admin/AdminSidebar';
import AdminTopBar from '@/src/components/admin/AdminTopBar';
import CourseOutlinePanel from '@/src/components/admin/CourseOutlinePanel';
import DetailTabs from '@/src/components/admin/DetailTabs';
import ExercisesPanel from '@/src/components/admin/ExercisesPanel';
import VideoPanel from '@/src/components/admin/VideoPanel';
import VocabularyPanel from '@/src/components/admin/VocabularyPanel';
import { useAuth } from '@/src/hooks/use-auth';
import {
  adminCourseData,
  adminSidebarItems,
  adminVocabularyData,
} from '@/src/pages/admin/dashboard/mock-data';
import { AdminLesson, AdminTabKey } from '@/src/types/admin';

export default function AdminDashboardScreen() {
  const { auth } = useAuth();
  const [activeSidebarItem, setActiveSidebarItem] = useState('courses');
  const [activeTab, setActiveTab] = useState<AdminTabKey>('vocabulary');
  const [activeLesson, setActiveLesson] = useState<AdminLesson>(
    adminCourseData.modules[0].lessons[0]
  );

  return (
    <AdminShell>
      <AdminTopBar adminName={auth.user?.fullName ?? 'Admin'} />

      <View style={styles.layout}>
        <AdminSidebar
          activeItemId={activeSidebarItem}
          items={adminSidebarItems}
          onSelect={setActiveSidebarItem}
        />

        <CourseOutlinePanel
          activeLessonId={activeLesson.id}
          course={adminCourseData}
          onSelectLesson={setActiveLesson}
        />

        <View style={styles.detailPanel}>
          <Text style={styles.detailTitle}>Lesson Detail: {activeLesson.title}</Text>
          <DetailTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'video' ? <VideoPanel /> : null}
          {activeTab === 'vocabulary' ? (
            <VocabularyPanel words={adminVocabularyData} />
          ) : null}
          {activeTab === 'exercises' ? <ExercisesPanel /> : null}
        </View>
      </View>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  detailPanel: {
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 18,
    flex: 1.35,
    padding: 22,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 18,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    gap: 18,
  },
});
