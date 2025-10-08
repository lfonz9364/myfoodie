import { Pressable, StyleSheet, Text } from "react-native";

type ToggleProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const Toggle = ({ label, active, onPress }: ToggleProps) => (
  <Pressable
    onPress={onPress}
    style={{ ...styles.button, borderColor: active ? "#222" : "#ccc" }}
  >
    <Text>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
});

export default Toggle;
