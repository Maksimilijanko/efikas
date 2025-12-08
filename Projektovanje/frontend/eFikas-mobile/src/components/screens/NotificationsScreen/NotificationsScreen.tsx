import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { ToggleItem } from "@/src/components/molecules/ToggleItem/ToggleItem";
// import { Colors } from '@/src/styles/style';
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";

const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { Colors } = useTheme();

  const styles = getStyles(Colors);
  
  const handleToggle = (value: boolean) => {
    console.log(`Obavještenja su ${value ? 'uključena' : 'isključena'}`);
    // Logika za obavjestenja
  };

  return (
    <ScrollView 
        style={styles.background} 
        contentContainerStyle={styles.contentContainer}
    >
      
      <ToggleItem
        title={t('notifications.title')}
        leftIconName="Bell"
        initialValue={true} 
        onValueChange={handleToggle}
      />
      
      <View style={styles.dividerStyle} />

      <Text style={styles.descriptionText}>
        {t('notifications.description')}
      </Text>

    </ScrollView>
  );
};

const getStyles = (Colors: any) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: Colors.screenBackground,
    },
    contentContainer: {
      paddingTop: 10,
    },
    dividerStyle: {
      height: 1,
      backgroundColor: Colors.borderColor,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    descriptionText: {
      fontSize: 12,
      color: Colors.textSecondary,
      lineHeight: 18,
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
  });

export default NotificationsScreen;