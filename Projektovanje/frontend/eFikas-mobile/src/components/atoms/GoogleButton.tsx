import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/src/styles/style';

const GOOGLE_ICON_URI =
  'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png';

interface GoogleButtonProps {
  onPress: () => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      className="w-11/12 self-center h-[46px] rounded-full flex-row items-center justify-center"
      style={{
        maxWidth: 380,
        backgroundColor: Colors.background,
        borderColor: Colors.secondary,
        borderWidth: 1,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <HStack className="items-center space-x-2">
        <Image
          source={{ uri: GOOGLE_ICON_URI }}
          style={{ width: 18, height: 18 }}
          resizeMode="contain"
        />
        <Text
          className="text-[15px] font-medium"
          style={{ color: Colors.textPrimary }}
        >
          Nastavi uz pomoć Google naloga
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

export default GoogleButton;
