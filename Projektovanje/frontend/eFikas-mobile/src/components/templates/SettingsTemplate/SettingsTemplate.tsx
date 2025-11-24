import React from "react";
import style from "./style";


import MenuSection from "../../organisms/MenuSection/MenuSection";
import { View } from "react-native";
import { MenuSectionProps } from "@/src/types/types";

interface SettingsTemplateProps {
  sections: MenuSectionProps[];
}

export default function SettingsTemplate({
  sections,
}: SettingsTemplateProps) {
  return (
    <View style={style.screenContainer}>
      {sections.map((section, sectionIndex) => (
        <MenuSection 
          key={sectionIndex} 
          title={section.title} 
          items={section.items}
        />

        // <View key={section.title}>
        //   <Text
        //     style={[
        //       style.sectionTitle,
        //       sectionIndex > 0 && style.sectionMargin,
        //     ]}
        //   >
        //     {section.title}
        //   </Text>

        //   <View style={style.listContainer}>
        //     {section.items.map((item, index) => (
        //       <MenuItem
        //         key={item.label}
        //         leftIconName={item.icon}
        //         text={item.label}
        //         onPress={() => onItemPress(item.label)}
        //         showDivider={index < section.items.length - 1}
        //       />
        //     ))}
        //   </View>
        // </View>
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