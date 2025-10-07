export function applyTimeHeuristics(p: string[], now = new Date()) {
  const hour = now.getHours() + now.getMinutes() / 60;
  const isLunchRush = hour >= 11 && hour <= 14;
  const quickEats = ["sandwich", "salad", "poke", "wrap", "sushi"];
  const slowEats = [
    "indian",
    "thai",
    "noodles",
    "pizza",
    "burger",
    "kebab",
    "rice",
  ];

  const baseQueue = isLunchRush ? 7 : 4; // +7 mins if lunch rush
  const bonus = p.some((t) => quickEats.includes(t.toLowerCase()))
    ? 1
    : p.some((t) => slowEats.includes(t.toLowerCase()))
    ? 3
    : 2;
  return baseQueue + bonus;
}

export function prepByCuisine(p: string[]) {
  const quickEats = ["sandwich", "salad", "poke", "wrap", "sushi"];
  return p.some((t) => quickEats.includes(t.toLowerCase())) ? 6 : 9;
}
