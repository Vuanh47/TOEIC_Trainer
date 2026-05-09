import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader from "@/src/components/user/AppHeader";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import {
  addUserGrammarFavorite,
  getUserFavoriteGrammars,
  getUserGrammarDetail,
  getUserGrammars,
  removeUserGrammarFavorite,
} from "@/src/services/user.service";
import { UserGrammarListItem } from "@/src/types/user-api";

type GrammarTab = "all" | "favorites";

export default function GrammarScreen() {
  const { auth, isHydrated } = useAuth();
  const [activeTab, setActiveTab] = useState<GrammarTab>("all");
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allGrammars, setAllGrammars] = useState<UserGrammarListItem[]>([]);
  const [favoriteGrammars, setFavoriteGrammars] = useState<UserGrammarListItem[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<UserGrammarListItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const loadActiveTabData = useCallback(async () => {
    if (!auth.accessToken) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      if (activeTab === "all") {
        const response = await getUserGrammars(auth.accessToken);
        setAllGrammars(response.data ?? []);
      } else {
        const response = await getUserFavoriteGrammars(auth.accessToken);
        setFavoriteGrammars(response.data ?? []);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách ngữ pháp.",
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab, auth.accessToken]);

  const refreshAllSources = useCallback(async () => {
    if (!auth.accessToken) return;

    try {
      const [allResponse, favoriteResponse] = await Promise.all([
        getUserGrammars(auth.accessToken),
        getUserFavoriteGrammars(auth.accessToken),
      ]);

      setAllGrammars(allResponse.data ?? []);
      setFavoriteGrammars(favoriteResponse.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể đồng bộ dữ liệu ngữ pháp.",
      );
    }
  }, [auth.accessToken]);

  useEffect(() => {
    if (!isHydrated || !auth.accessToken) return;
    loadActiveTabData();
  }, [auth.accessToken, isHydrated, loadActiveTabData]);

  const visibleGrammars = useMemo(
    () => (activeTab === "all" ? allGrammars : favoriteGrammars),
    [activeTab, allGrammars, favoriteGrammars],
  );

  const favoriteIds = useMemo(
    () => new Set(favoriteGrammars.map((item) => item.id)),
    [favoriteGrammars],
  );

  const openGrammarDetail = useCallback(
    async (grammarId: number) => {
      if (!auth.accessToken) return;

      try {
        setDetailVisible(true);
        setDetailLoading(true);
        setErrorMessage(null);
        const response = await getUserGrammarDetail(auth.accessToken, grammarId);
        setSelectedGrammar(response.data ?? null);
      } catch (error) {
        setSelectedGrammar(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải chi tiết ngữ pháp.",
        );
      } finally {
        setDetailLoading(false);
      }
    },
    [auth.accessToken],
  );

  const syncFavoriteState = useCallback((grammarId: number, nextFavorite: boolean) => {
    setAllGrammars((current) =>
      current.map((item) =>
        item.id === grammarId ? { ...item, isFavorite: nextFavorite } : item,
      ),
    );

    setFavoriteGrammars((current) => {
      if (nextFavorite) {
        const existing = current.find((item) => item.id === grammarId);
        if (existing) {
          return current.map((item) =>
            item.id === grammarId ? { ...item, isFavorite: true } : item,
          );
        }

        const sourceItem = allGrammars.find((item) => item.id === grammarId);
        return sourceItem
          ? [{ ...sourceItem, isFavorite: true }, ...current]
          : current;
      }

      return current.filter((item) => item.id !== grammarId);
    });

    setSelectedGrammar((current) =>
      current && current.id === grammarId
        ? { ...current, isFavorite: nextFavorite }
        : current,
    );
  }, [allGrammars]);

  const toggleFavorite = useCallback(
    async (grammarId: number, isFavorite: boolean) => {
      if (!auth.accessToken || favoriteLoadingId === grammarId) return;

      try {
        setFavoriteLoadingId(grammarId);
        setErrorMessage(null);

        if (isFavorite) {
          await removeUserGrammarFavorite(auth.accessToken, grammarId);
        } else {
          await addUserGrammarFavorite(auth.accessToken, grammarId);
        }

        syncFavoriteState(grammarId, !isFavorite);
        await refreshAllSources();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể cập nhật trạng thái yêu thích.",
        );
      } finally {
        setFavoriteLoadingId(null);
      }
    },
    [auth.accessToken, favoriteLoadingId, refreshAllSources, syncFavoriteState],
  );

  const renderGrammarItem = (item: UserGrammarListItem) => {
    const isFavorite = item.isFavorite || favoriteIds.has(item.id);

    return (
      <Pressable
        key={item.id}
        onPress={() => openGrammarDetail(item.id)}
        style={styles.grammarItem}
      >
        <View style={styles.grammarItemMain}>
          <View style={styles.grammarIcon}>
            <Ionicons color={colors.accent} name="book-outline" size={18} />
          </View>
          <View style={styles.grammarCopy}>
            <Text numberOfLines={2} style={styles.grammarTitle}>
              {item.title}
            </Text>
            {activeTab === "all" ? (
              <Text numberOfLines={2} style={styles.grammarSubtitle}>
                {item.content}
              </Text>
            ) : (
              <Text style={styles.grammarMeta}>Đã lưu để ôn tập nhanh</Text>
            )}
          </View>
        </View>

        <Pressable
          hitSlop={10}
          onPress={() => toggleFavorite(item.id, isFavorite)}
          style={styles.favoriteButton}
        >
          {favoriteLoadingId === item.id ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <Ionicons
              color={isFavorite ? "#F5A623" : colors.textMuted}
              name={isFavorite ? "star" : "star-outline"}
              size={22}
            />
          )}
        </Pressable>
      </Pressable>
    );
  };

  const detailIsFavorite = selectedGrammar
    ? selectedGrammar.isFavorite || favoriteIds.has(selectedGrammar.id)
    : false;

  return (
    <>
      <UserScreen>
        <AppHeader
          leftIcon="chevron-back-outline"
          onLeftPress={() => router.back()}
          rightSlot={<Ionicons color={colors.primaryDark} name="library-outline" size={24} />}
          subtitle="Thư viện ngữ pháp"
          title="Ngữ pháp"
        />

        <SurfaceCard style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Ngữ pháp TOEIC</Text>
          <Text style={styles.heroTitle}>Chọn cách xem phù hợp với bạn</Text>
          <Text style={styles.heroText}>
            Xem toàn bộ chủ đề hoặc chỉ mở nhanh danh sách yêu thích. Chạm vào
            tiêu đề để xem chi tiết.
          </Text>

          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setActiveTab("all")}
              style={[styles.topTab, activeTab === "all" ? styles.topTabActive : null]}
            >
              <Text
                style={[
                  styles.topTabText,
                  activeTab === "all" ? styles.topTabTextActive : null,
                ]}
              >
                Tất cả
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("favorites")}
              style={[
                styles.topTab,
                activeTab === "favorites" ? styles.topTabActive : null,
              ]}
            >
              <Text
                style={[
                  styles.topTabText,
                  activeTab === "favorites" ? styles.topTabTextActive : null,
                ]}
              >
                Yêu thích
              </Text>
            </Pressable>
          </View>
        </SurfaceCard>

        {loading ? (
          <View style={styles.feedbackRow}>
            <ActivityIndicator color={colors.primaryDark} />
            <Text style={styles.feedbackText}>Đang tải danh sách ngữ pháp...</Text>
          </View>
        ) : null}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <SurfaceCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {activeTab === "all" ? "Tất cả ngữ pháp" : "Ngữ pháp yêu thích"}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {activeTab === "all"
                  ? "Danh sách chủ đề đang mở cho bạn"
                  : "Chỉ hiển thị các tiêu đề bạn đã lưu"}
              </Text>
            </View>

            <View style={styles.sectionActions}>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{visibleGrammars.length}</Text>
              </View>
              <Pressable onPress={loadActiveTabData} style={styles.reloadButton}>
                <Ionicons color={colors.primaryDark} name="refresh-outline" size={18} />
              </Pressable>
            </View>
          </View>

          <View style={styles.listColumn}>
            {visibleGrammars.map((item) => renderGrammarItem(item))}
            {!loading && visibleGrammars.length === 0 ? (
              <Text style={styles.emptyText}>
                {activeTab === "all"
                  ? "Chưa có ngữ pháp để hiển thị."
                  : "Bạn chưa lưu ngữ pháp yêu thích nào."}
              </Text>
            ) : null}
          </View>
        </SurfaceCard>
      </UserScreen>

      <Modal
        animationType="slide"
        onRequestClose={() => setDetailVisible(false)}
        transparent
        visible={detailVisible}
      >
        <View style={styles.sheetBackdrop}>
          <Pressable style={styles.sheetDismissArea} onPress={() => setDetailVisible(false)} />
          <View style={styles.sheetCard}>
            <View style={styles.sheetHandle} />
            {detailLoading ? (
              <View style={styles.sheetLoading}>
                <ActivityIndicator color={colors.primaryDark} />
                <Text style={styles.feedbackText}>Đang tải chi tiết ngữ pháp...</Text>
              </View>
            ) : selectedGrammar ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.sheetHeader}>
                  <View style={styles.sheetHeaderCopy}>
                    <Text style={styles.sheetTitle}>{selectedGrammar.title}</Text>
                    <Text style={styles.sheetSubtitle}>Chi tiết ngữ pháp</Text>
                  </View>
                  <View style={styles.sheetHeaderActions}>
                    <Pressable
                      onPress={() => toggleFavorite(selectedGrammar.id, detailIsFavorite)}
                      style={styles.sheetIconButton}
                    >
                      <Ionicons
                        color={detailIsFavorite ? "#F5A623" : colors.textMuted}
                        name={detailIsFavorite ? "star" : "star-outline"}
                        size={22}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => setDetailVisible(false)}
                      style={styles.sheetIconButton}
                    >
                      <Ionicons color={colors.textMuted} name="close" size={22} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Nội dung</Text>
                  <Text style={styles.sheetSectionText}>{selectedGrammar.content}</Text>
                </View>

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Mẹo</Text>
                  <Text style={styles.sheetSectionText}>
                    {selectedGrammar.tips?.trim() || "Chưa có mẹo bổ sung."}
                  </Text>
                </View>

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Ví dụ</Text>
                  <Text style={styles.sheetExampleText}>
                    {selectedGrammar.example?.trim() || "Chưa có ví dụ."}
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>Không tìm thấy nội dung chi tiết.</Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  countPill: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    justifyContent: "center",
    minWidth: 42,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  countPillText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "900",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  errorText: {
    backgroundColor: "rgba(217,91,91,0.12)",
    borderColor: "rgba(217,91,91,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.danger,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  favoriteButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    marginLeft: spacing.sm,
    width: 34,
  },
  feedbackRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  grammarCopy: {
    flex: 1,
    gap: 4,
  },
  grammarIcon: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  grammarItem: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 92,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  grammarItemMain: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.md,
  },
  grammarMeta: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
  },
  grammarSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  grammarTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24,
  },
  heroCard: {
    backgroundColor: "#F8FCFF",
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  heroEyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  heroText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  heroTitle: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  listColumn: {
    gap: spacing.md,
  },
  reloadButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  sectionActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "900",
  },
  sheetBackdrop: {
    backgroundColor: "rgba(19,34,59,0.22)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "84%",
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  sheetDismissArea: {
    flex: 1,
  },
  sheetExampleText: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 30,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.borderStrong,
    borderRadius: radius.pill,
    height: 5,
    marginBottom: spacing.md,
    width: 68,
  },
  sheetHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  sheetHeaderActions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  sheetHeaderCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  sheetIconButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  sheetLoading: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },
  sheetSection: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: spacing.md,
    paddingTop: spacing.lg,
  },
  sheetSectionLabel: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  sheetSectionText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
  },
  sheetSubtitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  sheetTitle: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 30,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  topTab: {
    alignItems: "center",
    backgroundColor: "#EAF1FB",
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 13,
  },
  topTabActive: {
    backgroundColor: colors.primaryDark,
  },
  topTabText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "800",
  },
  topTabTextActive: {
    color: colors.surface,
  },
});
