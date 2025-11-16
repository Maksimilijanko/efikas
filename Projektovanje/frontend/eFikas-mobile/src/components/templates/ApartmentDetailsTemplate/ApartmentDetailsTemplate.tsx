import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ScrollViewProps } from 'react-native';
import { Colors } from '@/src/styles/style';

export type ApartmentDetailsTemplateProps = {
  heroImage: React.ReactNode;
  heroTags: React.ReactNode;
  servicesHeader: React.ReactNode;
  services: React.ReactNode[];
  galleryHeader: React.ReactNode;
  galleryItems: React.ReactNode[];
  availabilityHeader: React.ReactNode;
  calendar: React.ReactNode;
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
  scrollProps
}) => {
  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroWrapper}>
            {heroImage}
            <View style={styles.heroTagsWrapper}>
              {heroTags}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>{servicesHeader}</View>
          <View style={styles.servicesGrid}>
            {services.map((item, index) => (
              <View key={index} style={styles.serviceItem}>
                {item}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>{galleryHeader}</View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryRow}
          >
            {galleryItems.map((item, index) => (
              <View key={index} style={styles.galleryItem}>
                {item}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>{availabilityHeader}</View>
          <View style={styles.calendarWrapper}>{calendar}</View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: '47%',
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
  }
});

export default ApartmentDetailsTemplate;
