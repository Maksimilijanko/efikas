import React from "react";
import { Text, View } from "react-native";
import { MenuItem } from "@/src/components/molecules/MenuItem/MenuItem";
import style from "./style";

import { LucideIconName } from "@/src/types/types";

export type SettingsItemType = {
  icon: LucideIconName;  
  label: string;
};

export type SettingsSection = {
  title: string;
  items: SettingsItemType[];
};

interface SettingsTemplateProps {
  sections: SettingsSection[];
  onItemPress: (label: string) => void;
}

export default function SettingsTemplate({
  sections,
  onItemPress,
}: SettingsTemplateProps) {
  return (
    <View style={style.screenContainer}>
      {sections.map((section, sectionIndex) => (
        <View key={section.title}>
          <Text
            style={[
              style.sectionTitle,
              sectionIndex > 0 && style.sectionMargin,
            ]}
          >
            {section.title}
          </Text>

          <View style={style.listContainer}>
            {section.items.map((item, index) => (
              <MenuItem
                key={item.label}
                leftIconName={item.icon}
                text={item.label}
                onPress={() => onItemPress(item.label)}
                showDivider={index < section.items.length - 1}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

//PRIMJER UPOTREBE
/**
  const SECTIONS: SettingsSection[] = [
    {
      title: "Opšte",
      items: [
        { icon: "Globe", label: "Jezik" },
        { icon: "SunMoon", label: "Tema" },
      ],
    },
    {
      title: "Povratne informacije",
      items: [
        { icon: "AlertTriangle", label: "Prijavite grešku" },
      ],
    },
  ];

  const handleItemPress = (label: string) => {
    Alert.alert("Pritisnuto", label);
  };

  return (
    <View style={{ flex: 1 }}>
      <SettingsTemplate
        sections={SECTIONS}
        onItemPress={handleItemPress}
      />
    </View>
  );
 */