import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import GameCard from "../components/GameCard";
import PrimaryButton from "../components/PrimaryButton";
import { STATUS_OPTIONS } from "../utils/libraryHelpers";
import { colors, commonStyles } from "../styles/theme";

export default function LibraryScreen({
  library,
  onStatusChange,
  onRemove,
  navigation,
}) {
  return (
    <SafeAreaView style={commonStyles.screen}>
      <FlatList
        data={library}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={commonStyles.content}
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
              onPress={() => navigation.navigate("Explore")}
            />
          </View>
        }
      />
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
});
