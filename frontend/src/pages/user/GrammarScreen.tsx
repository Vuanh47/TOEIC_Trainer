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
  getUserFavoriteGrammarTitles,
  getUserGrammarDetail,
  getUserGrammars,
  removeUserGrammarFavorite,
} from "@/src/services/user.service";
import {
  UserFavoriteGrammarTitleItem,
  UserGrammarListItem,
} from "@/src/types/user-api";
import { pushRoute } from "@/src/utils/navigation";

type LibraryTab = "vocabulary" | "grammar";

export default function GrammarScreen() {
  const { auth, isHydrated } = useAuth();
  const [activeTab, setActiveTab] = useState<LibraryTab>("grammar");
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [grammars, setGrammars] = useState<UserGrammarListItem[]>([]);
  const [favoriteTitles, setFavoriteTitles] = useState<UserFavoriteGrammarTitleItem[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<UserGrammarListItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const loadGrammarData = useCallback(async () => {
    if (!auth.accessToken) return;

    try {
      setLoading(true);
      setErrorMessage(null);
      const [grammarResponse, favoriteTitleResponse] = await Promise.all([
        getUserGrammars(auth.accessToken),
        getUserFavoriteGrammarTitles(auth.accessToken),
      ]);

      setGrammars(grammarResponse.data ?? []);
      setFavoriteTitles(favoriteTitleResponse.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Khong the tai danh sach ngu phap.",
      );
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken]);

  useEffect(() => {
    if (!isHydrated || !auth.accessToken) return;
    loadGrammarData();
  }, [auth.accessToken, isHydrated, loadGrammarData]);

  const favoriteIds = useMemo(
    () => new Set(favoriteTitles.map((item) => item.id)),
    [favoriteTitles],
  );

  const regularGrammars = useMemo(
    () => grammars.filter((item) => !favoriteIds.has(item.id)),
    [favoriteIds, grammars],
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
          error instanceof Error ? error.message : "Khong the tai chi tiet ngu phap.",
        );
      } finally {
        setDetailLoading(false);
      }
    },
    [auth.accessToken],
  );

  const syncFavoriteState = useCallback(
    (grammarId: number, nextFavorite: boolean) => {
      setGrammars((current) =>
        current.map((item) =>
          item.id === grammarId ? { ...item, isFavorite: nextFavorite } : item,
        ),
      );

      setSelectedGrammar((current) =>
        current && current.id === grammarId
          ? { ...current, isFavorite: nextFavorite }
          : current,
      );
    },
    [],
  );

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
        const favoriteTitleResponse = await getUserFavoriteGrammarTitles(auth.accessToken);
        setFavoriteTitles(favoriteTitleResponse.data ?? []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Khong the cap nhat yeu thich.",
        );
      } finally {
        setFavoriteLoadingId(null);
      }
    },
    [auth.accessToken, favoriteLoadingId, syncFavoriteState],
  );

  const renderGrammarCard = (item: UserGrammarListItem, tone: "favorite" | "regular") => {
    const isFavorite = item.isFavorite || favoriteIds.has(item.id);

    return (
      <Pressable
        key={item.id}
        onPress={() => openGrammarDetail(item.id)}
        style={[
          styles.grammarCard,
          tone === "favorite" ? styles.grammarCardFavorite : null,
        ]}
      >
        <View style={styles.grammarCardLeft}>
          <View
            style={[
              styles.grammarCheck,
              tone === "favorite" ? styles.grammarCheckFavorite : null,
            ]}
          >
            <Ionicons color={colors.surface} name="checkmark" size={16} />
          </View>
          <View style={styles.grammarCardCopy}>
            <Text numberOfLines={2} style={styles.grammarTitle}>
              {item.title}
            </Text>
            <Text numberOfLines={2} style={styles.grammarSubtitle}>
              {item.content}
            </Text>
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
              size={24}
            />
          )}
        </Pressable>
      </Pressable>
    );
  };

  return (
    <>
      <UserScreen>
        <AppHeader
          leftIcon="chevron-back-outline"
          onLeftPress={() => router.back()}
          rightSlot={<Ionicons color={colors.primaryDark} name="sparkles-outline" size={26} />}
          subtitle="Ly thuyet tieng Anh"
          title="TOEIC Trainer"
        />

        <SurfaceCard style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Grammar Library</Text>
          <Text style={styles.heroTitle}>Hoc ngu phap theo danh muc ro rang</Text>
          <Text style={styles.heroText}>
            Tach rieng phan yeu thich va tat ca chu de de ban mo lai nhanh, doc nhanh va on tap de hon.
          </Text>

          <View style={styles.tabRow}>
            <Pressable
              onPress={() => {
                setActiveTab("vocabulary");
                pushRoute("/user/cards");
              }}
              style={[
                styles.topTab,
                activeTab === "vocabulary" ? styles.topTabActive : null,
              ]}
            >
              <Text
                style={[
                  styles.topTabText,
                  activeTab === "vocabulary" ? styles.topTabTextActive : null,
                ]}
              >
                Tu vung
              </Text>
            </Pressable>
            <Pressable style={[styles.topTab, styles.topTabActive]}>
              <Text style={[styles.topTabText, styles.topTabTextActive]}>Ngu phap</Text>
            </Pressable>
          </View>
        </SurfaceCard>

        {loading ? (
          <View style={styles.feedbackRow}>
            <ActivityIndicator color={colors.primaryDark} />
            <Text style={styles.feedbackText}>Dang tai danh sach ngu phap...</Text>
          </View>
        ) : null}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <SurfaceCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Yeu thich</Text>
              <Text style={styles.sectionSubtitle}>
                {favoriteTitles.length} muc da luu tu `/favorites/titles`
              </Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{favoriteTitles.length}</Text>
            </View>
          </View>

          {favoriteTitles.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoriteRow}
            >
              {favoriteTitles.map((item) => {
                const fullGrammar =
                  grammars.find((grammar) => grammar.id === item.id) ??
                  ({
                    active: true,
                    content: "Mo de xem chi tiet ngu phap.",
                    example: null,
                    id: item.id,
                    isFavorite: true,
                    tips: null,
                    title: item.title,
                  } as UserGrammarListItem);

                return (
                  <View key={item.id} style={styles.favoriteCard}>
                    {renderGrammarCard(fullGrammar, "favorite")}
                    <Text style={styles.favoriteSavedAt}>Da luu: {item.savedAt}</Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>
              Ban chua co ngu phap yeu thich. Bam vao icon sao de luu nhanh.
            </Text>
          )}
        </SurfaceCard>

        <SurfaceCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Tat ca ngu phap</Text>
              <Text style={styles.sectionSubtitle}>
                GET `/api/users/grammars` tra ve danh sach active kem `isFavorite`
              </Text>
            </View>
            <Pressable onPress={loadGrammarData} style={styles.reloadButton}>
              <Ionicons color={colors.primaryDark} name="refresh-outline" size={18} />
            </Pressable>
          </View>

          <View style={styles.listColumn}>
            {regularGrammars.map((item) => renderGrammarCard(item, "regular"))}
            {!loading && regularGrammars.length === 0 ? (
              <Text style={styles.emptyText}>Chua co ngu phap active de hien thi.</Text>
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
                <Text style={styles.feedbackText}>Dang tai chi tiet ngu phap...</Text>
              </View>
            ) : selectedGrammar ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.sheetHeader}>
                  <View style={styles.sheetHeaderCopy}>
                    <Text style={styles.sheetTitle}>{selectedGrammar.title}</Text>
                    <Text style={styles.sheetSubtitle}>Chi tiet ngu phap</Text>
                  </View>
                  <View style={styles.sheetHeaderActions}>
                    <Pressable
                      onPress={() =>
                        toggleFavorite(
                          selectedGrammar.id,
                          selectedGrammar.isFavorite || favoriteIds.has(selectedGrammar.id),
                        )
                      }
                      style={styles.sheetIconButton}
                    >
                      <Ionicons
                        color={
                          selectedGrammar.isFavorite || favoriteIds.has(selectedGrammar.id)
                            ? "#F5A623"
                            : colors.textMuted
                        }
                        name={
                          selectedGrammar.isFavorite || favoriteIds.has(selectedGrammar.id)
                            ? "star"
                            : "star-outline"
                        }
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
                  <Text style={styles.sheetSectionLabel}>Tom tat</Text>
                  <Text style={styles.sheetSectionText}>{selectedGrammar.content}</Text>
                </View>

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Giai thich</Text>
                  <Text style={styles.sheetSectionText}>
                    {selectedGrammar.tips?.trim() || "Chua co ghi chu bo sung."}
                  </Text>
                </View>

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Vi du</Text>
                  <Text style={styles.sheetExampleText}>
                    {selectedGrammar.example?.trim() || "Chua co vi du."}
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>Khong tim thay noi dung chi tiet.</Text>
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
  favoriteCard: {
    width: 286,
  },
  favoriteRow: {
    gap: spacing.md,
    paddingRight: spacing.xs,
  },
  favoriteSavedAt: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
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
  grammarCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 104,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  grammarCardCopy: {
    flex: 1,
  },
  grammarCardFavorite: {
    backgroundColor: "#F7FCFB",
    borderColor: "#CFEAE4",
  },
  grammarCardLeft: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.md,
  },
  grammarCheck: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  grammarCheckFavorite: {
    backgroundColor: "#33C1AF",
  },
  grammarSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  grammarTitle: {
    color: colors.text,
    fontSize: 18,
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
