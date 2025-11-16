import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/src/styles/style';

export type ApartmentsListTemplateProps = {
  apartments: React.ReactNode[];
  floatingActionButton?: React.ReactNode;
};

const screenHeight = Dimensions.get('window').height;

const ApartmentsListTemplate: React.FC<ApartmentsListTemplateProps> = ({
  apartments,
  floatingActionButton
}) => {
  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listSection}>
          {apartments.map((item, index) => (
            <View key={index} style={styles.apartmentItem}>
              {item}
            </View>
          ))}
        </View>
      </ScrollView>

      {floatingActionButton && (
        <View style={styles.fabWrapper}>
          {floatingActionButton}
        </View>
      )}
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
    paddingBottom: screenHeight * 0.12
  },
  listSection: {
    width: '92%'
  },
  apartmentItem: {
    marginBottom: screenHeight * 0.015
  },
  fabWrapper: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ApartmentsListTemplate;
