import { Dimensions, StyleSheet } from "react-native";

const screenHeight = Dimensions.get('window').height;


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

export default getStyles;