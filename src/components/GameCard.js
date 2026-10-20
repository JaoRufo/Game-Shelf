import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function GameCard({ game, onPress, status }) {
  const [imageFailed, setImageFailed] = useState(false);
  const title = game?.title || "Jogo sem título";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {!imageFailed && game?.thumbnail ? (
        <Image
          source={{ uri: game.thumbnail }}
          onError={() => setImageFailed(true)}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.fallbackText}>CAPA</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {game?.genre || "Gênero não informado"}
        </Text>
        <Text numberOfLines={1} style={styles.platform}>
          {game?.platform || "Plataforma não informada"}
        </Text>
        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    flexDirection: "row",
    minHeight: 108,
  },
  pressed: { opacity: 0.82 },
  image: { width: 108, height: 108, backgroundColor: colors.surfaceElevated },
  imageFallback: {
    width: 108,
    height: 108,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceElevated,
  },
  fallbackText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  info: { flex: 1, padding: 14, justifyContent: "center" },
  title: { color: colors.text, fontSize: 16, fontWeight: "700" },
  meta: { color: colors.primary, fontSize: 13, marginTop: 8 },
  platform: { color: colors.muted, fontSize: 12, marginTop: 5 },
  status: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
});
