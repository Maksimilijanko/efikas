import { Dimensions, StyleSheet } from "react-native";

const screenHeight = Dimensions.get('window').height;


const getStyles = (Colors: any) => StyleSheet.create({
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

export default getStyles;
