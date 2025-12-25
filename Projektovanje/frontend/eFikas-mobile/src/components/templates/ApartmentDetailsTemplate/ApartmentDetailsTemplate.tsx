import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ScrollViewProps } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider'; 
import getStyles from './index.styles';

export type ApartmentDetailsTemplateProps = {
  basicInfo: React.ReactNode;
  gallery: React.ReactNode; 
  calendar: React.ReactNode;
  scrollProps?: ScrollViewProps;
};


const ApartmentDetailsTemplate: React.FC<ApartmentDetailsTemplateProps> = ({
  basicInfo,
  gallery,
  calendar,
  scrollProps
}) => {

  const { Colors } = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroWrapper}>
            {basicInfo}
          </View>
        </View>

        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryRow}
          >
            <View style={styles.galleryItem}>
              {gallery} 
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.calendarWrapper}>{calendar}</View>
        </View>
      </ScrollView>
    </View>
  );
};


export default ApartmentDetailsTemplate;
