import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/assets/styles/theme';
import { AdminFlashcardApiItem } from '@/src/types/admin-api';

export default function VocabularyPanel({
  words,
  loading = false,
  onCreate,
  onDelete,
  onEdit,
  working = false,
}: {
  words: AdminFlashcardApiItem[];
  loading?: boolean;
  onCreate: () => void;
  onDelete: (word: AdminFlashcardApiItem) => void;
  onEdit: (word: AdminFlashcardApiItem) => void;
  working?: boolean;
}) {
  return (
    <View>
      <Pressable
        disabled={loading || working}
        onPress={onCreate}
        style={styles.primaryAction}
      >
        <Ionicons color={colors.surface} name="add" size={22} />
        <Text style={styles.primaryActionText}>
          {working ? 'Dang xu ly...' : 'Add Word'}
        </Text>
      </Pressable>

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
            <Text style={styles.cell}>{word.englishWord}</Text>
            <Text style={styles.cell}>{word.meaningVi}</Text>
            <Text style={styles.cell}>{word.pronunciation ?? '-'}</Text>
            <View style={styles.iconCell}>
              <Ionicons color={colors.text} name="play-outline" size={18} />
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {word.active ? 'Published' : 'Draft'}
              </Text>
            </View>
            <View style={styles.actionRow}>
              <Pressable
                disabled={working}
                hitSlop={8}
                onPress={() => onEdit(word)}
                style={styles.iconButton}
              >
                <Ionicons color={colors.text} name="create-outline" size={18} />
              </Pressable>
              <Pressable
                disabled={working}
                hitSlop={8}
                onPress={() => onDelete(word)}
                style={styles.iconButton}
              >
                <Ionicons color={colors.text} name="trash-outline" size={18} />
              </Pressable>
            </View>
          </View>
        ))}

        {!loading && words.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={styles.emptyText}>Chua co vocabulary trong module nay.</Text>
          </View>
        ) : null}
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
  emptyText: {
    color: colors.textMuted,
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
