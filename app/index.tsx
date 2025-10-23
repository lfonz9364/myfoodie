import Control from "@/components/ui/molecules/Controls";
import { getCurrentLocation } from "@/lib/places";
import { Mood, PriceBand } from "@/lib/types";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Home = () => {
  const router = useRouter();
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

  const onButtonPress = async () => {
    router.push({
      pathname: "/results",
      params: {
        lat: coordinate?.lat ?? -37.8187,
        lng: coordinate?.lng ?? 144.9469,
        timeBudget,
        price,
        mood,
        dietary: dietary.join(","),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "My Foodie" }} />
      <Text style={styles.title}>Get a grub nearby</Text>
      {loadingLocation && !coordinate ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>Location ready ✓</Text>
      )}

      <Control
        timeBudget={timeBudget}
        setTimeBudget={setTimeBudget}
        price={price}
        setPrice={setPrice}
        mood={mood}
        setMood={setMood}
        dietary={dietary}
        setDietary={setDietary}
      />

      <Button title="Help me find something bussin'" onPress={onButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default Home;
