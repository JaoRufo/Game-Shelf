import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameCard from "../components/GameCard";
import PrimaryButton from "../components/PrimaryButton";
import FeedbackModal from "../components/FeedbackModal";
import { STATUS_OPTIONS } from "../utils/libraryHelpers";
import { colors, commonStyles } from "../styles/theme";
import BottomNavigation from "../components/BottomNavigation";
import AnimatedBrandTitle from "../components/AnimatedBrandTitle";

export default function LibraryScreen({ library, navigation, onRemove, onNotesChange, hideBottomNavigation = false, onMainNavigate, animationTrigger = 0, scrollToTopTrigger = 0 }) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedGame, setSelectedGame] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [feedback, setFeedback] = useState(null);
  const listRef = useRef(null);
  const filters = ["Todos", ...STATUS_OPTIONS];
  const filteredLibrary = useMemo(
    () => activeFilter === "Todos" ? library : library.filter((item) => item.status === activeFilter),
    [activeFilter, library],
  );

  const openMenu = (game) => {
    setSelectedGame(game);
    setMenuVisible(true);
  };
  const openEditor = () => {
    setNoteDraft(selectedGame?.notes || "");
    setMenuVisible(false);
    setEditVisible(true);
  };
  const saveNotes = () => {
    if (!selectedGame || !onNotesChange) {
      setFeedback({
        type: "error",
        title: "Não foi possível salvar",
        message: "A observação não pôde ser atualizada.",
      });
      return;
    }
    const currentNotes = selectedGame.notes || "";
    if (noteDraft.trim() === currentNotes.trim()) {
      setEditVisible(false);
      return;
    }
    onNotesChange(selectedGame.id, noteDraft);
    setEditVisible(false);
    setFeedback({
      type: "success",
      title: "Observação salva",
      message: "A observação foi atualizada com sucesso.",
    });
  };
  const removeSelectedGame = () => {
    if (!selectedGame || !onRemove) {
      setFeedback({
        type: "error",
        title: "Não foi possível remover",
        message: "O jogo não pôde ser removido do inventário.",
      });
      return;
    }
    onRemove(selectedGame.id);
    setMenuVisible(false);
    setFeedback({
      type: "success",
      title: "Jogo removido",
      message: "O jogo foi removido do seu inventário.",
    });
  };

  useEffect(() => {
    if (scrollToTopTrigger > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTopTrigger]);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={commonStyles.screen}>
      <FlatList
        ref={listRef}
        data={filteredLibrary}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        scrollIndicatorInsets={Platform.OS === "ios" ? { right: 10000 } : undefined}
        contentInsetAdjustmentBehavior="never"
        bounces={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[commonStyles.content, { paddingBottom: 112, paddingTop: 0 }]}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.cardWrap}>
              <GameCard game={item} status={item.status} onPress={() => navigation.navigate("GameDetails", { game: item, fromLibrary: true })} />
              <Pressable accessibilityLabel={`Ações de ${item.title}`} style={styles.moreButton} onPress={() => openMenu(item)} hitSlop={8}>
                <Text style={styles.moreIcon}>•••</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <>
            <AnimatedBrandTitle animationTrigger={animationTrigger}>Meu Inventário</AnimatedBrandTitle>
            <Text style={styles.helper}>Organize seus jogos e acompanhe seu progresso.</Text>
            <View style={styles.filters}>
              {filters.map((filter) => (
                <Text key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filter, activeFilter === filter && styles.activeFilter]}>{filter}</Text>
              ))}
            </View>
            <Text style={styles.resultLabel}>{filteredLibrary.length} jogo(s)</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{library.length ? "Nenhum jogo com este filtro" : "Seu inventário está vazio"}</Text>
            <Text style={commonStyles.message}>{library.length ? "Escolha outro status para visualizar seus jogos." : "Explore o catálogo e salve jogos para acompanhar o que deseja jogar."}</Text>
            {!library.length ? <PrimaryButton label="Explorar jogos" onPress={() => (onMainNavigate ? onMainNavigate("Explore") : navigation.replace("Explore"))} /> : null}
          </View>
        }
      />
      {!hideBottomNavigation ? <BottomNavigation active="library" onNavigate={onMainNavigate || ((screen) => navigation.replace(screen))} /> : null}

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>{selectedGame?.title}</Text>
            <Pressable style={styles.menuOption} onPress={openEditor}><Text style={styles.menuText}>Editar observações</Text></Pressable>
            <Pressable style={styles.menuOption} onPress={removeSelectedGame}><Text style={styles.removeText}>Remover do inventário</Text></Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={editVisible} transparent animationType="fade" onRequestClose={() => setEditVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>Observações</Text>
            <TextInput value={noteDraft} onChangeText={setNoteDraft} multiline placeholder="Adicione uma observação..." placeholderTextColor={colors.muted} style={styles.notesInput} />
            <View style={styles.editActions}>
              <PrimaryButton label="Cancelar" variant="secondary" onPress={() => setEditVisible(false)} />
              <PrimaryButton label="Salvar" onPress={saveNotes} />
            </View>
          </View>
        </View>
      </Modal>
      <FeedbackModal
        visible={Boolean(feedback)}
        type={feedback?.type}
        title={feedback?.title}
        message={feedback?.message}
        onClose={() => setFeedback(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { scrollbarWidth: "none" },
  item: { marginBottom: 12 },
  cardWrap: { position: "relative" },
  moreButton: { alignItems: "center", backgroundColor: "rgba(13, 16, 32, 0.9)", borderRadius: 16, height: 34, justifyContent: "center", position: "absolute", right: 10, top: 10, width: 34 },
  moreIcon: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 1 },
  helper: { color: colors.muted, fontSize: 14, marginTop: 6, textAlign: "center" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 22 },
  filter: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, color: colors.muted, fontSize: 12, paddingHorizontal: 10, paddingVertical: 7 },
  activeFilter: { backgroundColor: colors.primary, borderColor: colors.primary, color: "#fff", fontWeight: "700" },
  resultLabel: { color: colors.muted, fontSize: 12, marginBottom: 14, marginTop: 14 },
  empty: { alignItems: "center", paddingTop: 40 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
  backdrop: { alignItems: "center", backgroundColor: "rgba(5, 7, 18, 0.78)", flex: 1, justifyContent: "center", padding: 22 },
  menuCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, padding: 20, width: "100%" },
  menuTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 14 },
  menuOption: { borderTopColor: colors.border, borderTopWidth: 1, paddingVertical: 16 },
  menuText: { color: colors.text, fontSize: 15, fontWeight: "600" },
  removeText: { color: colors.danger, fontSize: 15, fontWeight: "700" },
  notesInput: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 10, borderWidth: 1, color: colors.text, minHeight: 90, padding: 12, textAlignVertical: "top" },
  editActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 18 },
});
