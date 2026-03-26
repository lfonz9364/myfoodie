import ThemedCard from "@/components/ui/atoms/ThemedCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  AddressSuggestion,
  fetchAddressSuggestions,
} from "@/lib/addressAutocomplete";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type AddressAutocompleteProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
};

const AddressAutocomplete = ({
  value,
  onChangeText,
  onSelect,
}: AddressAutocompleteProps) => {
  const { colors } = useAppTheme();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 3) {
      setSuggestions([]);
      setError("");
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await fetchAddressSuggestions(value);
        setSuggestions(results);
      } catch (err) {
        setSuggestions([]);
        setError("Could not load address suggestions.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="e.g. 120 Spencer Street, Melbourne"
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: colors.borderStrong,
          },
        ]}
      />

      {loading ? (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color={colors.text} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Searching addresses…
          </Text>
        </View>
      ) : null}

      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}

      {!!suggestions.length && (
        <ThemedCard style={styles.dropdown}>
          {suggestions.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => {
                onSelect(item);
                setSuggestions([]);
              }}
              style={[
                styles.row,
                index < suggestions.length - 1
                  ? { borderBottomWidth: 1, borderBottomColor: colors.border }
                  : null,
              ]}
            >
              <Text style={[styles.rowText, { color: colors.text }]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ThemedCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 13,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
  dropdown: {
    paddingVertical: 4,
    gap: 0,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rowText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AddressAutocomplete;
