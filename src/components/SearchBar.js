import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../styles/theme";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Pesquisar jogos...",
}) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        accessibilityLabel="Pesquisar jogos"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        returnKeyType="search"
        style={styles.input}
      />
      {value ? (
        <Pressable accessibilityLabel="Limpar pesquisa" onPress={() => onChangeText("")} style={styles.clearButton} hitSlop={8}>
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative", marginTop: 20 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingRight: 44,
  },
  clearButton: { alignItems: "center", height: 40, justifyContent: "center", position: "absolute", right: 8, top: 4, width: 32 },
  clearText: { color: colors.muted, fontSize: 27, lineHeight: 30 },
});
