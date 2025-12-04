import { StyleSheet } from 'react-native';
import { Colors } from '@/src/styles/style';

export const styles = StyleSheet.create({
  hstack: {
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.09,
    shadowRadius: 3,
    elevation: 5,
  }
});