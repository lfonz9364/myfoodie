import { Mood, PriceBand } from "@/lib/types";
import { StyleSheet, Text, View } from "react-native";
import Toggle from "./atoms/Toggle";

type ControlProps = {
  timeBudget: number;
  setTimeBudget: (value: number) => void;
  price: PriceBand;
  setPrice: (price: PriceBand) => void;
  mood: Mood;
  setMood: (mood: Mood) => void;
  dietary: string[];
  setDietary: (dietary: string[]) => void;
};

const Control = ({
  timeBudget,
  setTimeBudget,
  price,
  setPrice,
  mood,
  setMood,
  dietary,
  setDietary,
}: ControlProps) => (
  <View>
    <Text style={styles.toggleTitle}>Time Budget</Text>
    <View style={styles.toggleWrapper}>
      {[10, 20, 30, 45].map((min, idx) => (
        <Toggle
          key={`min-${idx}`}
          label={`${min} mins`}
          active={timeBudget === min}
          onPress={() => setTimeBudget(min)}
        />
      ))}
    </View>

    <Text style={styles.toggleTitle}>Price</Text>
    <View style={styles.toggleWrapper}>
      {[1, 2, 3].map((p, idx) => (
        <Toggle
          key={`price-${idx}`}
          label={"$".repeat(p)}
          active={price === p}
          onPress={() => setPrice(p as PriceBand)}
        />
      ))}
    </View>

    <Text style={styles.toggleTitle}>Mood</Text>
    <View style={styles.toggleWrapper}>
      {(["light", "comfort", "spicy"] as const).map((m, idx) => (
        <Toggle
          key={`mood-${idx}`}
          label={m}
          active={mood === m}
          onPress={() => setMood(m)}
        />
      ))}
    </View>

    <Text style={styles.toggleTitle}>Dietary</Text>
    <View style={{ ...styles.toggleWrapper, flexWrap: "wrap" }}>
      {["vegan", "vegetarian", "halal", "gluten-free"].map((tag, idx) => (
        <Toggle
          key={`dietary-${idx}`}
          label={tag}
          active={dietary.includes(tag)}
          onPress={() =>
            setDietary(
              dietary.includes(tag)
                ? dietary.filter((t) => t !== tag)
                : [...dietary, tag]
            )
          }
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  toggleTitle: {
    fontWeight: 600,
  },
  toggleWrapper: {
    flexDirection: "row",
  },
});

export default Control;
