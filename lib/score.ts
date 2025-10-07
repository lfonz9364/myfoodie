import { Mood, Place, PriceBand } from "@/lib/types";

export function scorePlace(
  p: Place,
  prefs: { timeBudget: number; price: PriceBand; dietary: string[]; mood: Mood }
) {
  const totalMins =
    (p.walkMins ?? 0) * 2 + (p.avgPrepMins ?? 8) + (p.queueMinsGuess ?? 6);

  const timeFit = Math.min(1, prefs.timeBudget / Math.max(5, totalMins)); // 0..1
  const isDietaryFit = (diet: string) =>
    p.tags.map((t) => t.toLowerCase()).includes(diet.toLowerCase());
  const dietaryFit = prefs.dietary.length
    ? prefs.dietary.every((d) => isDietaryFit(d))
      ? 1
      : 0.6
    : 1;

  const moodMap: Record<Mood, string[]> = {
    light: ["salad", "wrap", "poke", "sushi"],
    comfort: ["burger", "pizza", "noodles", "kebab", "rice"],
    spicy: ["thai", "indian", "mexican", "sichuan"],
  };
  const moodFit = p.tags.some((t) =>
    moodMap[prefs.mood].includes(t.toLowerCase())
  )
    ? 1
    : 0.7;

  const priceFit = 1 - 0.2 * Math.abs((p.price ?? 2) - prefs.price);
  const proximity = 1 / (1 + (p.walkMins ?? 0) / 10);
  const popularity = p.popularity ?? 0.5;

  const score =
    0.3 * proximity + // Ensuring the restaurant is nearby
    0.3 * timeFit + // Matching the user's time budget
    0.15 * dietaryFit + // The next important factor after proximity and time
    0.1 * moodFit + // Catering to the user's current mood
    0.1 * priceFit + // Fitting within the user's price range
    0.05 * popularity // Considering the restaurant's popularity
    ;

  return Math.round(score);
}
