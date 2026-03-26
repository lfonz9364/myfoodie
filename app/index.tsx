import ThemedButton from "@/components/ui/atoms/ThemedButton";
import ThemedCard from "@/components/ui/atoms/ThemedCard";
import Controls from "@/components/ui/molecules/Controls";
import { useAppTheme } from "@/hooks/useAppTheme";
import { geocodeAddress, getCurrentLocation } from "@/lib/places";
import { Mood, PriceBand } from "@/lib/types";
import { Stack, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [address, setAddress] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [addressError, setAddressError] = useState("");
  const [submitError, setSubmitError] = useState("");

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

  const selectedCoordinate = useMemo(() => {
    return resolvedAddress ?? coordinate ?? null;
  }, [resolvedAddress, coordinate]);

  const handleUseAddress = async () => {
    setAddressError("");
    setResolvedAddress(null);

    if (!address.trim()) {
      setAddressError("Please enter an address.");
      return;
    }

    setLoadingAddress(true);

    const result = await geocodeAddress(address);

    setLoadingAddress(false);

    if (!result) {
      setAddressError(
        "Could not find that address. Try a more specific address.",
      );
      return;
    }

    setResolvedAddress(result);
  };

  const onButtonPress = () => {
    setSubmitError("");

    if (!selectedCoordinate) {
      setSubmitError("Please allow location access or enter an address first.");
      return;
    }

    router.push({
      pathname: "/results",
      params: {
        lat: selectedCoordinate.lat,
        lng: selectedCoordinate.lng,
        timeBudget,
        price,
        mood,
        dietary: dietary.join(","),
        addressLabel: address.trim() || "",
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
            Pick your vibe, budget, time limit, and location.
          </Text>
        </View>

        <ThemedCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Current location
          </Text>

          {loadingLocation && !coordinate ? (
            <View style={styles.locationRow}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text
                style={[styles.locationText, { color: colors.textSecondary }]}
              >
                Finding your current location…
              </Text>
            </View>
          ) : (
            <Text
              style={[styles.locationText, { color: colors.textSecondary }]}
            >
              {coordinate
                ? "Current location ready ✓"
                : "Current location unavailable. Enter an address instead."}
            </Text>
          )}
        </ThemedCard>

        <ThemedCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Or enter an address
          </Text>

          <TextInput
            value={address}
            onChangeText={(value) => {
              setAddress(value);
              setAddressError("");
              setSubmitError("");
              setResolvedAddress(null);
            }}
            placeholder="e.g. 120 Spencer Street, Melbourne"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.borderStrong,
              },
            ]}
          />

          {addressError ? (
            <Text style={[styles.helperText, { color: colors.primaryText }]}>
              {addressError}
            </Text>
          ) : resolvedAddress ? (
            <Text style={[styles.helperText, { color: colors.success }]}>
              Address found ✓
            </Text>
          ) : (
            <Text style={[styles.helperText, { color: colors.textMuted }]}>
              Search near your office, home, or meeting location.
            </Text>
          )}

          <ThemedButton
            label={loadingAddress ? "Checking address..." : "Use typed address"}
            onPress={handleUseAddress}
            disabled={loadingAddress}
          />
        </ThemedCard>

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

        {submitError ? (
          <Text style={[styles.submitError, { color: colors.primaryText }]}>
            {submitError}
          </Text>
        ) : null}

        <ThemedButton
          label="Find my lunch"
          variant="primary"
          onPress={onButtonPress}
          style={styles.ctaButton}
        />
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
    paddingBottom: 24,
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
  sectionTitle: {
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
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
  },
  submitError: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  ctaButton: {
    minHeight: 56,
    borderRadius: 18,
    marginTop: 4,
  },
});

export default Home;
