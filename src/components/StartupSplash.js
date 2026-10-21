import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function StartupSplash() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.9)).current;
  const loadingPulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.34,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(glowScale, {
        toValue: 1.04,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingPulse, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(loadingPulse, {
            toValue: 0.35,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();

    return () => {
      logoOpacity.stopAnimation();
      logoScale.stopAnimation();
      glowOpacity.stopAnimation();
      glowScale.stopAnimation();
      loadingPulse.stopAnimation();
    };
  }, [glowOpacity, glowScale, loadingPulse, logoOpacity, logoScale]);

  return (
    <View style={styles.container}>
      <View style={styles.logoStage}>
        <Animated.Image
          source={require("../../assets/logo-game-shelf-transparent.png")}
          resizeMode="contain"
          style={[
            styles.logo,
            styles.glow,
            { opacity: glowOpacity, transform: [{ scale: glowScale }] },
          ]}
        />
        <Animated.Image
          source={require("../../assets/logo-game-shelf-transparent.png")}
          resizeMode="contain"
          style={[
            styles.logo,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        />
      </View>
      <Animated.View style={[styles.loading, { opacity: loadingPulse }]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
      <Text style={styles.caption}>Carregando seu inventário...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
  logoStage: { height: 200, position: "relative", width: 300 },
  logo: { height: 200, position: "absolute", width: 300 },
  glow: { tintColor: colors.primary },
  loading: { flexDirection: "row", gap: 7, marginTop: 26 },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  caption: { color: colors.muted, fontSize: 13, marginTop: 12 },
});
