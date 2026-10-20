import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
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

export default function GameDetailsScreen({ route, navigation }) {
  const initialGame = route.params?.game;
  const [game, setGame] = useState(initialGame);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);
  const [notes, setNotes] = useState("");
  const library = route.params?.library || [];
  const savedGame = library.find(
    (item) => String(item.id) === String(game?.id),
  );
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
  const addGame = () => {
    if (!savedGame) {
      route.params?.onAdd?.(game);
      setMessage("Jogo adicionado à biblioteca.");
    }
  };
  const confirmAddGame = () => {
    route.params?.onAdd?.(game, selectedStatus, notes);
    setAddModalVisible(false);
    setMessage("Jogo adicionado à biblioteca.");
  };
  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
    >
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
      <PrimaryButton
        label={savedGame ? "Já está na biblioteca" : "Adicionar à biblioteca"}
        onPress={() => setAddModalVisible(true)}
        disabled={Boolean(savedGame)}
      />
      {savedGame ? (
        <View style={styles.savedBox}>
          <Text style={styles.savedTitle}>
            Status atual: {savedGame.status}
          </Text>
          {savedGame.notes ? <Text style={styles.savedNotes}>Observação: {savedGame.notes}</Text> : null}
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((status) => (
              <Text
                key={status}
                onPress={() => route.params?.onStatusChange?.(game.id, status)}
                style={[
                  styles.statusChip,
                  savedGame.status === status && styles.activeStatus,
                ]}
              >
                {status}
              </Text>
            ))}
          </View>
          <PrimaryButton
            label="Remover da biblioteca"
            variant="danger"
            onPress={() => {
              route.params?.onRemove?.(game.id);
              setMessage("Jogo removido da biblioteca.");
            }}
          />
        </View>
      ) : null}
      <Modal visible={addModalVisible} transparent animationType="fade" onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar à biblioteca</Text>
            <Text style={styles.modalLabel}>Status atual:</Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((status) => (
                <Pressable key={status} onPress={() => setSelectedStatus(status)} style={[styles.statusChipButton, selectedStatus === status && styles.activeStatusButton]}>
                  <Text style={[styles.statusChipText, selectedStatus === status && styles.activeStatusText]}>{status}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.modalLabel}>Observações (opcional)</Text>
            <TextInput value={notes} onChangeText={setNotes} placeholder="Ex.: jogar com amigos" placeholderTextColor={colors.muted} multiline style={styles.notesInput} />
            <View style={styles.modalActions}>
              <PrimaryButton label="Cancelar" variant="secondary" onPress={() => setAddModalVisible(false)} />
              <PrimaryButton label="Adicionar" onPress={confirmAddGame} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
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
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: 20,
    paddingTop: 18,
    gap: 12,
  },
  savedTitle: { color: colors.success, fontWeight: "700" },
  savedNotes: { color: colors.muted, fontSize: 13 },
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
  statusChipButton: { borderColor: colors.border, borderRadius: 16, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  activeStatusButton: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusChipText: { color: colors.muted },
  activeStatusText: { color: "#fff", fontWeight: "700" },
  modalBackdrop: { alignItems: "center", backgroundColor: "rgba(5, 7, 18, 0.78)", flex: 1, justifyContent: "center", padding: 22 },
  modalCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, padding: 20, width: "100%" },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: "800", marginBottom: 20 },
  modalLabel: { color: colors.text, fontSize: 14, fontWeight: "700", marginBottom: 10 },
  notesInput: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 10, borderWidth: 1, color: colors.text, minHeight: 76, padding: 12, textAlignVertical: "top" },
  modalActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 18 },
  center: { alignItems: "center", justifyContent: "center" },
});
