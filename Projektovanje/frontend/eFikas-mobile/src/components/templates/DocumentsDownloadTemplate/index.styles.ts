import { StyleSheet, Dimensions } from 'react-native';
// import { Colors } from '@/src/styles/style';

const screenHeight = Dimensions.get('window').height;

const getStyles = (Colors: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.screenBackground,
      paddingTop: screenHeight * 0.02,
      paddingBottom: screenHeight * 0.02,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    documentsSection: {
      height: '100%', // 35% of screen for documents
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    documentsScroll: {
      flex: 1,
    },
    documentsContent: {
      width: "100%",
      alignItems: "center",
      paddingTop: screenHeight * 0.02,
      paddingBottom: screenHeight * 0.02,
    },
    listWrapper: {
      width: "90%",
      gap: 10,
    },
    itemWrapper: {
      marginBottom: 14,
    },
    pdfSection: {
      flex: 1, // Takes remaining 65% of screen
      backgroundColor: Colors.screenBackground,
    },
    pdfViewer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.screenBackground,
    },
    loadingText: {
      color: Colors.textPrimary,
      fontSize: 16,
    },

    placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 16,
      color: Colors.gray,
      fontStyle: 'italic',
    },

    periodForm: {
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
      marginBottom: 10,
      gap: 10,

    }
  });

export default getStyles;