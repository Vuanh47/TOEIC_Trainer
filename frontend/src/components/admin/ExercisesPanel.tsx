import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/assets/styles/theme';

export default function ExercisesPanel() {
  return (
    <View>
      <Text style={styles.title}>Manage Lesson Exercises: Hello & Goodbye</Text>

      <View style={styles.primaryAction}>
        <Ionicons color={colors.surface} name="add" size={22} />
        <Text style={styles.primaryActionText}>Add New Exercise</Text>
      </View>

      <View style={styles.importCard}>
        <Ionicons color={colors.primary} name="document-text-outline" size={24} />
        <View style={styles.importTextBlock}>
          <Text style={styles.importTitle}>Import Exercises from Excel</Text>
          <Text style={styles.importSubtext}>
            Import your exercises and questions directly from an Excel file.
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.typeCell]}>Type</Text>
          <Text style={[styles.headerCell, styles.titleCell]}>Title</Text>
          <Text style={[styles.headerCell, styles.qsCell]}>Qs</Text>
          <Text style={[styles.headerCell, styles.actionsCell]}>Actions</Text>
        </View>

        {[
          ['(1) Multiple Choice', 'Greetings Quiz 1', '5 Qs'],
          ['(2) Dialogue', 'Roleplay 1', '3 Qs'],
          ['(3) Matching', 'Word Matching 1', '10 Qs'],
        ].map(([type, title, qs]) => (
          <View key={title} style={styles.tableRow}>
            <Text style={[styles.cell, styles.typeCell]}>{type}</Text>
            <Text style={[styles.cell, styles.titleCell]}>{title}</Text>
            <Text style={[styles.cell, styles.qsCell]}>{qs}</Text>
            <View style={[styles.actionRow, styles.actionsCell]}>
              <Ionicons color={colors.textMuted} name="create-outline" size={18} />
              <Ionicons color={colors.textMuted} name="trash-outline" size={18} />
            </View>
          </View>
        ))}
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
  headerCell: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  importCard: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#CFE2F8',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  importSubtext: {
    color: colors.textMuted,
    fontSize: 13,
  },
  importTextBlock: {
    flex: 1,
  },
  importTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
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
    marginBottom: 16,
  },
  titleCell: {
    flex: 1.6,
  },
  typeCell: {
    flex: 1.4,
  },
});
