import Controls from "@/components/ui/molecules/Controls";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getCurrentLocation } from "@/lib/places";
import { Mood, PriceBand } from "@/lib/types";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FALLBACK_COORDINATE = {
  lat: -37.8187,
  lng: 144.9469,
};

const Home = () => {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [timeBudget, setTimeBudget] = useState(20);
  const [price, setPrice] = useState<PriceBand>(2);
  const [mood, setMood] = useState<Mood>("comfort");
  const [dietary, setDietary] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingLocation(true);
      const loc = await getCurrentLocation(setLoadingLocation);

      if (loc) {
        setCoordinate(loc);
      }
    };

    fetchLocation();
  }, []);

  const onButtonPress = () => {
    router.push({
      pathname: "/results",
      params: {
        lat: coordinate?.lat ?? FALLBACK_COORDINATE.lat,
        lng: coordinate?.lng ?? FALLBACK_COORDINATE.lng,
        timeBudget,
        price,
        mood,
        dietary: dietary.join(","),
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <Stack.Screen options={{ title: "MyFoodie" }} />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[styles.heroCard, { backgroundColor: colors.darkSurface }]}
        >
          <Text style={[styles.eyebrow, { color: colors.accent }]}>
            MYFOODIE
          </Text>
          <Text style={[styles.title, { color: colors.darkSurfaceText }]}>
            What fits your lunch break today?
          </Text>
          <Text
            style={[styles.subtitle, { color: colors.darkSurfaceMutedText }]}
          >
            Pick your vibe, budget, and time limit. We&apos;ll rank nearby spots
            that make sense for right now.
          </Text>
        </View>

        <View
          style={[
            styles.locationCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.locationTitle, { color: colors.text }]}>
            Your location
          </Text>

          {loadingLocation && !coordinate ? (
            <View style={styles.locationRow}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text
                style={[styles.locationText, { color: colors.textSecondary }]}
              >
                Finding you…
              </Text>
            </View>
          ) : (
            <Text
              style={[styles.locationText, { color: colors.textSecondary }]}
            >
              {coordinate
                ? "Location ready ✓"
                : "Using Melbourne CBD fallback for now"}
            </Text>
          )}
        </View>

        <Controls
          timeBudget={timeBudget}
          setTimeBudget={setTimeBudget}
          price={price}
          setPrice={setPrice}
          mood={mood}
          setMood={setMood}
          dietary={dietary}
          setDietary={setDietary}
        />

        <Pressable
          style={[styles.ctaButton, { backgroundColor: colors.primary }]}
          onPress={onButtonPress}
        >
          <Text style={[styles.ctaText, { color: colors.darkSurfaceText }]}>
            Find my lunch
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  locationCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locationText: {
    fontSize: 14,
  },
  ctaButton: {
    borderRadius: 18,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "800",
  },
});

export default Home;
