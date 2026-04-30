import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/src/assets/styles/theme';
import { VideoLessonApiItem } from '@/src/types/admin-api';

type VideoPanelProps = {
  loading?: boolean;
  onCreate: () => void;
  onDelete: (video: VideoLessonApiItem) => void;
  onEdit: (video: VideoLessonApiItem) => void;
  videos: VideoLessonApiItem[];
  working?: boolean;
};

export default function VideoPanel({
  loading = false,
  onCreate,
  onDelete,
  onEdit,
  videos,
  working = false,
}: VideoPanelProps) {
  return (
    <View>
      <Text style={styles.heading}>Manage Lesson Video</Text>
      <Text style={styles.subHeading}>
        {loading ? 'Dang tai du lieu video...' : `${videos.length} video lesson(s)`}
      </Text>

      <Pressable
        disabled={loading || working}
        onPress={onCreate}
        style={styles.primaryAction}
      >
        <Ionicons color={colors.surface} name="add" size={22} />
        <Text style={styles.primaryActionText}>
          {working ? 'Dang xu ly...' : 'Add New Video'}
        </Text>
      </Pressable>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.titleCell]}>Title</Text>
          <Text style={[styles.headerCell, styles.durationCell]}>Duration</Text>
          <Text style={[styles.headerCell, styles.actionsCell]}>Actions</Text>
        </View>

        {videos.map((video) => (
          <View key={video.id} style={styles.tableRow}>
            <View style={styles.titleCell}>
              <Text style={styles.cell} numberOfLines={1}>
                {video.title}
              </Text>
              <Text numberOfLines={1} style={styles.metaCell}>
                {video.videoUrl ?? '-'}
              </Text>
            </View>
            <Text style={[styles.cell, styles.durationCell]}>
              {video.durationSeconds ? `${video.durationSeconds}s` : '-'}
            </Text>
            <View style={[styles.actionRow, styles.actionsCell]}>
              <Pressable
                disabled={working}
                hitSlop={8}
                onPress={() => onEdit(video)}
                style={styles.iconButton}
              >
                <Ionicons color={colors.textMuted} name="create-outline" size={18} />
              </Pressable>
              <Pressable
                disabled={working}
                hitSlop={8}
                onPress={() => onDelete(video)}
                style={styles.iconButton}
              >
                <Ionicons color={colors.textMuted} name="trash-outline" size={18} />
              </Pressable>
            </View>
          </View>
        ))}

        {!loading && videos.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={styles.emptyText}>Chua co video lesson trong module nay.</Text>
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
  durationCell: {
    flex: 0.7,
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
  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  iconButton: {
    padding: 2,
  },
  metaCell: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
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
  subHeading: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 12,
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
  titleCell: {
    flex: 1.8,
  },
});
