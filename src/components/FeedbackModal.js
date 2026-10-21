import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../styles/theme";

export default function FeedbackModal({
  visible,
  type = "success",
  title,
  message,
  onClose,
  autoClose = true,
  duration = 2400,
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const isSuccess = type === "success";
  const accent = isSuccess ? colors.success : colors.danger;

  useEffect(() => {
    if (!visible) return undefined;

    opacity.setValue(0);
    scale.setValue(0.9);
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    const timeout = autoClose ? setTimeout(onClose, duration) : null;
    return () => {
      animation.stop();
      if (timeout) clearTimeout(timeout);
    };
  }, [autoClose, duration, onClose, opacity, scale, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[styles.card, { opacity, transform: [{ scale }] }]}
        >
          <View style={[styles.icon, { backgroundColor: accent }]}>
            <Text style={styles.iconText}>{isSuccess ? "✓" : "!"}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar mensagem"
            onPress={onClose}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: accent },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(5, 7, 18, 0.78)",
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    width: "100%",
  },
  icon: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginBottom: 14,
    width: 48,
  },
  iconText: { color: "#fff", fontSize: 28, fontWeight: "800" },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 20,
    minHeight: 44,
    paddingHorizontal: 28,
  },
  buttonPressed: { opacity: 0.78, transform: [{ scale: 0.97 }] },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
