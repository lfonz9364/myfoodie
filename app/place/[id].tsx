import { useAppTheme } from "@/hooks/useAppTheme";
import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
          title="You"
          description="Your current location"
        />
        <Marker
          coordinate={{ latitude: placeLat, longitude: placeLon }}
          title={params.name || "Destination"}
        />
      </MapView>

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.topActionsRow}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.quickButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderStrong,
              },
            ]}
          >
            <Text style={[styles.quickButtonText, { color: colors.text }]}>
              Back to results
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/")}
            style={[
              styles.quickButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderStrong,
              },
            ]}
          >
            <Text style={[styles.quickButtonText, { color: colors.text }]}>
              Search new
            </Text>
          </Pressable>
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

        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLon}`,
            )
          }
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: colors.darkSurfaceText },
            ]}
          >
            Open turn-by-turn directions
          </Text>
        </Pressable>
      </View>
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
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    gap: 10,
  },
  topActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  quickButton: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: "700",
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
  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
  },
});

export default PlaceMapScreen;
