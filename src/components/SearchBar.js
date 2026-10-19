import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { colors } from "../styles/theme";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Pesquisar jogos...",
}) {
  return (
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
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 16,
    marginTop: 20,
  },
});
