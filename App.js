import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainScreen from "./src/screens/MainScreen";
import GameDetailsScreen from "./src/screens/GameDetailsScreen";
import LibraryScreen from "./src/screens/LibraryScreen";
import {
  addToLibrary,
  removeFromLibrary,
  updateLibraryNotes,
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
  const addGame = (game, status, notes) =>
    setLibrary((current) => addToLibrary(current, game, status, notes));
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack.Navigator
        screenOptions={{
          animation: "slide_from_right",
          headerShown: false,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
        >
        <Stack.Screen name="Main" options={{ headerShown: false, header: () => null, headerLargeTitle: false }}>
          {(props) => (
            <MainScreen
              {...props}
              library={library}
              onNotesChange={(id, notes) =>
                setLibrary((current) => updateLibraryNotes(current, id, notes))
              }
              onStatusChange={(id, status) =>
                setLibrary((current) => updateLibraryStatus(current, id, status))
              }
              onRemove={(id) => setLibrary((current) => removeFromLibrary(current, id))}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="GameDetails" options={{ title: "Detalhes", headerShown: true }}>
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
                  onNotesChange: (id, notes) =>
                    setLibrary((current) => updateLibraryNotes(current, id, notes)),
                },
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Library" options={{ title: "Meu inventário" }}>
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
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

