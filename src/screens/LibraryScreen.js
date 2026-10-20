import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import GameCard from "../components/GameCard";
import PrimaryButton from "../components/PrimaryButton";
import { STATUS_OPTIONS } from "../utils/libraryHelpers";
import { colors, commonStyles } from "../styles/theme";
import BottomNavigation from "../components/BottomNavigation";

export default function LibraryScreen({
  library,
  onStatusChange,
  onRemove,
  navigation,
  hideBottomNavigation = false,
  onMainNavigate,
}) {
  return (
    <SafeAreaView style={commonStyles.screen}>
      <FlatList
        data={library}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[commonStyles.content, { paddingBottom: 112 }]}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <GameCard
              game={item}
              status={item.status}
              onPress={() => navigation.navigate("GameDetails", { game: item })}
            />
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((status) => (
                <Text
                  key={status}
                  onPress={() => onStatusChange(item.id, status)}
                  style={[
                    styles.statusChip,
                    item.status === status && styles.activeStatus,
                  ]}
                >
                  {status}
                </Text>
              ))}
            </View>
            <PrimaryButton
              label="Remover da biblioteca"
              variant="danger"
              onPress={() => onRemove(item.id)}
            />
            {item.notes ? <Text style={styles.notes}>Observação: {item.notes}</Text> : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sua biblioteca está vazia</Text>
            <Text style={commonStyles.message}>
              Explore o catálogo e salve jogos para acompanhar o que deseja
              jogar.
            </Text>
            <PrimaryButton
              label="Explorar jogos"
              onPress={() => (onMainNavigate ? onMainNavigate("Explore") : navigation.replace("Explore"))}
            />
          </View>
        }
      />
      {!hideBottomNavigation ? (
        <BottomNavigation
          active="library"
          onNavigate={onMainNavigate || ((screen) => navigation.replace(screen))}
        />
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  item: { marginBottom: 20 },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  statusChip: {
    color: colors.muted,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
  },
  activeStatus: {
    color: "#fff",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    fontWeight: "700",
  },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
  notes: { color: colors.muted, fontSize: 13, marginTop: 8 },
});
