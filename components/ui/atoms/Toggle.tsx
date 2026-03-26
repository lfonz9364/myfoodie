import { useAppTheme } from "@/hooks/useAppTheme";
import { Pressable, StyleSheet, Text } from "react-native";

type ToggleProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const Toggle = ({ label, active, onPress }: ToggleProps) => {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: active ? colors.darkSurface : colors.surface,
          borderColor: active ? colors.darkSurface : colors.borderStrong,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active ? colors.darkSurfaceText : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});

export default Toggle;
