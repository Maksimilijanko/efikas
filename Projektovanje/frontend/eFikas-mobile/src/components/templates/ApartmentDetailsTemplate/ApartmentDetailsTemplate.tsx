import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ScrollViewProps } from 'react-native';
import { Colors } from '@/src/styles/style';

export type ApartmentDetailsTemplateProps = {
  basicInfo: React.ReactNode;
  gallery: React.ReactNode; 
  calendar: React.ReactNode;
  scrollProps?: ScrollViewProps;
};

const screenHeight = Dimensions.get('window').height;

const ApartmentDetailsTemplate: React.FC<ApartmentDetailsTemplateProps> = ({
  basicInfo,
  gallery,
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.secondary },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.1
  },
  heroSection: { width: '92%', marginBottom: screenHeight * 0.025 },
  heroWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'visible',
    position: 'relative',
    alignItems: 'center'
  },
  section: { 
    width: '100%', 
    marginBottom: screenHeight * 0.03 ,
    alignItems: 'center'
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
    width: '100%',
    flexGrow: 1,
    justifyContent: 'center'
  },
  galleryItem: {
    width: '92%'
  },
  calendarWrapper: {
    width: '92%'
  }
});

export default ApartmentDetailsTemplate;
