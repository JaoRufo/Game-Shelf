import { StyleSheet } from "react-native";

export const colors = {
  background: "#0d1020",
  surface: "#171b2e",
  surfaceElevated: "#202640",
  border: "#303855",
  primary: "#8b5cf6",
  success: "#35d07f",
  danger: "#f26d78",
  text: "#f6f7fb",
  muted: "#a7adc4",
};

export const commonStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, overflow: "hidden" },
  content: { padding: 20, paddingBottom: 32 },
  title: { color: colors.text, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  message: {
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
    marginVertical: 20,
  },
});
