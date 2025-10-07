export type PriceBand = 1|2|3;
export type Mood = "light"|"comfort"|"spicy";

export type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tags: string[]; // ["sushi","salad","thai","vegan","halal","sandwich"]
  price?: PriceBand;
  popularity?: number; // 0..1
  orderUrl?: string;
  phone?: string;
  avgPrepMins?: number; // 5..12 default
  queueMinsGuess?: number; // 4..10 depends on time/cuisine
  walkMins?: number; // computed
}