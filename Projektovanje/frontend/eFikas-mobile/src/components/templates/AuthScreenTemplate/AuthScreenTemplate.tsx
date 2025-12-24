import { VStack } from '@/src/components/ui/vstack';
import { useTheme } from '@/src/providers/ThemeProvider';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    UIManager,
    View
} from 'react-native';


interface AuthScreenTemplateProps {
  authForm: React.ReactNode;
  header?: React.ReactNode;
  onKeyboardOffsetChange?: (offset: number) => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AuthScreenTemplate = (props: AuthScreenTemplateProps) => {
  const { Colors } = useTheme();
  const windowHeight = Dimensions.get('window').height;
  const topImageHeight = windowHeight * 0.25;

  const scrollRef = useRef<ScrollView | null>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardOffset(-e.endCoordinates.height * 0.7);
      props.onKeyboardOffsetChange?.(keyboardOffset);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
      props.onKeyboardOffsetChange?.(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [props.onKeyboardOffsetChange]);

  const defaultHeader = (
    <ImageBackground
      source={require('@/assets/images/background2.png')}
      style={{
        width: '100%',
        height: topImageHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      blurRadius={2}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.20)',
        }}
      />
      <VStack className="items-center mt-12">
        <Image
          source={require('@/assets/images/lqlogo.png')}
          style={{ width: 120, height: 120, resizeMode: 'contain' }}
        />
      </VStack>
    </ImageBackground>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollRef}
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ 
          // Remove flexGrow: 1 and use minHeight instead for better scrolling
          minHeight: windowHeight,
          backgroundColor: Colors.background 
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {props.header || defaultHeader}

        <View
          className="w-full rounded-t-[30px] p-0"
          style={{
            marginTop: -30,
            transform: [{ translateY: keyboardOffset }],
            backgroundColor: Colors.background,
            minHeight: windowHeight - topImageHeight + 30, // Ensure minimum height
          }}
          pointerEvents="box-none"
        >
          <VStack space="lg" className="w-full pt-8 items-center">
            <View className="w-full mt-6">
              {props.authForm}
            </View>
          </VStack>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreenTemplate;


/*
primjer upotrebe:
import React from 'react';
import AuthScreenTemplate from '../../src/components/templates/AuthScreenTemplate';

export default function IndexScreen() {
  const handleLogin = (data: any) => {
    console.log('Prijavljivanje korisnika:', data);
  };

  const handleRegister = (data: any) => {
    console.log('Registracija korisnika:', data);
  };

  const handleForgotPassword = () => {
    console.log('Zaboravljena lozinka');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  return (
    <AuthScreenTemplate
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={handleForgotPassword}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}

*/