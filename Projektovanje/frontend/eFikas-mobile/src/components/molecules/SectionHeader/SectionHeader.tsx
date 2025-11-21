import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Label } from '@/src/components/atoms/Label/Label';
import { IconButton } from '@/src/components/atoms/IconButton/IconButton';
import { Colors } from '@/src/styles/style';

interface SectionHeaderProps {
  title: string;
  onPress: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Label 
        text={title} 
        align="left" 
        size="xl" 
        color={Colors.textPrimary} 
        className="font-semibold"
      />
      <IconButton 
        iconName="ChevronRight" 
        onPress={onPress}
        className="ml-2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});