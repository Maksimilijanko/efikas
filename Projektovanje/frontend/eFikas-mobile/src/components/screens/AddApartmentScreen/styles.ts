// src/screens/EditApartmentScreen.styles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '@/src/styles/style';

export default StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Colors.secondary,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
