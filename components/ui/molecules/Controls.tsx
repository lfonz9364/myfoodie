import { useAppTheme } from "@/hooks/useAppTheme";
import { Mood, PriceBand } from "@/lib/types";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Toggle from "../atoms/Toggle";

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

const timeMinuteOptions = [10, 20, 30, 45];
const priceOptions = [
  { label: "cheap", value: 1 as PriceBand },
  { label: "moderate", value: 2 as PriceBand },
  { label: "expensive", value: 3 as PriceBand },
];
const moodOptions: Mood[] = ["light", "comfort", "spicy"];
const dietaryOptions = ["vegan", "vegetarian", "halal", "gluten-free"];

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.sectionCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
};

const Controls = ({
  timeBudget,
  setTimeBudget,
  price,
  setPrice,
  mood,
  setMood,
  dietary,
  setDietary,
}: ControlProps) => {
  const toggleDietary = (tag: string) => {
    setDietary(
      dietary.includes(tag)
        ? dietary.filter((item) => item !== tag)
        : [...dietary, tag],
    );
  };

  return (
    <View style={styles.container}>
      <Section title="Time budget">
        <View style={styles.rowWrap}>
          {timeMinuteOptions.map((minutes) => (
            <Toggle
              key={minutes}
              label={`${minutes} mins`}
              active={timeBudget === minutes}
              onPress={() => setTimeBudget(minutes)}
            />
          ))}
        </View>
      </Section>

      <Section title="Budget">
        <View style={styles.rowWrap}>
          {priceOptions.map((option) => (
            <Toggle
              key={option.label}
              label={option.label}
              active={price === option.value}
              onPress={() => setPrice(option.value)}
            />
          ))}
        </View>
      </Section>

      <Section title="Mood">
        <View style={styles.rowWrap}>
          {moodOptions.map((option) => (
            <Toggle
              key={option}
              label={option}
              active={mood === option}
              onPress={() => setMood(option)}
            />
          ))}
        </View>
      </Section>

      <Section title="Dietary">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.rowWrap}>
            {dietaryOptions.map((option) => (
              <Toggle
                key={option}
                label={option}
                active={dietary.includes(option)}
                onPress={() => toggleDietary(option)}
              />
            ))}
          </View>
        </ScrollView>
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default Controls;
