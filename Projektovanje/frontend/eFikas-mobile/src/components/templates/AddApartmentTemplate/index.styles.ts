import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/src/styles/style';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.04
  },
  inner: {
    width: '92%',
    alignItems: 'center'
  },
  fullWidthRow: {
    width: '90%',
    marginBottom: screenHeight * 0.02
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.02
  },
  leftColumn: {
    width: '45%',
    justifyContent: 'center'
  },
  rightColumn: {
    width: '50%',
    justifyContent: 'space-between'
  },
  formRow: {
    marginBottom: screenHeight * 0.02
  },
  saveButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: screenHeight * 0.03
  }
});

export default styles;
