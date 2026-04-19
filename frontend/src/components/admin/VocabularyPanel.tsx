import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/assets/styles/theme';
import { AdminLessonWord } from '@/src/types/admin';

export default function VocabularyPanel({
  words,
}: {
  words: AdminLessonWord[];
}) {
  return (
    <View>
      <View style={styles.primaryAction}>
        <Ionicons color={colors.surface} name="add" size={22} />
        <Text style={styles.primaryActionText}>Add Word</Text>
      </View>

      <View style={styles.importCard}>
        <Ionicons color={colors.primary} name="document-text-outline" size={24} />
        <View style={styles.importTextBlock}>
          <Text style={styles.importTitle}>Import from Excel</Text>
          <Text style={styles.importSubtext}>
            Import vocabulary data to manage lesson words faster.
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Word</Text>
          <Text style={styles.headerCell}>Translation</Text>
          <Text style={styles.headerCell}>Pronunciation</Text>
          <Text style={styles.headerCell}>Audio</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>

        {words.map((word) => (
          <View key={word.id} style={styles.tableRow}>
            <Text style={styles.cell}>{word.word}</Text>
            <Text style={styles.cell}>{word.translation}</Text>
            <Text style={styles.cell}>{word.pronunciation}</Text>
            <View style={styles.iconCell}>
              <Ionicons color={colors.text} name="play-outline" size={18} />
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{word.status}</Text>
            </View>
            <View style={styles.actionRow}>
              <Ionicons color={colors.text} name="create-outline" size={18} />
              <Ionicons color={colors.text} name="trash-outline" size={18} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cell: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
  },
  headerCell: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  iconCell: {
    alignItems: 'center',
    flex: 1,
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
  statusBadge: {
    alignItems: 'center',
    backgroundColor: '#DDF5E4',
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 6,
  },
  statusText: {
    color: '#198C3C',
    fontSize: 13,
    fontWeight: '700',
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
});
