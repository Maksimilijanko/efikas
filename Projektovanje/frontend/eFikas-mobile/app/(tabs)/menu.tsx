import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/src/styles/style";
import { MenuItem } from "@/src/components/molecules/MenuItem/MenuItem";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { LogoutDialog } from "@/src/components/organisms/Dialogs/LogoutDialog/LogoutDialog";
import { useAuth } from "@/src/hooks/useAuth";
import { LucideIconName } from "@/src/types/types";

type MenuItemType = {
  id: string;
  icon: LucideIconName; 
  i18nKey: string;
};

type MenuSection = {
  i18nTitleKey: string;
  items: MenuItemType[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    i18nTitleKey: "menu.title.profile",
    items: [
      { id: "profile", icon: "User", i18nKey: "menu.item.profile" },
      { id: "notifications", icon: "Bell", i18nKey: "menu.item.notifications" },
      { id: "myApartments", icon: "Home", i18nKey: "menu.item.myApartments" },
    ],
  },
  {
    i18nTitleKey: "menu.title.accounting",
    items: [
      { id: "expenses", icon: "Wallet", i18nKey: "menu.item.expenses" },
      { id: "statistics", icon: "ChartNoAxesCombined", i18nKey: "menu.item.statistics" },
      { id: "incomeBook", icon: "BookDown", i18nKey: "menu.item.incomeBook" },
      { id: "expenseBook", icon: "BookUp", i18nKey: "menu.item.expenseBook" },
      { id: "guestBook", icon: "Users", i18nKey: "menu.item.guestBook" },
    ],
  },
  {
    i18nTitleKey: "menu.title.settings",
    items: [
      { id: "settings", icon: "Settings", i18nKey: "menu.item.settings" },
      { id: "aboutApp", icon: "Info", i18nKey: "menu.item.aboutApp" },
      { id: "logout", icon: "LogOut", i18nKey: "menu.item.logout" },
    ],
  },
];

export default function Menu() {

  const { t } = useTranslation();
  const { logout } = useAuth();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  
  // --- Logika za odjavu ---
  const handleLogoutConfirm = async () => {
    setLogoutDialogVisible(false);
    await logout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogVisible(false);
  };

  const handleItemPress = (itemId: string) => {
    switch (itemId) {
      case "profile":
        console.log("Navigacija: Otvori detalje profila.");
        break;

      case "notifications":
        console.log("Navigacija: Otvori ekran sa obaveštenjima.");
        break;

      case "myApartments":
        console.log("Navigacija: Otvori listu stanova.");
        break;

      case "expenses":
        console.log("Navigacija: Otvori sekciju Troškovi.");
        break;

      case "statistics":
        console.log("Navigacija: Otvori grafikone statistike.");
        break;

      case "incomeBook":
        console.log("Navigacija: Otvori sekciju Knjiga prihoda.");
        break;

      case "expenseBook":
        console.log("Navigacija: Otvori sekciju Knjiga rashoda.");
        break;

      case "guestBook":
        console.log("Navigacija: Otvori Knjigu gostiju.");
        break;

      case "settings":
        //console.log("Navigacija: Otvori opšte podešavanje aplikacije.");
        router.push('/(menu)/(mainSettings)/(settings)');
        break;

      case "aboutApp":
        router.push("/aboutApp");
        break;

      case "logout":
        setLogoutDialogVisible(true);
        break;

      default:
        console.log(`Greška: Nije definisana akcija za nepoznatu stavku: ${itemId}`);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.screenContainer}
    >
      {MENU_SECTIONS.map((section, sectionIndex) => (
        <React.Fragment key={section.i18nTitleKey}>
          <Text
            style={[
              styles.sectionTitle,
              sectionIndex > 0 && styles.sectionMargin, 
            ]}
          >
            {t(section.i18nTitleKey)} 
          </Text> 
          <View style={styles.listContainer}>
            {section.items.map((item, itemIndex) => (
              <MenuItem
                key={item.id} 
                leftIconName={item.icon} 
                text={t(item.i18nKey)} 
                onPress={() => handleItemPress(item.id)}
                showDivider={itemIndex < section.items.length - 1}
              />
            ))}
          </View>
        </React.Fragment>
      ))}
      <View style={{ height: 50 }} />
      <LogoutDialog
        visible={logoutDialogVisible}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
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
      fontWeight: 500,
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