import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/theme";
import AppHeader from "@/src/components/user/AppHeader";
import UserScreen from "@/src/components/user/UserScreen";
import { transcriptSegments } from "@/src/pages/user/mock-data";

export default function NotebookScreen() {
  const [visible, setVisible] = useState(true);
  const [note, setNote] = useState("");

  return (
    <UserScreen>
      <AppHeader
        leftIcon="chevron-back-outline"
        onLeftPress={() => setVisible(true)}
        rightSlot={<Ionicons color={colors.primaryDark} name="person-circle" size={40} />}
        title="Academic Concierge"
      />

      <View style={styles.lessonPreview}>
        <View style={styles.videoPlaceholder}>
          <View style={styles.overlayControls}>
            <View style={styles.playButton}>
              <Ionicons color={colors.surface} name="play" size={24} />
            </View>
            <View style={styles.noteChip}>
              <Ionicons color={colors.surface} name="mic-outline" size={16} />
              <Text style={styles.noteChipText}>Add Note</Text>
            </View>
          </View>
        </View>
      </View>

      {transcriptSegments.map((segment) => (
        <View key={segment.id} style={styles.segmentRow}>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{segment.time}</Text>
          </View>
          <View style={styles.segmentBody}>
            <Text style={styles.segmentTitle}>{segment.title}</Text>
            <Text style={styles.segmentText}>{segment.text}</Text>
          </View>
        </View>
      ))}

      <Modal animationType="slide" transparent visible={visible}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.grabber} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Them ghi chu moi</Text>
              <View style={styles.timePill}>
                <Text style={styles.timePillText}>Tua den [05:22]</Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>NOI DUNG GHI CHU</Text>
            <TextInput
              multiline
              numberOfLines={5}
              onChangeText={setNote}
              placeholder="Nhap noi dung ghi chu tai day..."
              placeholderTextColor="#B5B9C8"
              style={styles.textArea}
              value={note}
            />

            <View style={styles.sheetActions}>
              <Pressable onPress={() => setVisible(false)} style={styles.sheetPrimary}>
                <Text style={styles.sheetPrimaryText}>Luu ghi chu</Text>
              </Pressable>
              <Pressable onPress={() => setVisible(false)} style={styles.sheetSecondary}>
                <Text style={styles.sheetSecondaryText}>Dong</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#FAFBFF",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    padding: spacing.lg,
  },
  grabber: {
    alignSelf: "center",
    backgroundColor: "#D7DAE8",
    borderRadius: radius.pill,
    height: 6,
    marginBottom: spacing.xl,
    width: 62,
  },
  inputLabel: {
    color: "#80879A",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: spacing.md,
  },
  lessonPreview: {
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    backgroundColor: "rgba(18,25,45,0.28)",
    flex: 1,
    justifyContent: "flex-end",
  },
  noteChip: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  noteChipText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
  },
  overlayControls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  playButton: {
    alignItems: "center",
    backgroundColor: "rgba(20,32,51,0.86)",
    borderRadius: radius.pill,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
  segmentBody: {
    flex: 1,
  },
  segmentRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  segmentText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
  },
  segmentTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  sheetActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  sheetPrimary: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 16,
  },
  sheetPrimaryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900",
  },
  sheetSecondary: {
    alignItems: "center",
    backgroundColor: "#ECEFF9",
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 16,
  },
  sheetSecondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  sheetTitle: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
    maxWidth: 160,
  },
  textArea: {
    backgroundColor: "#F1F3FA",
    borderRadius: radius.lg,
    color: colors.text,
    fontSize: 18,
    minHeight: 180,
    padding: spacing.md,
    textAlignVertical: "top",
  },
  timeBadge: {
    backgroundColor: "#EEF1FF",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  timeBadgeText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  timePill: {
    backgroundColor: "#DCE5FF",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  timePillText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
  },
  videoPlaceholder: {
    backgroundColor: "#223151",
    borderRadius: radius.lg,
    height: 220,
    justifyContent: "center",
    overflow: "hidden",
  },
});
