import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ScrollViewProps } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider'; 
import getStyles from './index.styles';

export type ApartmentDetailsTemplateProps = {
  heroImage: React.ReactNode;
  heroTags: React.ReactNode;
  servicesHeader: React.ReactNode;
  services: React.ReactNode[];
  galleryHeader: React.ReactNode;
  galleryItems: React.ReactNode[];
  availabilityHeader: React.ReactNode;
  calendar: React.ReactNode;
  
  analyticsHeader: React.ReactNode;
  analyticsItems: React.ReactNode[]; 
  noteHeader: React.ReactNode;
  noteBox: React.ReactNode; 
  // --------------------

  scrollProps?: ScrollViewProps;
};

const screenHeight = Dimensions.get('window').height;

const ApartmentDetailsTemplate: React.FC<ApartmentDetailsTemplateProps> = ({
  heroImage,
  heroTags,
  servicesHeader,
  services,
  galleryHeader,
  galleryItems,
  availabilityHeader,
  calendar,
  analyticsHeader,
  analyticsItems,
  noteHeader,
  noteBox,
  scrollProps
}) => {
  const { Colors } = useTheme();

  const localStyles = getStyles(Colors);


  return (
    <View style={localStyles.root}>
      <ScrollView
        contentContainerStyle={localStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        <View style={localStyles.heroSection}>
          <View style={localStyles.heroWrapper}>
            {heroImage}
            <View style={localStyles.heroTagsWrapper}>
              {heroTags}
            </View>
          </View>
        </View>

        <View style={localStyles.section}>
          <View style={localStyles.sectionHeaderRow}>{servicesHeader}</View>
          <View style={localStyles.servicesGrid}>
            {services.map((item, index) => (
              <View key={index} style={localStyles.serviceItem}>
                {item}
              </View>
            ))}
          </View>
        </View>

        {/* 3. GALERIJA SEKCIJA */}
        <View style={localStyles.section}>
          <View style={localStyles.sectionHeaderRow}>{galleryHeader}</View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.galleryRow}
          >
            {galleryItems.map((item, index) => (
              <View key={index} style={localStyles.galleryItem}>
                {item}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={localStyles.section}>
          <View style={localStyles.sectionHeaderRow}>{availabilityHeader}</View>
          <View style={localStyles.calendarWrapper}>{calendar}</View>
        </View>

        <View style={localStyles.section}>
          <View style={localStyles.sectionHeaderRow}>{analyticsHeader}</View>
          <View style={localStyles.analyticsContainer}>
            {analyticsItems.map((item, index) => (
              <View key={index} style={localStyles.analyticsItem}>
                {item}
              </View>
            ))}
          </View>
        </View>


        
        <View style={localStyles.section}>
          <View style={localStyles.sectionHeaderRow}>{noteHeader}</View>
          <View style={localStyles.noteBoxWrapper}>{noteBox}</View>
        </View>


      </ScrollView>
    </View>
  );
};

export default ApartmentDetailsTemplate;