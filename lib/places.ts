import * as Location from "expo-location";

export const geocodeAddress = async (address: string) => {
  const trimmed = address.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const results = await Location.geocodeAsync(trimmed);

    if (!results.length) {
      return null;
    }

    return {
      lat: results[0].latitude,
      lng: results[0].longitude,
    };
  } catch (error) {
    console.error("Failed to geocode address", error);
    return null;
  }
};

export async function getCurrentLocation(
  setLoadingLocation: (loading: boolean) => void,
) {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setLoadingLocation(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting location:", error);
  } finally {
    setLoadingLocation(false);
  }
}
