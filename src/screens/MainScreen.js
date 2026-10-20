import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  AppState,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import ExploreScreen from "./ExploreScreen";
import LibraryScreen from "./LibraryScreen";

export default function MainScreen({
  navigation,
  library,
  onNotesChange,
  onStatusChange,
  onRemove,
}) {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("home");
  const [homeAnimationKey, setHomeAnimationKey] = useState(0);
  const [libraryAnimationKey, setLibraryAnimationKey] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        if (activeTab === "home") setHomeAnimationKey((current) => current + 1);
        if (activeTab === "library") setLibraryAnimationKey((current) => current + 1);
      }
    });
    return () => subscription.remove();
  }, [activeTab]);

  const changeTab = (screen) => {
    const nextTab = screen === "Library" ? "library" : "home";
    if (nextTab === activeTab) return;
    setActiveTab(nextTab);
    if (nextTab === "home") setHomeAnimationKey((current) => current + 1);
    if (nextTab === "library") setLibraryAnimationKey((current) => current + 1);
    Animated.timing(slide, {
      toValue: nextTab === "library" ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pages,
          {
            width: width * 2,
            transform: [
              {
                translateX: slide.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -width],
                }),
              },
            ],
          },
        ]}
      >
        <View style={{ width }}>
          <ExploreScreen
            navigation={navigation}
            hideBottomNavigation
            animationTrigger={homeAnimationKey}
          />
        </View>
        <View style={{ width }}>
          <LibraryScreen
            navigation={navigation}
            library={library}
            onNotesChange={onNotesChange}
            onStatusChange={onStatusChange}
            onRemove={onRemove}
            hideBottomNavigation
            onMainNavigate={changeTab}
            animationTrigger={libraryAnimationKey}
          />
        </View>
      </Animated.View>
      <BottomNavigation active={activeTab} onNavigate={changeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#0d1020", flex: 1, overflow: "hidden" },
  pages: { flex: 1, flexDirection: "row" },
});
