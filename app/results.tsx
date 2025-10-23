import { fetchNearbyOverpass } from "@/lib/overpass";
import { scorePlace } from "@/lib/score";
import { Mood, Place, PriceBand } from "@/lib/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Results = () => {
  const { lat, lng, timeBudget, price, mood, dietary } = useLocalSearchParams();

  const [places, setPlaces] = useState<Place[] | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      const places = await fetchNearbyOverpass({
        lat: Number(lat),
        lon: Number(lng),
      });
      setPlaces(places);
    };

    fetchPlaces();
  }, [lat, lng]);

  const ranked = useMemo(() => {
    if (!places) return [];
    const prefs = {
      timeBudget: Number(timeBudget) || 20,
      price: (+price as PriceBand) || 2,
      mood: (mood as Mood) || "comfort",
      dietary: dietary ? (dietary as string).split(",") : [],
    };
    return places
      .map((p: Place) => ({
        ...p,
        score: scorePlace(p, prefs),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10
  }, [places, timeBudget, price, mood, dietary]);

  if (!places) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <Stack.Screen options={{ title: "Bussin'" }} />
      <FlatList
        data={ranked}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.placeWrapper}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.tags?.slice(0, 3).join(" • ")}</Text>
            <Text>
              Walk ~ {item.walkMins} mins • Prep ~ {item.avgPrepMins}m • Queue ~{" "}
              {item.queueMinsGuess}m
            </Text>
            <View style={styles.buttonsGroup}>
              <Button
                title="Directions"
                onPress={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`;
                  Linking.openURL(url);
                }}
              />
              {item.phone && (
                <Button
                  title="Call"
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}
                />
              )}
              {item.orderUrl && (
                <Button
                  title="Order"
                  onPress={() => Linking.openURL(item.orderUrl!)}
                />
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeWrapper: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});

export default Results;
