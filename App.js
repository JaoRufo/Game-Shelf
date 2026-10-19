import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import ExploreScreen from "./src/screens/ExploreScreen";
import GameDetailsScreen from "./src/screens/GameDetailsScreen";
import LibraryScreen from "./src/screens/LibraryScreen";
import {
  addToLibrary,
  removeFromLibrary,
  updateLibraryStatus,
} from "./src/utils/libraryHelpers";
import { colors } from "./src/styles/theme";

const Stack = createNativeStackNavigator();
const STORAGE_KEY = "@gameshelf/library";

export default function App() {
  const [library, setLibrary] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!mounted) return;
        try {
          const parsed = stored ? JSON.parse(stored) : [];
          setLibrary(Array.isArray(parsed) ? parsed : []);
        } catch {
          setLibrary([]);
        }
        setStorageReady(true);
      })
      .catch(() => {
        if (mounted) setStorageReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (storageReady)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(library)).catch(
        () => {},
      );
  }, [library, storageReady]);
  const addGame = (game) =>
    setLibrary((current) => addToLibrary(current, game));
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Explore"
          component={ExploreScreen}
          options={({ navigation }) => ({
            title: "Explorar",
            headerRight: () => (
              <TextButton
                label="Biblioteca"
                onPress={() => navigation.navigate("Library")}
              />
            ),
          })}
        />
        <Stack.Screen name="GameDetails" options={{ title: "Detalhes" }}>
          {(props) => (
            <GameDetailsScreen
              {...props}
              route={{
                ...props.route,
                params: {
                  ...props.route.params,
                  library,
                  onAdd: addGame,
                  onStatusChange: (id, status) =>
                    setLibrary((current) =>
                      updateLibraryStatus(current, id, status),
                    ),
                  onRemove: (id) =>
                    setLibrary((current) => removeFromLibrary(current, id)),
                },
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Library" options={{ title: "Minha biblioteca" }}>
          {(props) => (
            <LibraryScreen
              {...props}
              library={library}
              onStatusChange={(id, status) =>
                setLibrary((current) =>
                  updateLibraryStatus(current, id, status),
                )
              }
              onRemove={(id) =>
                setLibrary((current) => removeFromLibrary(current, id))
              }
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TextButton({ label, onPress }) {
  return (
    <Text
      onPress={onPress}
      style={{ color: colors.primary, fontWeight: "700", marginRight: 14 }}
    >
      {label}
    </Text>
  );
}
