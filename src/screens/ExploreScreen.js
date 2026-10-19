import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GameCard from "../components/GameCard";
import SearchBar from "../components/SearchBar";
import PrimaryButton from "../components/PrimaryButton";
import LoadingIndicator from "../components/LoadingIndicator";
import localGames from "../data/games.json";
import { fetchGames } from "../services/freeToGameApi";
import { colors, commonStyles } from "../styles/theme";

const PAGE_SIZE = 10;

export default function ExploreScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const loadCatalog = async () => {
      setLoading(true);
      setError("");
      setUsingFallback(false);
      setPage(1);
      try {
        const remoteGames = await fetchGames(controller.signal);
        if (!remoteGames.length) throw new Error("Catálogo remoto vazio");
        if (mounted) setGames(remoteGames);
      } catch (requestError) {
        if (requestError?.name === "AbortError") return;
        if (Array.isArray(localGames) && localGames.length > 0) {
          if (mounted) {
            setGames(localGames);
            setUsingFallback(true);
          }
        } else if (mounted) {
          setGames([]);
          setError(
            "Não foi possível carregar o catálogo remoto nem os dados locais.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadCatalog();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [reloadToken]);

  const genres = useMemo(
    () => [
      "Todos",
      ...new Set(games.map((game) => game.genre).filter(Boolean)),
    ],
    [games],
  );
  const filteredGames = useMemo(
    () =>
      games.filter((game) => {
        const matchesQuery = (game.title || "")
          .toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesGenre = genre === "Todos" || game.genre === genre;
        return matchesQuery && matchesGenre;
      }),
    [games, genre, query],
  );
  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedGames = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGames.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredGames]);
  const changePage = useCallback(
    (nextPage) => {
      if (nextPage >= 1 && nextPage <= totalPages && nextPage !== currentPage)
        setPage(nextPage);
    },
    [currentPage, totalPages],
  );
  const openDetails = useCallback(
    (game) => navigation.navigate("GameDetails", { game }),
    [navigation],
  );

  return (
    <SafeAreaView style={commonStyles.screen}>
      <FlatList
        data={paginatedGames}
        extraData={currentPage}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <GameCard game={item} onPress={() => openDetails(item)} />
        )}
        contentContainerStyle={commonStyles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <Text style={commonStyles.title}>GameShelf</Text>
            <Text style={commonStyles.subtitle}>
              Descubra, organize e acompanhe seus próximos jogos.
            </Text>
            <SearchBar
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                setPage(1);
              }}
            />
            {usingFallback ? (
              <View style={styles.notice}>
                <Text style={styles.noticeText}>
                  Modo offline: exibindo uma cópia local do catálogo.
                </Text>
                <Pressable onPress={() => setReloadToken((value) => value + 1)}>
                  <Text style={styles.retryLink}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : null}
            <Text style={styles.filterLabel}>Gênero</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={genres}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setGenre(item);
                    setPage(1);
                  }}
                  style={[styles.chip, genre === item && styles.selectedChip]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      genre === item && styles.selectedChipText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
            <Text style={styles.resultLabel}>
              {filteredGames.length} jogo(s) encontrado(s)
            </Text>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <LoadingIndicator />
          ) : (
            <View style={styles.center}>
              <Text style={commonStyles.message}>
                {error ||
                  (games.length
                    ? "Nenhum jogo corresponde à busca."
                    : "Catálogo vazio.")}
              </Text>
              <PrimaryButton
                label="Tentar novamente"
                onPress={() => {
                  setPage(1);
                  setReloadToken((value) => value + 1);
                }}
              />
            </View>
          )
        }
        ListFooterComponent={
          !loading && paginatedGames.length > 0 ? (
            <View style={styles.pagination}>
              <Pressable
                disabled={currentPage === 1}
                onPress={() => changePage(currentPage - 1)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.pageButton,
                  currentPage === 1 && styles.disabledPageButton,
                  pressed && currentPage !== 1 && styles.pressedPageButton,
                ]}
              >
                <Text style={styles.pageButtonText}>Anterior</Text>
              </Pressable>
              <Text style={styles.pageText}>
                Página {currentPage} de {totalPages}
              </Text>
              <Pressable
                disabled={currentPage === totalPages}
                onPress={() => changePage(currentPage + 1)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.pageButton,
                  currentPage === totalPages && styles.disabledPageButton,
                  pressed &&
                    currentPage !== totalPages &&
                    styles.pressedPageButton,
                ]}
              >
                <Text style={styles.pageButtonText}>Próxima</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { color: colors.muted, fontSize: 13 },
  selectedChipText: { color: "#fff", fontWeight: "700" },
  resultLabel: { color: colors.muted, fontSize: 12, marginVertical: 18 },
  notice: {
    backgroundColor: "#292044",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  noticeText: { color: "#d9cdfd", flex: 1, fontSize: 12 },
  retryLink: { color: "#c5aafa", fontWeight: "700", fontSize: 12 },
  center: { alignItems: "center", paddingVertical: 20 },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 8,
  },
  pageButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 88,
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  disabledPageButton: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.55,
  },
  pressedPageButton: { opacity: 0.78, transform: [{ scale: 0.97 }] },
  pageButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  pageText: { color: colors.muted, fontSize: 13 },
});
