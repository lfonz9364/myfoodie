const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

export type AddressSuggestion = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

type GeoapifyFeature = {
  properties?: {
    place_id?: string;
    formatted?: string;
    lat?: number;
    lon?: number;
  };
};

type GeoapifyResponse = {
  features?: GeoapifyFeature[];
};

export const fetchAddressSuggestions = async (
  input: string,
): Promise<AddressSuggestion[]> => {
  const trimmed = input.trim();

  if (trimmed.length < 3 || !GEOAPIFY_API_KEY) {
    return [];
  }

  const url =
    `https://api.geoapify.com/v1/geocode/autocomplete` +
    `?text=${encodeURIComponent(trimmed)}` +
    `&limit=5` +
    `&filter=countrycode:au` +
    `&apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Autocomplete request failed: ${response.status}`);
  }

  const data = (await response.json()) as GeoapifyResponse;

  return (data.features ?? [])
    .map((feature) => {
      const props = feature.properties;

      if (
        !props?.formatted ||
        typeof props.lat !== "number" ||
        typeof props.lon !== "number"
      ) {
        return null;
      }

      return {
        id: props.place_id ?? props.formatted,
        label: props.formatted,
        lat: props.lat,
        lng: props.lon,
      };
    })
    .filter((item): item is AddressSuggestion => item !== null);
};
