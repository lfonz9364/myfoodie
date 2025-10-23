import * as Location from "expo-location";

export async function getCurrentLocation(
  setLoadingLocation: (loading: boolean) => void
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
