import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ScrollViewProps } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider'; // Koristimo useTheme za Colors

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

const getStyles = (Colors: any) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.secondary 
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.1
  },
  heroSection: {
    width: '92%',
    marginBottom: screenHeight * 0.025
  },
  heroWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center'
  },
  heroTagsWrapper: {
    position: 'absolute',
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10
  },
  section: {
    width: '92%',
    marginBottom: screenHeight * 0.03
  },
  sectionHeaderRow: {
    width: '100%',
    marginBottom: screenHeight * 0.015
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  serviceItem: {
    width: '48%', 
    marginBottom: screenHeight * 0.012
  },
  galleryRow: {
    paddingRight: 8
  },
  galleryItem: {
    marginRight: 8
  },
  calendarWrapper: {
    width: '100%'
  },
  analyticsContainer: {
    gap: 15,
  },
  analyticsItem: {
    width: '100%'
  },
  noteBoxWrapper: {
    width: '100%'
  }
});


export default ApartmentDetailsTemplate;