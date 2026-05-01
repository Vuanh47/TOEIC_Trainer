import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '@/src/assets/styles/theme';
import { PracticeSetApiItem } from '@/src/types/admin-api';

type ExercisesPanelProps = {
  exercises: PracticeSetApiItem[];
  loading?: boolean;
  onCreate: () => void;
  onDelete: (exercise: PracticeSetApiItem) => void;
  onEdit: (exercise: PracticeSetApiItem) => void;
  working?: boolean;
};

export default function ExercisesPanel({
  exercises,
  loading = false,
  onCreate,
  onDelete,
  onEdit,
  working = false,
}: ExercisesPanelProps) {
  return (
    <View>
      <Text style={styles.title}>Manage Lesson Exercises</Text>
      <Text style={styles.subTitle}>
        {loading
          ? 'Dang tai du lieu exercises...'
          : `${exercises.length} practice set(s) trong module nay`}
      </Text>

      <Pressable
        disabled={loading || working}
        onPress={onCreate}
        style={styles.primaryAction}
      >
        <Ionicons color={colors.surface} name="add" size={22} />
        <Text style={styles.primaryActionText}>
          {working ? 'Dang xu ly...' : 'Add New Exercise'}
        </Text>
      </Pressable>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.typeCell]}>Type</Text>
          <Text style={[styles.headerCell, styles.titleCell]}>Title</Text>
          <Text style={[styles.headerCell, styles.qsCell]}>Qs</Text>
          <Text style={[styles.headerCell, styles.actionsCell]}>Actions</Text>
        </View>

        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.typeCell]}>{exercise.setType}</Text>
            <Text style={[styles.cell, styles.titleCell]}>{exercise.title}</Text>
            <Text style={[styles.cell, styles.qsCell]}>
              {exercise.partNo ? `Part ${exercise.partNo}` : '-'}
            </Text>
            <View style={[styles.actionRow, styles.actionsCell]}>
              <Pressable
                disabled={working}
                hitSlop={8}
                onPress={() => onEdit(exercise)}
                style={styles.iconButton}
              >
                <Ionicons color={colors.textMuted} name="create-outline" size={18} />
              </Pressable>
              <Pressable
                disabled={working}
                hitSlop={8}
                onPress={() => onDelete(exercise)}
                style={styles.iconButton}
              >
                <Ionicons color={colors.textMuted} name="trash-outline" size={18} />
              </Pressable>
            </View>
          </View>
        ))}

        {!loading && exercises.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={styles.emptyText}>Chua co practice set trong module nay.</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  actionsCell: {
    flex: 0.8,
    justifyContent: 'flex-end',
  },
  cell: {
    color: colors.text,
    fontSize: 14,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  headerCell: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  iconButton: {
    padding: 2,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    paddingVertical: 14,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '500',
  },
  qsCell: {
    flex: 0.8,
  },
  table: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#F5F7FA',
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  tableRow: {
    alignItems: 'center',
    borderTopColor: '#E7ECF2',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subTitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 12,
  },
  titleCell: {
    flex: 1.6,
  },
  typeCell: {
    flex: 1.4,
  },
});
