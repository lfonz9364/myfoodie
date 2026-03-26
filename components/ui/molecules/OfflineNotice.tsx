import ThemedCard from "@/components/ui/atoms/ThemedCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, Text } from "react-native";

type OfflineNoticeProps = {
  visible: boolean;
  message: string;
};

const OfflineNotice = ({ visible, message }: OfflineNoticeProps) => {
  const { colors } = useAppTheme();

  if (!visible) {
    return null;
  }

  return (
    <ThemedCard
      style={[
        styles.card,
        {
          backgroundColor: colors.primarySoft,
          borderColor: colors.primary,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Offline mode
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default OfflineNotice;
