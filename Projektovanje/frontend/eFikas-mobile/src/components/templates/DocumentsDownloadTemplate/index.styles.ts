import { StyleSheet, Dimensions } from 'react-native';
// import { Colors } from '@/src/styles/style';

const screenHeight = Dimensions.get('window').height;

const getStyles = (Colors: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.screenBackground,
    },
    scrollContent: {
      width: "100%",
      alignItems: "center",
      paddingTop: screenHeight * 0.02,
      paddingBottom: screenHeight * 0.12,
      backgroundColor: Colors.screenBackground,
    },
    listWrapper: {
      width: "92%",
    },
    itemWrapper: {
      marginBottom: 14,
    },
  });

export default getStyles;