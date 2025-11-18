import React, { useState, useEffect, useRef } from 'react';
import {
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutAnimation,
  UIManager,
  StyleSheet,
} from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/src/styles/style';
import { SegmentedControl } from '../../atoms/SegmentedControl/SegmentedControl';

type AuthMode = 'login' | 'register';

interface AuthScreenTemplateProps {
  authForm: React.ReactNode;
  onLogin: (data: any) => void;
  onRegister: (data: any) => void;
  onForgotPassword?: () => void;
  onGoogleLogin: () => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AuthScreenTemplate = (props: AuthScreenTemplateProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const windowHeight = Dimensions.get('window').height;
  const topImageHeight = windowHeight * 0.25;

  const scrollRef = useRef<ScrollView | null>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (!scrollRef.current) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (authMode === 'register') {
      scrollRef.current.scrollTo({
        y: topImageHeight * 0.7,
        animated: true,
      });
    } else {
      scrollRef.current.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }, [authMode, topImageHeight]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardOffset(-e.endCoordinates.height * 0.7);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const renderForm = () => {
    if (authMode === 'login') {
      return (
        props.authForm
      );
    }
    return (
      props.authForm
    );
  };

  const handleSegmentChange = (option: string) => {
    if (option === 'Prijava') {
      setAuthMode('login');
    } else {
      setAuthMode('register');
    }
  };

  const selectedOption = authMode === 'login' ? 'Prijava' : 'Registracija';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollRef}
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.background }}
        keyboardShouldPersistTaps="always"
      >
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

        <View
          className="w-full rounded-t-[30px] p-0"
          style={{
            marginTop: -30,
            transform: [{ translateY: keyboardOffset }],
            backgroundColor: Colors.background,
          }}
          pointerEvents="box-none"
        >
          <VStack space="lg" className="w-full pt-8 items-center">
            <HStack className="w-full justify-center items-center">
              <SegmentedControl
                options={['Prijava', 'Registracija']}
                selectedOption={selectedOption}
                onOptionPress={handleSegmentChange}
              />
            </HStack>
            <View className="w-full mt-6">
              {renderForm()}
            </View>
          </VStack>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );};

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