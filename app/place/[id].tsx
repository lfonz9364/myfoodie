import ThemedButton from "@/components/ui/atoms/ThemedButton";
import ThemedCard from "@/components/ui/atoms/ThemedCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const PlaceMapScreen = () => {
  const router = useRouter();
  const { colors } = useAppTheme();

  const params = useLocalSearchParams<{
    id: string;
    name: string;
    lat: string;
    lon: string;
    userLat: string;
    userLon: string;
    walkMins?: string;
    prepMins?: string;
    queueMins?: string;
    addressLabel?: string;
  }>();

  const placeLat = Number(params.lat);
  const placeLon = Number(params.lon);
  const userLat = Number(params.userLat);
  const userLon = Number(params.userLon);

  const latitudeDelta = Math.max(Math.abs(userLat - placeLat) * 2, 0.01);
  const longitudeDelta = Math.max(Math.abs(userLon - placeLon) * 2, 0.01);

  const totalTime =
    Number(params.walkMins ?? 0) +
    Number(params.prepMins ?? 0) +
    Number(params.queueMins ?? 0);

  const openDirections = () => {
    const origin = `${userLat},${userLon}`;
    const destination = `${placeLat},${placeLon}`;

    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <Stack.Screen options={{ title: params.name || "Directions" }} />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (userLat + placeLat) / 2,
          longitude: (userLon + placeLon) / 2,
          latitudeDelta,
          longitudeDelta,
        }}
      >
        <Marker
          coordinate={{ latitude: userLat, longitude: userLon }}
          title={params.addressLabel ? "Search location" : "Your location"}
          description={
            params.addressLabel
              ? String(params.addressLabel)
              : "Your current location"
          }
          pinColor={colors.success} // 🟢 GREEN START
        />
        <Marker
          coordinate={{ latitude: placeLat, longitude: placeLon }}
          title={params.name || "Destination"}
          pinColor={colors.error} // 🔴 RED DESTINATION
        />
      </MapView>

      <ThemedCard
        style={[
          styles.sheetCard,
          {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        ]}
      >
        <View style={styles.topActionsRow}>
          <ThemedButton label="Back to results" onPress={() => router.back()} />
          <ThemedButton
            label="Search new"
            onPress={() => router.replace("/")}
          />
        </View>

        <Text style={[styles.placeName, { color: colors.text }]}>
          {params.name}
        </Text>

        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          Walk ~ {params.walkMins ?? "?"} min • Total lunch time ~ {totalTime}{" "}
          min
        </Text>

        <Text style={[styles.helper, { color: colors.textMuted }]}>
          This screen is your in-app preview. Tap below for full turn-by-turn
          navigation.
        </Text>

        <ThemedButton
          label="Open turn-by-turn directions"
          variant="primary"
          onPress={openDirections}
        />
      </ThemedCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  sheetCard: {
    marginTop: -8,
    paddingTop: 20,
  },
  topActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  placeName: {
    fontSize: 22,
    fontWeight: "800",
  },
  meta: {
    fontSize: 14,
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default PlaceMapScreen;
