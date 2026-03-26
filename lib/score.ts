import { AppColors } from "@/constants/theme";
import { Mood, Place, PriceBand } from "@/lib/types";

export function scorePlace(
  p: Place,
  prefs: {
    timeBudget: number;
    price: PriceBand;
    dietary: string[];
    mood: Mood;
  },
) {
  const {
    walkMins,
    avgPrepMins,
    queueMinsGuess,
    tags,
    popularity: ratings,
    price: restoPrice,
  } = p;
  const { timeBudget, price, dietary, mood } = prefs;

  // ---- Time Score ---
  const totalMins =
    (walkMins ?? 10) + (avgPrepMins ?? 8) + (queueMinsGuess ?? 6);

  const timeFit =
    totalMins <= timeBudget
      ? 1
      : Math.max(0, 1 - (totalMins - timeBudget / timeBudget));

  // ---- DIETARY SCORE (optional) ----
  const dietaryFit =
    dietary.length === 0 ? 1 : dietary.some((d) => tags?.includes(d)) ? 1 : 0;

  // ---- PRICE SCORE
  const priceDiff = Math.abs((restoPrice ?? 2) - price);
  const priceFit = Math.max(0, 1 - priceDiff / 3);

  // ---- MOOD SCORE ----
  const moodMap: Record<Mood, string[]> = {
    light: ["salad", "wrap", "poke", "sushi"],
    comfort: ["burger", "pizza", "noodles", "kebab", "rice"],
    spicy: ["thai", "indian", "mexican", "sichuan"],
  };
  const moodFit = tags.some((t) => moodMap[mood].includes(t.toLowerCase()))
    ? 1
    : 0.7;

  const proximity = 1 / (1 + (walkMins ?? 0) / 10);
  const popularity = ratings ?? 0.5;

  const score =
    0.3 * proximity + // Ensuring the restaurant is nearby
    0.3 * timeFit + // Matching the user's time budget
    0.15 * dietaryFit + // The next important factor after proximity and time
    0.1 * moodFit + // Catering to the user's current mood
    0.1 * priceFit + // Fitting within the user's price range
    0.05 * popularity; // Considering the restaurant's popularity
  return Number(score.toFixed(2));
}

export const getScoreColor = (score: number, colors: AppColors) => {
  if (score >= 0.8) return colors.success;
  if (score >= 0.6) return colors.warning;
  return colors.error;
};
