import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radius, spacing } from "@/src/assets/styles/user-theme";
import AppHeader, { AvatarBadge } from "@/src/components/user/AppHeader";
import ProgressBar from "@/src/components/user/ProgressBar";
import SurfaceCard from "@/src/components/user/SurfaceCard";
import UserScreen from "@/src/components/user/UserScreen";
import { useAuth } from "@/src/hooks/use-auth";
import {
  createFlashcardCollection,
  createMyFlashcard,
  deleteFlashcardCollection,
  deleteMyFlashcard,
  getFlashcardCollectionDetail,
  getModuleFlashcardsForUser,
  getMyFlashcardCollections,
  getMyFlashcards,
  updateMyFlashcard,
} from "@/src/services/user.service";
import { FlashcardApiItem, FlashcardCollectionApiItem } from "@/src/types/user-api";

type ExpoSpeechModule = {
  speak: (text: string, options?: Record<string, unknown>) => void;
  stop: () => void;
};

type TabMode = "lesson" | "mine";
type AddMode = "manual" | "bulk";

type BulkFlashcardInput = {
  englishWord: string;
  meaningVi: string;
  exampleSentence?: string;
  pronunciation?: string;
};

async function loadExpoSpeechModule(): Promise<ExpoSpeechModule | null> {
  try {
    const importer = new Function("m", "return import(m)") as (m: string) => Promise<unknown>;
    const mod: any = await importer("expo-speech");
    if (mod && typeof mod.speak === "function" && typeof mod.stop === "function") return mod as ExpoSpeechModule;
    if (mod?.default && typeof mod.default.speak === "function" && typeof mod.default.stop === "function") {
      return mod.default as ExpoSpeechModule;
    }
    return null;
  } catch {
    return null;
  }
}

const QUICK_JSON_TEMPLATE = `{
  "topicName": "Business Meeting",
  "topicDescription": "Tu vung hop va dam phan",
  "items": [
    {
      "englishWord": "negotiate",
      "meaningVi": "dam phan",
      "exampleSentence": "We need to negotiate a better price.",
      "pronunciation": "/nɪˈɡəʊ.ʃi.eɪt/"
    }
  ]
}`;

export default function CardsScreen() {
  const { auth } = useAuth();
  const params = useLocalSearchParams<{ moduleId?: string }>();

  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [mode, setMode] = useState<TabMode>("mine");
  const [showMeaning, setShowMeaning] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  const [lessonCards, setLessonCards] = useState<FlashcardApiItem[]>([]);
  const [myCards, setMyCards] = useState<FlashcardApiItem[]>([]);
  const [collections, setCollections] = useState<FlashcardCollectionApiItem[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);

  const [voiceRegion, setVoiceRegion] = useState<"US" | "UK">("US");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [showTopicEditor, setShowTopicEditor] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>("manual");

  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  const [manualWord, setManualWord] = useState("");
  const [manualMeaning, setManualMeaning] = useState("");
  const [manualExample, setManualExample] = useState("");
  const [manualPronunciation, setManualPronunciation] = useState("");
  const [bulkJson, setBulkJson] = useState(QUICK_JSON_TEMPLATE);

  const selectedModuleId = useMemo(() => {
    if (!params.moduleId) return undefined;
    const parsed = Number(params.moduleId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [params.moduleId]);

  const currentCards = mode === "lesson" ? lessonCards : myCards;
  const currentCard = useMemo(() => {
    if (currentCards.length === 0) return null;
    return currentCards[cardIndex % currentCards.length];
  }, [cardIndex, currentCards]);

  const loadCollectionsAndCards = useCallback(async () => {
    if (!auth.accessToken) return;
    const collectionsPayload = await getMyFlashcardCollections(auth.accessToken);
    const nextCollections = collectionsPayload.data ?? [];
    setCollections(nextCollections);
    const nextSelected =
      selectedCollectionId && nextCollections.some((item) => item.id === selectedCollectionId)
        ? selectedCollectionId
        : nextCollections[0]?.id ?? null;
    setSelectedCollectionId(nextSelected);

    if (nextSelected) {
      const detail = await getFlashcardCollectionDetail(auth.accessToken, nextSelected);
      setMyCards(detail.data?.flashcards ?? []);
      return;
    }
    const mine = await getMyFlashcards(auth.accessToken);
    setMyCards(mine.data ?? []);
  }, [auth.accessToken, selectedCollectionId]);

  const loadAll = useCallback(async () => {
    if (!auth.accessToken) return;
    try {
      setLoading(true);
      if (selectedModuleId) {
        const moduleCards = await getModuleFlashcardsForUser(auth.accessToken, selectedModuleId);
        setLessonCards(moduleCards.data ?? []);
        setMode("lesson");
      } else {
        setLessonCards([]);
        setMode("mine");
      }
      await loadCollectionsAndCards();
      setCardIndex(0);
      setShowMeaning(false);
    } catch (error) {
      Alert.alert("Flashcards", error instanceof Error ? error.message : "Khong the tai flashcard.");
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken, loadCollectionsAndCards, selectedModuleId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const speakText = (text: string) => {
    if (!text.trim()) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      void (async () => {
        const speech = await loadExpoSpeechModule();
        if (!speech) {
          Alert.alert("Pronunciation", "Chay: npx expo install expo-speech");
          return;
        }
        setIsSpeaking(true);
        speech.stop();
        speech.speak(text, {
          language: voiceRegion === "US" ? "en-US" : "en-GB",
          pitch,
          rate,
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
        });
      })();
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const preferredLocale = voiceRegion === "US" ? "en-us" : "en-gb";
    const selectedVoice =
      voices.find((voice) => voice.lang.toLowerCase() === preferredLocale) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
      null;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = preferredLocale;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synth.cancel();
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const createAndAttachToCollection = async (item: BulkFlashcardInput, collectionId: number | null) => {
    if (!auth.accessToken) return;
    const created = await createMyFlashcard(auth.accessToken, {
      englishWord: item.englishWord.trim(),
      meaningVi: item.meaningVi.trim(),
      exampleSentence: item.exampleSentence?.trim() || undefined,
      pronunciation: item.pronunciation?.trim() || undefined,
    });
    if (collectionId && created.data?.id) {
      await updateMyFlashcard(auth.accessToken, created.data.id, { flashcardCollectionId: collectionId });
    }
  };

  const handleCreateCollection = async () => {
    if (!auth.accessToken || !newCollectionName.trim()) {
      Alert.alert("Collection", "Nhap ten chu de truoc.");
      return;
    }
    try {
      setWorking(true);
      const created = await createFlashcardCollection(auth.accessToken, {
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim() || undefined,
      });
      setNewCollectionName("");
      setNewCollectionDescription("");
      setSelectedCollectionId(created.data?.id ?? null);
      await loadCollectionsAndCards();
      setShowTopicEditor(false);
    } catch (error) {
      Alert.alert("Collection", error instanceof Error ? error.message : "Khong tao duoc chu de.");
    } finally {
      setWorking(false);
    }
  };

  const handleDeleteCollection = async () => {
    if (!auth.accessToken || !selectedCollectionId) return;
    try {
      setWorking(true);
      await deleteFlashcardCollection(auth.accessToken, selectedCollectionId);
      setSelectedCollectionId(null);
      await loadCollectionsAndCards();
    } catch (error) {
      Alert.alert("Collection", error instanceof Error ? error.message : "Khong xoa duoc chu de.");
    } finally {
      setWorking(false);
    }
  };

  const handleManualAdd = async () => {
    if (!manualWord.trim() || !manualMeaning.trim()) {
      Alert.alert("Flashcard", "Can nhap englishWord va meaningVi.");
      return;
    }
    try {
      setWorking(true);
      await createAndAttachToCollection(
        {
          englishWord: manualWord,
          meaningVi: manualMeaning,
          exampleSentence: manualExample,
          pronunciation: manualPronunciation,
        },
        selectedCollectionId,
      );
      setManualWord("");
      setManualMeaning("");
      setManualExample("");
      setManualPronunciation("");
      await loadCollectionsAndCards();
      setShowAddForm(false);
    } catch (error) {
      Alert.alert("Flashcard", error instanceof Error ? error.message : "Khong them duoc flashcard.");
    } finally {
      setWorking(false);
    }
  };

  const parseBulkInput = (raw: string): { topicName?: string; topicDescription?: string; items: BulkFlashcardInput[] } => {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return { items: parsed as BulkFlashcardInput[] };
    if (typeof parsed === "object" && parsed !== null && "items" in parsed) {
      const data = parsed as {
        topicName?: string;
        topic?: string;
        topicDescription?: string;
        description?: string;
        items: BulkFlashcardInput[];
      };
      return {
        topicName: data.topicName ?? data.topic,
        topicDescription: data.topicDescription ?? data.description,
        items: Array.isArray(data.items) ? data.items : [],
      };
    }
    return { items: [] };
  };

  const handleBulkAdd = async () => {
    if (!auth.accessToken) return;
    try {
      setWorking(true);
      const payload = parseBulkInput(bulkJson);
      if (!payload.items.length) throw new Error("JSON khong hop le hoac khong co items.");
      let collectionId = selectedCollectionId;

      if (!collectionId && payload.topicName?.trim()) {
        const created = await createFlashcardCollection(auth.accessToken, {
          name: payload.topicName.trim(),
          description: payload.topicDescription?.trim() || undefined,
        });
        collectionId = created.data?.id ?? null;
      }

      for (const item of payload.items) {
        if (!item.englishWord?.trim() || !item.meaningVi?.trim()) continue;
        await createAndAttachToCollection(item, collectionId);
      }
      await loadCollectionsAndCards();
      setShowAddForm(false);
      Alert.alert("Flashcard", "Da them nhanh tu JSON.");
    } catch (error) {
      Alert.alert("Bulk JSON", error instanceof Error ? error.message : "Khong parse duoc JSON.");
    } finally {
      setWorking(false);
    }
  };

  const handleDeleteCurrentCard = async () => {
    if (!auth.accessToken || !currentCard || mode !== "mine") return;
    try {
      setWorking(true);
      await deleteMyFlashcard(auth.accessToken, currentCard.id);
      await loadCollectionsAndCards();
      setCardIndex(0);
      setShowMeaning(false);
    } catch (error) {
      Alert.alert("Flashcard", error instanceof Error ? error.message : "Khong xoa duoc tu.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <UserScreen>
      <AppHeader
        title="Flashcards"
        leftIcon={selectedModuleId ? "chevron-back-outline" : undefined}
        onLeftPress={selectedModuleId ? () => router.back() : undefined}
        rightSlot={<AvatarBadge label="A" />}
      />

      <View style={styles.topBar}>
        <View style={styles.tabRow}>
          {selectedModuleId ? (
            <Pressable style={[styles.tabButton, mode === "lesson" ? styles.tabButtonActive : null]} onPress={() => setMode("lesson")}>
              <Text style={styles.tabText}>Bai hoc</Text>
            </Pressable>
          ) : null}
          <Pressable style={[styles.tabButton, mode === "mine" ? styles.tabButtonActive : null]} onPress={() => setMode("mine")}>
            <Text style={styles.tabText}>Tu cua toi</Text>
          </Pressable>
        </View>

        {mode === "mine" ? (
          <View style={styles.actionButtons}>
            <Pressable style={styles.iconBtn} onPress={() => setShowTopicEditor((v) => !v)}>
              <Ionicons name="folder-open-outline" size={18} color={colors.primaryDark} />
            </Pressable>
            <Pressable style={[styles.iconBtn, styles.iconBtnPrimary]} onPress={() => setShowAddForm((v) => !v)}>
              <Ionicons name="add" size={20} color="#fff" />
            </Pressable>
          </View>
        ) : null}
      </View>

      {mode === "mine" ? (
        <SurfaceCard style={styles.collectionCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              <Pressable
                style={[styles.chip, selectedCollectionId === null ? styles.chipActive : null]}
                onPress={async () => {
                  setSelectedCollectionId(null);
                  if (!auth.accessToken) return;
                  const mine = await getMyFlashcards(auth.accessToken);
                  setMyCards(mine.data ?? []);
                  setCardIndex(0);
                }}
              >
                <Text style={styles.chipText}>Tat ca</Text>
              </Pressable>
              {collections.map((collection) => (
                <Pressable
                  key={collection.id}
                  style={[styles.chip, selectedCollectionId === collection.id ? styles.chipActive : null]}
                  onPress={async () => {
                    setSelectedCollectionId(collection.id);
                    if (!auth.accessToken) return;
                    const detail = await getFlashcardCollectionDetail(auth.accessToken, collection.id);
                    setMyCards(detail.data?.flashcards ?? []);
                    setCardIndex(0);
                  }}
                >
                  <Text style={styles.chipText}>{collection.name}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SurfaceCard>
      ) : null}

      {mode === "mine" && showTopicEditor ? (
        <SurfaceCard style={styles.panelCard}>
          <Text style={styles.panelTitle}>Quan ly chu de</Text>
          <TextInput
            style={styles.input}
            placeholder="Ten chu de moi"
            placeholderTextColor={colors.textMuted}
            value={newCollectionName}
            onChangeText={setNewCollectionName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mo ta"
            placeholderTextColor={colors.textMuted}
            value={newCollectionDescription}
            onChangeText={setNewCollectionDescription}
          />
          <View style={styles.btnRow}>
            <Pressable style={styles.primaryBtn} disabled={working} onPress={handleCreateCollection}>
              <Text style={styles.primaryBtnText}>Tao chu de</Text>
            </Pressable>
            <Pressable style={styles.ghostDangerBtn} disabled={working || !selectedCollectionId} onPress={handleDeleteCollection}>
              <Text style={styles.ghostDangerText}>Xoa</Text>
            </Pressable>
          </View>
        </SurfaceCard>
      ) : null}

      {mode === "mine" && showAddForm ? (
        <SurfaceCard style={styles.panelCard}>
          <View style={styles.tabRow}>
            <Pressable style={[styles.tabButton, addMode === "manual" ? styles.tabButtonActive : null]} onPress={() => setAddMode("manual")}>
              <Text style={styles.tabText}>Them tay</Text>
            </Pressable>
            <Pressable style={[styles.tabButton, addMode === "bulk" ? styles.tabButtonActive : null]} onPress={() => setAddMode("bulk")}>
              <Text style={styles.tabText}>Them JSON</Text>
            </Pressable>
          </View>

          {addMode === "manual" ? (
            <>
              <TextInput style={styles.input} placeholder="English word" placeholderTextColor={colors.textMuted} value={manualWord} onChangeText={setManualWord} />
              <TextInput style={styles.input} placeholder="Meaning (VI)" placeholderTextColor={colors.textMuted} value={manualMeaning} onChangeText={setManualMeaning} />
              <TextInput style={styles.input} placeholder="Example sentence" placeholderTextColor={colors.textMuted} value={manualExample} onChangeText={setManualExample} />
              <TextInput style={styles.input} placeholder="Pronunciation" placeholderTextColor={colors.textMuted} value={manualPronunciation} onChangeText={setManualPronunciation} />
              <Pressable style={styles.primaryBtn} disabled={working} onPress={handleManualAdd}>
                <Text style={styles.primaryBtnText}>{working ? "Dang them..." : "Them flashcard"}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.hint}>Paste JSON theo mau ben duoi:</Text>
              <TextInput
                style={[styles.input, styles.jsonInput]}
                multiline
                placeholder="Dan JSON vao day"
                placeholderTextColor={colors.textMuted}
                value={bulkJson}
                onChangeText={setBulkJson}
              />
              <Pressable style={styles.primaryBtn} disabled={working} onPress={handleBulkAdd}>
                <Text style={styles.primaryBtnText}>{working ? "Dang them..." : "Them nhanh JSON"}</Text>
              </Pressable>
            </>
          )}
        </SurfaceCard>
      ) : null}

      <View style={styles.headline}>
        <Text style={styles.title}>{mode === "lesson" ? "Lesson Vocabulary" : "My Vocabulary"}</Text>
        <Text style={styles.counter}>{currentCards.length ? `${cardIndex + 1}/${currentCards.length}` : "0/0"}</Text>
      </View>
      <ProgressBar value={currentCards.length ? ((cardIndex + 1) / currentCards.length) * 100 : 0} accentColor="#2EB84B" />

      <Pressable onPress={() => setShowMeaning((v) => !v)}>
        <SurfaceCard style={styles.flashcard}>
          <Text style={styles.word}>{loading ? "Dang tai..." : currentCard?.englishWord ?? "Chua co flashcard"}</Text>
          <View style={styles.pronRow}>
            <Text style={styles.pronText}>{currentCard?.pronunciation ?? "-"}</Text>
            <Pressable style={styles.listenBtn} onPress={() => speakText(currentCard?.englishWord ?? "")}>
              <Ionicons name="volume-high" color="#fff" size={18} />
            </Pressable>
          </View>

          <View style={styles.voiceRow}>
            <Pressable style={[styles.tinyBtn, voiceRegion === "US" ? styles.tinyBtnActive : null]} onPress={() => setVoiceRegion("US")}>
              <Text style={styles.tinyBtnText}>US</Text>
            </Pressable>
            <Pressable style={[styles.tinyBtn, voiceRegion === "UK" ? styles.tinyBtnActive : null]} onPress={() => setVoiceRegion("UK")}>
              <Text style={styles.tinyBtnText}>UK</Text>
            </Pressable>
            <Text style={styles.meta}>{isSpeaking ? "Dang doc..." : Platform.OS === "web" ? "Web speech" : "Mobile speech"}</Text>
          </View>
          <View style={styles.voiceRow}>
            <Pressable style={styles.tinyBtn} onPress={() => setRate((v) => Math.max(0.5, +(v - 0.1).toFixed(1)))}><Text style={styles.tinyBtnText}>Rate-</Text></Pressable>
            <Text style={styles.meta}>{rate.toFixed(1)}</Text>
            <Pressable style={styles.tinyBtn} onPress={() => setRate((v) => Math.min(2, +(v + 0.1).toFixed(1)))}><Text style={styles.tinyBtnText}>Rate+</Text></Pressable>
            <Pressable style={styles.tinyBtn} onPress={() => setPitch((v) => Math.max(0, +(v - 0.1).toFixed(1)))}><Text style={styles.tinyBtnText}>Pitch-</Text></Pressable>
            <Text style={styles.meta}>{pitch.toFixed(1)}</Text>
            <Pressable style={styles.tinyBtn} onPress={() => setPitch((v) => Math.min(2, +(v + 0.1).toFixed(1)))}><Text style={styles.tinyBtnText}>Pitch+</Text></Pressable>
          </View>

          <View style={styles.meaningBox}>
            {showMeaning ? (
              <>
                <Text style={styles.label}>Nghia</Text>
                <Text style={styles.meaning}>{currentCard?.meaningVi ?? "Khong co nghia"}</Text>
                <Text style={styles.label}>Vi du</Text>
                <Text style={styles.example}>{currentCard?.exampleSentence ?? "Khong co vi du"}</Text>
              </>
            ) : (
              <Text style={styles.tapHint}>Cham de hien nghia</Text>
            )}
          </View>
        </SurfaceCard>
      </Pressable>

      <View style={styles.btnRow}>
        <Pressable
          style={styles.ghostBtn}
          disabled={currentCards.length === 0}
          onPress={() => {
            setShowMeaning(false);
            setCardIndex((v) => (v - 1 + currentCards.length) % currentCards.length);
          }}
        >
          <Text style={styles.ghostBtnText}>Prev</Text>
        </Pressable>
        <Pressable
          style={styles.primaryBtn}
          disabled={currentCards.length === 0}
          onPress={() => {
            setShowMeaning(false);
            setCardIndex((v) => (v + 1) % currentCards.length);
          }}
        >
          <Text style={styles.primaryBtnText}>Next</Text>
        </Pressable>
        {mode === "mine" ? (
          <Pressable style={styles.ghostDangerBtn} disabled={working || !currentCard} onPress={handleDeleteCurrentCard}>
            <Text style={styles.ghostDangerText}>Xoa</Text>
          </Pressable>
        ) : null}
      </View>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  tabButton: {
    backgroundColor: "#E9EEF8",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  tabButtonActive: {
    backgroundColor: "#1F4FBF",
  },
  tabText: {
    color: "#132B57",
    fontSize: 12,
    fontWeight: "800",
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconBtn: {
    alignItems: "center",
    backgroundColor: "#E9EEF8",
    borderRadius: radius.pill,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  iconBtnPrimary: {
    backgroundColor: "#1F4FBF",
  },
  collectionCard: {
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: "#EEF2FB",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: "#CFDBF7",
  },
  chipText: {
    color: "#173267",
    fontSize: 12,
    fontWeight: "700",
  },
  panelCard: {
    marginBottom: spacing.md,
  },
  panelTitle: {
    color: "#173267",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: "#F5F7FC",
    borderColor: "#DFE6F5",
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  jsonInput: {
    minHeight: 170,
    textAlignVertical: "top",
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  headline: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  title: {
    color: "#132B57",
    fontSize: 24,
    fontWeight: "900",
  },
  counter: {
    color: "#1F4FBF",
    fontSize: 15,
    fontWeight: "800",
  },
  flashcard: {
    marginTop: spacing.md,
    minHeight: 420,
  },
  word: {
    color: "#0E2652",
    fontSize: 46,
    fontWeight: "900",
    marginTop: spacing.md,
    textAlign: "center",
  },
  pronRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  pronText: {
    color: "#3B5C9E",
    fontSize: 20,
    marginRight: spacing.md,
  },
  listenBtn: {
    alignItems: "center",
    backgroundColor: "#1F4FBF",
    borderRadius: radius.pill,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  voiceRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  tinyBtn: {
    backgroundColor: "#ECF1FD",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tinyBtnActive: {
    backgroundColor: "#CFDBF7",
  },
  tinyBtnText: {
    color: "#173267",
    fontSize: 11,
    fontWeight: "800",
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  meaningBox: {
    borderColor: "#E2E9F8",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: spacing.lg,
    minHeight: 130,
    padding: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
  },
  meaning: {
    color: "#10274F",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: spacing.sm,
    marginTop: 4,
  },
  example: {
    color: "#27457B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  tapHint: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.md,
    textAlign: "center",
  },
  btnRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryBtn: {
    alignItems: "center",
    backgroundColor: "#1F4FBF",
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },
  ghostBtn: {
    alignItems: "center",
    backgroundColor: "#ECF1FD",
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  ghostBtnText: {
    color: "#173267",
    fontSize: 13,
    fontWeight: "800",
  },
  ghostDangerBtn: {
    alignItems: "center",
    backgroundColor: "#FCEBEA",
    borderRadius: radius.pill,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  ghostDangerText: {
    color: "#B42318",
    fontSize: 13,
    fontWeight: "900",
  },
});
