import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/src/components/atoms/Icon/Icon"; 
import { Colors } from "@/src/styles/style";
import { LucideIconName } from "@/src/types/types";

interface MenuItemProps {
  text: string;
  onPress: () => void;
  leftIconName?: LucideIconName;
  rightIconName?: LucideIconName;
  showDivider?: boolean;
}

export const MenuItem = ({
  text,
  onPress,
  leftIconName = "Home",
  rightIconName = "ChevronRight",
  showDivider = true,
}: MenuItemProps) => {
  return (
    <View>
      <Pressable onPress={onPress} style={styles.container}>
        {leftIconName && (
          <Icon
            name={leftIconName}
            size={24}
            color={Colors.iconMenu}
            style={styles.leftIcon}
          />
        )}
        <Text style={styles.text}>{text}</Text>
        {rightIconName && (
          <Icon
            name={rightIconName}
            size={20}
            color={Colors.tertiary}
            style={styles.rightIcon}
          />
        )}
      </Pressable>

      {showDivider && (
        <Divider className="bg-gray-300"/>
      )}
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
  rightIcon: {
    marginLeft: 12,
  },
});
