import { Place } from "@/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RESTAURANT_CACHE_KEY = "myfoodie:last-successful-restaurants";

export const saveCachedRestaurants = async (places: Place[]) => {
  try {
    await AsyncStorage.setItem(RESTAURANT_CACHE_KEY, JSON.stringify(places));
  } catch (error) {
    console.error("Failed to save cached restaurants", error);
  }
};

export const getCachedRestaurants = async (): Promise<Place[] | null> => {
  try {
    const raw = await AsyncStorage.getItem(RESTAURANT_CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Place[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read cached restaurants", error);
    return null;
  }
};

export const clearCachedRestaurants = async () => {
  try {
    await AsyncStorage.removeItem(RESTAURANT_CACHE_KEY);
  } catch (error) {
    console.error("Failed to clear cached restaurants", error);
  }
};
