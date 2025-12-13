import React from "react";
import { View, StyleSheet } from "react-native";
import TextField from "../../atoms/TextField/TextField";
import { Label } from "../../atoms/Label/Label";
import { useTheme } from "@/src/providers/ThemeProvider";

interface PriceInputRowProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const PriceInputRow: React.FC<PriceInputRowProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "",
}) => {

  const { Colors } = useTheme();

  return (
    <View style={styles.row}>
      <Label text={label} size="md" color={Colors.textSecondary} />
      <View style={styles.inputWrapper}>
        <TextField
        style={[{width: 120}]}
        size="md"
          type="text"
          placeholder={placeholder}
          inputProps={{
            value,
            onChangeText,
            keyboardType: "numeric",
          }}
          variant="outline"
        />
        <View style={[{width: 5}]} />
        <Label text="KM" size="md"  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: 'space-between',
    width: '100%'
  },
  label: {
    flex: 1,
  },
  inputWrapper: {
    width: '45%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end'
  },
  currency: {
    marginLeft: 8,
  },
});
