import ThemedButton from "@/components/ui/atoms/ThemedButton";
import ThemedCard from "@/components/ui/atoms/ThemedCard";
import OfflineNotice from "@/components/ui/molecules/OfflineNotice";
import { useAppTheme } from "@/hooks/useAppTheme";
import { fetchNearbyOverpass } from "@/lib/overpass";
import {
  getCachedRestaurants,
  saveCachedRestaurants,
} from "@/lib/restaurantCache";
import { scorePlace } from "@/lib/score";
import { Mood, Place, PriceBand } from "@/lib/types";
import NetInfo from "@react-native-community/netinfo";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RankedPlace = Place & { score: number };

const formatScoreReason = (item: RankedPlace, timeBudget: number) => {
  const totalMinutes =
    (item.walkMins ?? 0) + (item.avgPrepMins ?? 0) + (item.queueMinsGuess ?? 0);

  if (totalMinutes <= timeBudget) {
    return `Fits your ${timeBudget}-minute lunch window`;
  }

  if ((item.walkMins ?? 0) <= 8) {
    return "Great nearby option with a short walk";
  }

  return "Strong overall match for your filters";
};

const Results = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { lat, lng, timeBudget, price, mood, dietary, addressLabel } =
    useLocalSearchParams();

  const [places, setPlaces] = useState<Place[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [usedCachedData, setUsedCachedData] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !(
        state.isConnected && state.isInternetReachable !== false
      );
      setIsOffline(offline);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      setLoadError("");
      setUsedCachedData(false);

      try {
        const netState = await NetInfo.fetch();
        const offline = !(
          netState.isConnected && netState.isInternetReachable !== false
        );

        setIsOffline(offline);

        if (offline) {
          const cached = await getCachedRestaurants();

          if (cached?.length) {
            setPlaces(cached);
            setUsedCachedData(true);
            setIsLoading(false);
            return;
          }

          setPlaces([]);
          setLoadError(
            "You’re offline and no cached restaurant list is available yet.",
          );
          setIsLoading(false);
          return;
        }

        const nearby = await fetchNearbyOverpass({
          lat: Number(lat),
          lon: Number(lng),
        });

        setPlaces(nearby);
        await saveCachedRestaurants(nearby);
      } catch (e) {
        if (e) {
          const cached = await getCachedRestaurants();

          {
            if (cached?.length) {
              setPlaces(cached);
              setUsedCachedData(true);
              setLoadError(
                "Live results could not be loaded, so the latest saved list is shown.",
              );
            } else {
              setPlaces([]);
              setLoadError("Could not load restaurants right now.");
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [lat, lng]);

  const ranked = useMemo<RankedPlace[]>(() => {
    if (!places) return [];

    const prefs = {
      timeBudget: Number(timeBudget) || 20,
      price: (+price as PriceBand) || 2,
      mood: (mood as Mood) || "comfort",
      dietary: dietary ? String(dietary).split(",").filter(Boolean) : [],
    };

    return places
      .map((place) => ({
        ...place,
        score: scorePlace(place, prefs),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [places, timeBudget, price, mood, dietary]);

  const selectedTimeBudget = Number(timeBudget) || 20;

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
        edges={["top", "left", "right"]}
      >
        <Stack.Screen options={{ title: "Finding spots" }} />
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Ranking nearby lunch options…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <Stack.Screen options={{ title: "Your lunch picks" }} />

      <FlatList
        data={ranked}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <OfflineNotice
              visible={isOffline || usedCachedData || !!loadError}
              message={
                isOffline && usedCachedData
                  ? "No internet connection. Showing your latest saved restaurant list."
                  : isOffline
                    ? "No internet connection."
                    : loadError || ""
              }
            />

            <View style={styles.topActionsRow}>
              <ThemedButton
                label="Search new"
                onPress={() => router.replace("/")}
              />
            </View>

            <View
              style={[
                styles.headerCard,
                { backgroundColor: colors.darkSurface },
              ]}
            >
              <Text
                style={[styles.headerTitle, { color: colors.darkSurfaceText }]}
              >
                Best nearby matches
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.darkSurfaceMutedText },
                ]}
              >
                Ranked by time fit, distance, mood, price, and dietary match.
              </Text>

              {addressLabel ? (
                <Text
                  style={[
                    styles.headerMeta,
                    { color: colors.darkSurfaceMutedText },
                  ]}
                >
                  Searching near {String(addressLabel)}
                </Text>
              ) : null}
            </View>

            {!ranked.length ? (
              <ThemedCard>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No restaurants available
                </Text>
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  {isOffline
                    ? "Connect to the internet at least once to save a restaurant list for offline use."
                    : "Try a different address or search again."}
                </Text>
              </ThemedCard>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => {
          const totalMinutes =
            (item.walkMins ?? 0) +
            (item.avgPrepMins ?? 0) +
            (item.queueMinsGuess ?? 0);

          return (
            <ThemedCard highlighted={index === 0} style={styles.resultCard}>
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.rankBadge,
                    { backgroundColor: colors.primarySoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.rankBadgeText,
                      { color: colors.primaryText },
                    ]}
                  >
                    #{index + 1}
                  </Text>
                </View>
                <Text style={[styles.scoreText, { color: colors.textMuted }]}>
                  Match score {item.score.toFixed(1)}
                </Text>
              </View>

              <Text style={[styles.title, { color: colors.text }]}>
                {item.name}
              </Text>

              {!!item.tags?.length && (
                <View style={styles.tagsRow}>
                  {item.tags.slice(0, 4).map((tag) => (
                    <View
                      key={`${item.id}-${tag}`}
                      style={[
                        styles.tagChip,
                        { backgroundColor: colors.surfaceMuted },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={[styles.whyText, { color: colors.textSecondary }]}>
                {formatScoreReason(item, selectedTimeBudget)}
              </Text>

              <View style={styles.metricsRow}>
                {[
                  ["Walk", `${item.walkMins ?? "?"} min`],
                  ["Prep", `${item.avgPrepMins ?? "?"} min`],
                  ["Queue", `${item.queueMinsGuess ?? "?"} min`],
                  ["Total", `${totalMinutes} min`],
                ].map(([label, value]) => (
                  <View
                    key={`${item.id}-${label}`}
                    style={[
                      styles.metricCard,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.metricLabel, { color: colors.textMuted }]}
                    >
                      {label}
                    </Text>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionsRow}>
                <ThemedButton
                  label="View map"
                  variant="primary"
                  onPress={() =>
                    router.push({
                      pathname: "/place/[id]",
                      params: {
                        id: item.id,
                        name: item.name,
                        lat: String(item.lat),
                        lon: String(item.lon),
                        userLat: String(lat),
                        userLon: String(lng),
                        walkMins: String(item.walkMins ?? 0),
                        prepMins: String(item.avgPrepMins ?? 0),
                        queueMins: String(item.queueMinsGuess ?? 0),
                      },
                    })
                  }
                />

                {item.phone ? (
                  <ThemedButton
                    label="Call"
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                  />
                ) : null}

                {item.orderUrl ? (
                  <ThemedButton
                    label="Order"
                    onPress={() => Linking.openURL(item.orderUrl ?? "")}
                  />
                ) : null}
              </View>
            </ThemedCard>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  headerWrap: {
    marginBottom: 16,
    gap: 12,
  },
  topActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerCard: {
    borderRadius: 24,
    padding: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  headerMeta: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultCard: {
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  whyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: "22%",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "800",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
});

export default Results;
