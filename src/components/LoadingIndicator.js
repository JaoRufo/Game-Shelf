import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function LoadingIndicator({ label = "Carregando catálogo" }) {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.container} accessibilityLabel={label}>
      <View style={styles.mark}>
        <Animated.View
          style={[
            styles.bar,
            styles.barPrimary,
            { opacity: pulse, transform: [{ scaleY: pulse }] },
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            styles.barSuccess,
            { opacity: pulse, transform: [{ scaleY: pulse }] },
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            styles.barPrimary,
            { opacity: pulse, transform: [{ scaleY: pulse }] },
          ]}
        />
      </View>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.caption}>Preparando sua biblioteca</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 28 },
  mark: { flexDirection: "row", alignItems: "center", height: 34, gap: 5 },
  bar: { width: 7, height: 28, borderRadius: 4 },
  barPrimary: { backgroundColor: colors.primary },
  barSuccess: { backgroundColor: colors.success, height: 34 },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginTop: 14,
  },
  caption: { color: colors.muted, fontSize: 12, marginTop: 6 },
});
