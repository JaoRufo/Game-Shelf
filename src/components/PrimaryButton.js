import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../styles/theme";

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "danger" && styles.danger,
        variant === "secondary" && styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  danger: { backgroundColor: colors.danger },
  secondary: { backgroundColor: colors.surfaceElevated },
  disabled: { opacity: 0.45 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.88 },
  label: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
