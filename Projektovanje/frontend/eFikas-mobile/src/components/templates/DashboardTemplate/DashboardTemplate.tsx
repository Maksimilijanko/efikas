import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/src/styles/style';

export type DashboardTemplateProps = {
  headerLeft: React.ReactNode;
  headerRight?: React.ReactNode;
  reservationsHeader: React.ReactNode;
  calendar: React.ReactNode;
  shortcuts: React.ReactNode[];
  statisticsCard: React.ReactNode;
};

const screenHeight = Dimensions.get('window').height;

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  headerLeft,
  headerRight,
  reservationsHeader,
  calendar,
  shortcuts,
  statisticsCard
}) => {
  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              {headerLeft}
            </View>
            {headerRight && (
              <View style={styles.headerRight}>
                {headerRight}
              </View>
            )}
          </View>
        </View>

        <View style={styles.reservationsSection}>
          {reservationsHeader}
        </View>

        <View style={styles.calendarSection}>
          {calendar}
        </View>

        <View style={styles.shortcutsSection}>
          {shortcuts.map((item, index) => (
            <View key={index} style={styles.shortcutItem}>
              {item}
            </View>
          ))}
        </View>

        <View style={styles.statisticsSection}>
          {statisticsCard}
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
  headerSection: {
    width: '92%',
    marginBottom: screenHeight * 0.015
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12
  },
  reservationsSection: {
    width: '92%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.01
  },
  calendarSection: {
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenHeight * 0.03
  },
  shortcutsSection: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.04
  },
  shortcutItem: {
    flex: 1,
    marginHorizontal: '1%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statisticsSection: {
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenHeight * 0.04
  }
});

export default DashboardTemplate;
