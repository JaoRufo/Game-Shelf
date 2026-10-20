import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/theme";

export default function BottomNavigation({ active, onNavigate }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const indicator = useRef(
    new Animated.Value(active === "library" ? 1 : 0),
  ).current;
  const navigationTimeout = useRef(null);

  useEffect(() => {
    Animated.spring(indicator, {
      toValue: active === "library" ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
    return () => {
      if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
    };
  }, [active, indicator]);

  const handleNavigate = (screen) => {
    const nextValue = screen === "Library" ? 1 : 0;
    if (
      (active === "library" && nextValue === 1) ||
      (active === "home" && nextValue === 0)
    )
      return;

    Animated.spring(indicator, {
      toValue: nextValue,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
    navigationTimeout.current = setTimeout(() => onNavigate(screen), 70);
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            left: width * 0.25 - 22,
            transform: [
              {
                translateX: indicator.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width * 0.5],
                }),
              },
            ],
          },
        ]}
      />
      <Pressable
        accessibilityLabel="Ir para Home"
        style={styles.item}
        onPress={() => handleNavigate("Explore")}
      >
        <GamepadIcon active={active === "home"} />
        <Text style={[styles.label, active === "home" && styles.activeText]}>
          Home
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Ir para Biblioteca"
        style={styles.item}
        onPress={() => handleNavigate("Library")}
      >
        <BackpackIcon active={active === "library"} />
        <Text style={[styles.label, active === "library" && styles.activeText]}>
          Biblioteca
        </Text>
      </Pressable>
    </View>
  );
}

function GamepadIcon({ active }) {
  const color = active ? "#fff" : "rgba(255, 255, 255, 0.62)";
  return (
    <View style={[styles.gamepad, { borderColor: color }]}>
      <View style={[styles.dpad, { borderColor: color }]}>
        <View style={[styles.dpadBarHorizontal, { backgroundColor: color }]} />
        <View style={[styles.dpadBarVertical, { backgroundColor: color }]} />
      </View>
      <View style={[styles.gameButton, { backgroundColor: color }]} />
      <View style={[styles.gameButton, { backgroundColor: color }]} />
    </View>
  );
}

function BackpackIcon({ active }) {
  const color = active ? "#fff" : "rgba(255, 255, 255, 0.62)";
  return (
    <View style={styles.backpackWrap}>
      <View style={[styles.backpackHandle, { borderColor: color }]} />
      <View style={[styles.backpack, { borderColor: color }]}>
        <View style={[styles.backpackFlap, { borderColor: color }]} />
        <View style={[styles.backpackPocket, { borderColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 9,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  indicator: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 3,
    marginLeft: 0,
    position: "absolute",
    top: 0,
    width: 44,
  },
  item: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    paddingHorizontal: 20,
  },
  gamepad: {
    alignItems: "center",
    borderRadius: 7,
    borderWidth: 2,
    flexDirection: "row",
    height: 19,
    justifyContent: "space-between",
    paddingHorizontal: 4,
    width: 31,
  },
  dpad: { height: 10, position: "relative", width: 10 },
  dpadBarHorizontal: {
    height: 3,
    left: 0,
    position: "absolute",
    top: 4,
    width: 10,
  },
  dpadBarVertical: {
    height: 10,
    left: 4,
    position: "absolute",
    top: 0,
    width: 3,
  },
  gameButton: { borderRadius: 4, height: 5, width: 5 },
  backpackWrap: { height: 24, position: "relative", width: 25 },
  backpack: {
    borderRadius: 5,
    borderWidth: 2,
    bottom: 0,
    height: 20,
    left: 1,
    position: "absolute",
    width: 23,
  },
  backpackHandle: {
    borderBottomWidth: 0,
    borderRadius: 5,
    borderWidth: 2,
    height: 7,
    left: 7,
    position: "absolute",
    top: 0,
    width: 11,
  },
  backpackFlap: {
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    height: 5,
    left: 2,
    position: "absolute",
    top: 4,
    width: 15,
  },
  backpackPocket: {
    borderRadius: 3,
    borderWidth: 1.5,
    bottom: 3,
    height: 6,
    left: 5,
    position: "absolute",
    width: 10,
  },
  label: { color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 3 },
  activeText: { color: colors.primary },
});
