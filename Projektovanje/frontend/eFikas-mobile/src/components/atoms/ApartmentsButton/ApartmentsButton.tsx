import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Icon } from '@/src/components/atoms/Icon/Icon';
import { Colors } from '@/src/styles/style';
import { Platform } from 'react-native';

interface ApartmentsButtonProps {
  onPress: () => void;
}

export const ApartmentsButton: React.FC<ApartmentsButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <Icon name="MapPinHouse" size={28} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    // SHADOW
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});