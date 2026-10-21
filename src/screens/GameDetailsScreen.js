import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import FeedbackModal from "../components/FeedbackModal";
import AnimatedBrandTitle from "../components/AnimatedBrandTitle";
import { STATUS_OPTIONS } from "../utils/libraryHelpers";
import { fetchGameDetails } from "../services/freeToGameApi";
import { colors, commonStyles } from "../styles/theme";

const Detail = ({ label, value }) =>
  value ? (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  ) : null;

export default function GameDetailsScreen({ route }) {
  const initialGame = route.params?.game;
  const [game, setGame] = useState(initialGame);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState(null);
  const library = route.params?.library || [];
  const fromLibrary = route.params?.fromLibrary === true;
  const savedGame = library.find(
    (item) => String(item.id) === String(game?.id),
  );
  const savedNotes = savedGame?.notes?.trim() || "";
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const loadDetails = async () => {
      if (!initialGame?.id) {
        setLoading(false);
        return;
      }
      try {
        const details = await fetchGameDetails(
          initialGame.id,
          controller.signal,
        );
        if (mounted) setGame((current) => ({ ...current, ...details }));
      } catch (error) {
        if (error?.name !== "AbortError" && mounted)
          setMessage(
            "Detalhes completos indisponíveis; exibindo os dados do catálogo.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDetails();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [initialGame]);
  if (!game)
    return (
      <View style={[commonStyles.screen, styles.center]}>
        <Text style={commonStyles.message}>Jogo não encontrado.</Text>
      </View>
    );
  const confirmAddGame = () => {
    if (savedGame) {
      setFeedback({
        type: "error",
        title: "Jogo já adicionado",
        message: "Este jogo já está no seu inventário.",
      });
      return;
    }
    if (!route.params?.onAdd) {
      setFeedback({
        type: "error",
        title: "Não foi possível adicionar",
        message: "A biblioteca não está disponível no momento.",
      });
      return;
    }
    route.params?.onAdd?.(game, selectedStatus, notes);
    setAddModalVisible(false);
    setFeedback({
      type: "success",
      title: "Jogo adicionado",
      message: "O jogo foi salvo no seu inventário.",
    });
  };
  const changeStatus = (status) => {
    if (savedGame?.status === status) return;
    if (!route.params?.onStatusChange) {
      setFeedback({
        type: "error",
        title: "Não foi possível atualizar",
        message: "A biblioteca não está disponível no momento.",
      });
      return;
    }
    route.params.onStatusChange(game.id, status);
    setFeedback({
      type: "success",
      title: "Status atualizado",
      message: `O jogo agora está marcado como "${status}".`,
    });
  };
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={commonStyles.screen}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        scrollIndicatorInsets={
          Platform.OS === "ios" ? { right: 10000 } : undefined
        }
        contentInsetAdjustmentBehavior="never"
        bounces={false}
        contentContainerStyle={[
          commonStyles.content,
          styles.scrollContainer,
          styles.detailsContent,
        ]}
      >
      <AnimatedBrandTitle containerStyle={styles.detailsTitle}>
        Detalhes
      </AnimatedBrandTitle>
      {game.thumbnail && !imageFailed ? (
        <Image
          source={{ uri: game.thumbnail }}
          onError={() => setImageFailed(true)}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Text style={styles.fallback}>CAPA INDISPONÍVEL</Text>
        </View>
      )}
      <Text style={commonStyles.title}>{game.title || "Jogo sem título"}</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Text style={styles.description}>
        {game.short_description ||
          game.description ||
          "Descrição não informada."}
      </Text>
      <View style={styles.details}>
        <Detail label="Gênero" value={game.genre} />
        <Detail label="Plataforma" value={game.platform} />
        <Detail label="Desenvolvedora" value={game.developer} />
        <Detail label="Publicadora" value={game.publisher} />
        <Detail label="Lançamento" value={game.release_date} />
        <Detail
          label="Avaliação"
          value={
            game.rating || game.score ? String(game.rating || game.score) : null
          }
        />
      </View>
      <View style={styles.inventoryButton}>
        <PrimaryButton
          label={savedGame ? "Já está no inventário" : "Adicionar ao inventário"}
          onPress={() => setAddModalVisible(true)}
          disabled={Boolean(savedGame)}
        />
      </View>
      {savedGame && fromLibrary ? (
        <View style={styles.savedBox}>
          <Text style={styles.savedTitle}>
            Status atual: {savedGame.status}
          </Text>
          {savedNotes ? (
            <View style={styles.savedNotesBox}>
              <Text style={styles.savedNotesLabel}>Observações</Text>
              <Text style={styles.savedNotes}>{savedNotes}</Text>
            </View>
          ) : null}
          <Text style={styles.statusLabel}>Alterar status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((status) => (
              <Text
                key={status}
                onPress={() => changeStatus(status)}
                style={[
                  styles.statusChip,
                  savedGame.status === status && styles.activeStatus,
                ]}
              >
                {status}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar ao inventário</Text>
            <Text style={styles.modalLabel}>Status atual:</Text>
            <View style={[styles.statusRow, styles.modalStatusRow]}>
              {STATUS_OPTIONS.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  style={[
                    styles.statusChipButton,
                    selectedStatus === status && styles.activeStatusButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      selectedStatus === status && styles.activeStatusText,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.modalLabel, styles.notesLabel]}>
              Observações (opcional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex.: jogar com amigos"
              placeholderTextColor={colors.muted}
              multiline
              style={styles.notesInput}
            />
            <View style={styles.modalActions}>
              <PrimaryButton
                label="Cancelar"
                variant="secondary"
                onPress={() => setAddModalVisible(false)}
              />
              <PrimaryButton label="Adicionar" onPress={confirmAddGame} />
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
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContainer: { scrollbarWidth: "none" },
  detailsContent: { paddingTop: 0 },
  detailsTitle: { marginBottom: 14 },
  cover: {
    width: "100%",
    height: 210,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    marginBottom: 20,
  },
  coverFallback: { alignItems: "center", justifyContent: "center" },
  fallback: { color: colors.muted },
  loader: { marginVertical: 10 },
  inventoryButton: { marginBottom: 24 },
  message: { color: colors.muted, fontSize: 13, marginTop: 10 },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 18,
  },
  details: { marginVertical: 22 },
  detail: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailLabel: { color: colors.muted },
  detailValue: {
    color: colors.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  savedBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    marginBottom: 8,
    padding: 18,
  },
  savedTitle: { color: colors.success, fontWeight: "700" },
  savedNotesBox: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  savedNotesLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  savedNotes: { color: colors.text, fontSize: 14, lineHeight: 21 },
  statusLabel: { color: colors.muted, fontSize: 13, fontWeight: "700" },
  statusRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statusChip: {
    color: colors.muted,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  activeStatus: {
    color: "#fff",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    fontWeight: "700",
  },
  statusChipButton: {
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  activeStatusButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusChipText: { color: colors.muted },
  activeStatusText: { color: "#fff", fontWeight: "700" },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(5, 7, 18, 0.78)",
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    width: "100%",
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 22,
  },
  modalLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalStatusRow: { marginBottom: 20 },
  notesLabel: { marginTop: 2 },
  notesInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    minHeight: 84,
    padding: 12,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 22,
  },
  center: { alignItems: "center", justifyContent: "center" },
});
