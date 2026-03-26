import ThemedButton from "@/components/ui/atoms/ThemedButton";
import ThemedCard from "@/components/ui/atoms/ThemedCard";
import AddressAutocomplete from "@/components/ui/molecules/AddressAutocomplete";
import Controls from "@/components/ui/molecules/Controls";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AddressSuggestion } from "@/lib/addressAutocomplete";
import { getCurrentLocation } from "@/lib/places";
import { Mood, PriceBand } from "@/lib/types";
import { Stack, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [addressInput, setAddressInput] = useState("");
  const [selectedAddress, setSelectedAddress] =
    useState<AddressSuggestion | null>(null);
  const [submitError, setSubmitError] = useState("");

  const [timeBudget, setTimeBudget] = useState<number | null>(20);
  const [price, setPrice] = useState<PriceBand | null>(2);
  const [mood, setMood] = useState<Mood | null>("comfort");
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
    return selectedAddress
      ? { lat: selectedAddress.lat, lng: selectedAddress.lng }
      : coordinate;
  }, [selectedAddress, coordinate]);

  const validateForm = () => {
    if (!selectedCoordinate) {
      return "Please allow location access or choose an address first.";
    }

    if (timeBudget == null) {
      return "Please choose a time budget.";
    }

    if (price == null) {
      return "Please choose a budget.";
    }

    if (mood == null) {
      return "Please choose a mood.";
    }

    return "";
  };

  const onButtonPress = () => {
    const error = validateForm();
    setSubmitError(error);

    if (error) {
      return;
    }

    router.push({
      pathname: "/results",
      params: {
        lat: selectedCoordinate!.lat,
        lng: selectedCoordinate!.lng,
        timeBudget: timeBudget!,
        price: price!,
        mood: mood!,
        dietary: dietary.join(","),
        addressLabel: selectedAddress?.label ?? "",
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <Stack.Screen options={{ title: "MyFoodie" }} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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
                : "Current location unavailable. Choose an address instead."}
            </Text>
          )}
        </ThemedCard>

        <ThemedCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Search by address
          </Text>

          <AddressAutocomplete
            value={addressInput}
            onChangeText={(value) => {
              setAddressInput(value);
              setSelectedAddress(null);
              setSubmitError("");
            }}
            onSelect={(suggestion) => {
              setAddressInput(suggestion.label);
              setSelectedAddress(suggestion);
              setSubmitError("");
            }}
          />

          <Text style={[styles.helperText, { color: colors.textMuted }]}>
            Search near your office, home, or meeting location.
          </Text>

          {selectedAddress ? (
            <Text style={[styles.selectedText, { color: colors.success }]}>
              Selected: {selectedAddress.label}
            </Text>
          ) : null}
        </ThemedCard>

        <Controls
          timeBudget={timeBudget ?? 0}
          setTimeBudget={(value) => {
            setTimeBudget(value);
            setSubmitError("");
          }}
          price={(price ?? 2) as PriceBand}
          setPrice={(value) => {
            setPrice(value);
            setSubmitError("");
          }}
          mood={(mood ?? "comfort") as Mood}
          setMood={(value) => {
            setMood(value);
            setSubmitError("");
          }}
          dietary={dietary}
          setDietary={setDietary}
        />

        <Text style={[styles.requiredHint, { color: colors.textMuted }]}>
          Time budget, budget, mood, and location are required. Dietary is
          optional.
        </Text>

        {submitError ? (
          <Text style={[styles.submitError, { color: colors.error }]}>
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
  helperText: {
    fontSize: 13,
    lineHeight: 18,
  },
  selectedText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  requiredHint: {
    fontSize: 12,
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
