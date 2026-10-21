import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors, commonStyles } from "../styles/theme";

export default function AnimatedBrandTitle({
  children,
  animationTrigger = 0,
  containerStyle,
}) {
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const shineAnimation = useRef(new Animated.Value(-220)).current;

  useEffect(() => {
    titleAnimation.setValue(0);
    shineAnimation.setValue(-220);
    Animated.parallel([
      Animated.timing(titleAnimation, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(450),
        Animated.timing(shineAnimation, {
          toValue: 420,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    return () => {
      titleAnimation.stopAnimation();
      shineAnimation.stopAnimation();
    };
  }, [animationTrigger, shineAnimation, titleAnimation]);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Animated.Text
        style={[
          commonStyles.title,
          styles.title,
          {
            opacity: titleAnimation,
            transform: [
              {
                scale: titleAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.86, 1],
                }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.Text>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shine,
          { transform: [{ translateX: shineAnimation }, { skewX: "-18deg" }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    alignSelf: "center",
    marginTop: 14,
    overflow: "hidden",
  },
  title: {
    color: colors.primary,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: 0.5,
    textAlign: "center",
    textShadowColor: "rgba(139, 92, 246, 0.42)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  shine: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    height: 52,
    position: "absolute",
    top: -2,
    width: 18,
  },
});
