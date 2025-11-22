import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/src/styles/style";

import { MenuItem } from "@/src/components/molecules/MenuItem/MenuItem";
import { router } from "expo-router";

type IconName = "User" | "Bell" | "Home" | "Wallet" | "BarChart2" | "BookOpen" | "BookMarked" | "Users" | "Settings" | "Info" | "LogOut";

type MenuItemType = {
  icon: IconName; 
  label: string;
};

type MenuSection = {
  title: string;
  items: MenuItemType[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Profil",
    items: [
      { icon: "User", label: "Profil" },
      { icon: "Bell", label: "Obavještenja" },
      { icon: "Home", label: "Moji stanovi" },
    ],
  },
  {
    title: "Knjigovodstvo",
    items: [
      { icon: "Wallet", label: "Troškovi" },
      { icon: "BarChart2", label: "Statistika" },
      { icon: "BookOpen", label: "Knjiga prihoda" },
      { icon: "BookMarked", label: "Knjiga rashoda" },
      { icon: "Users", label: "Knjiga gostiju" },
    ],
  },
  {
    title: "Podešavanja",
    items: [
      { icon: "Settings", label: "Podešavanja" },
      { icon: "Info", label: "O aplikaciji" },
      { icon: "LogOut", label: "Odjava" },
    ],
  },
];

export default function Menu() {
    const handleItemPress = (item: string) => {
        switch (item) {
          case "Profil":
            console.log("Navigacija: Otvori detalje profila.");
            break;
    
          case "Obavještenja":
            console.log("Navigacija: Otvori ekran sa obaveštenjima.");
            break;
    
          case "Moji stanovi":
            console.log("Navigacija: Otvori listu stanova.");
            break;
    
          case "Troškovi":
            console.log("Navigacija: Otvori sekciju Troškovi.");
            break;
    
          case "Statistika":
            console.log("Navigacija: Otvori grafikone statistike.");
            break;
    
          case "Knjiga prihoda":
            console.log("Navigacija: Otvori sekciju Knjiga prihoda.");
            break;
    
          case "Knjiga rashoda":
            console.log("Navigacija: Otvori sekciju Knjiga rashoda.");
            break;
    
          case "Knjiga gostiju":
            console.log("Navigacija: Otvori Knjigu gostiju.");
            break;
    
          case "Podešavanja":
            console.log("Navigacija: Otvori opšte podešavanje aplikacije.");
            break;
    
          case "O aplikaciji":
            console.log("Prikaz: Informacije o aplikaciji i verziji.");
            break;
    
          case "Odjava":
            router.replace('/auth');
            break;
    
          default:
            console.log(`Greška: Nije definisana akcija za nepoznatu stavku: ${item}`);
        }
    };

    return (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.screenContainer}
        >
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <React.Fragment key={section.title}>
              <Text
                style={[
                  styles.sectionTitle,
                  sectionIndex > 0 && styles.sectionMargin, 
                ]}
              >
                {section.title}
              </Text>
    
              <View style={styles.listContainer}>
                {section.items.map((item, itemIndex) => (
                  <MenuItem
                    key={item.label} 
                    leftIconName={item.icon} 
                    text={item.label}
                    onPress={() => handleItemPress(item.label)}
                    showDivider={itemIndex < section.items.length - 1}
                  />
                ))}
              </View>
            </React.Fragment>
          ))}
          <View style={{ height: 50 }} />
        </ScrollView>
      );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        color: Colors.primary,
        marginBottom: 15,
        marginLeft: 5,
    },
    listContainer: {
        borderRadius: 10,
        overflow: "hidden",
    },
    sectionMargin: {
        marginTop: 20,
    },
});