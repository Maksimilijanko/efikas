import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Switch } from "@/components/ui/switch";
import { Colors } from "@/src/styles/style";
import { LucideIconName } from "@/src/types/types";

interface ToggleItemProps {
  title: string;
  onValueChange: (value: boolean) => void;
  leftIconName?: LucideIconName;
  initialValue?: boolean;
}

export const ToggleItem: React.FC<ToggleItemProps> = ({
  title,
  onValueChange,
  leftIconName,
  initialValue = true,
}) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  
  const toggleSwitch = (value: boolean) => {
    setIsEnabled(value);
    onValueChange(value);
  };

  return (
    <View>
      <View style={styles.container}>
        {leftIconName && (
          <Icon
            name={leftIconName}
            size={24}
            color={Colors.iconMenu}
            style={styles.leftIcon}
          />
        )}
        <Text style={styles.text}>{title}</Text>
        <Switch 
          onValueChange={toggleSwitch}
          value={isEnabled}
          trackColor={{ false: Colors.tertiary, true: Colors.primary }} 
          style={styles.rightSwitch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center", 
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  leftIcon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  rightSwitch: {
    marginLeft: 12,
    marginRight: 8,
  }
});

export default ToggleItem;
