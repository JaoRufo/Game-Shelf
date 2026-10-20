import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
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
        accessibilityLabel="Ir para Inventário"
        style={styles.item}
        onPress={() => handleNavigate("Library")}
      >
        <BackpackIcon active={active === "library"} />
        <Text style={[styles.label, active === "library" && styles.activeText]}>
          Inventário
        </Text>
      </Pressable>
    </View>
  );
}

function GamepadIcon({ active }) {
  return <Image source={require("../../assets/controle-de-video-game.png")} style={[styles.assetIcon, styles.gamepadAssetIcon, !active && styles.inactiveIcon]} resizeMode="contain" />;
}

function BackpackIcon({ active }) {
  return <Image source={require("../../assets/loot-box.png")} style={[styles.assetIcon, styles.lootAssetIcon, !active && styles.inactiveIcon]} resizeMode="contain" />;
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
  assetIcon: { height: 26, tintColor: "#fff", width: 26 },
  gamepadAssetIcon: { height: 32, width: 32 },
  lootAssetIcon: { height: 28, width: 28 },
  inactiveIcon: { opacity: 0.62 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 3 },
  activeText: { color: colors.primary },
});
