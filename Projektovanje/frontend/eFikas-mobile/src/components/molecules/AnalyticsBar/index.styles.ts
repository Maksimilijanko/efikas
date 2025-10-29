import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barBackground: {
    flex: 1,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb', // gray-200
    overflow: 'hidden',
    marginRight: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});