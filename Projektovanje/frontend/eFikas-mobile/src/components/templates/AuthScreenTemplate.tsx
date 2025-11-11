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
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    StyleSheet,
} from 'react-native'; 
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { BasicButton } from '../atoms/BasicButton/BasicButton';
import LabelSeparator from '../atoms/LabelSeparator/LabelSeparator';
import { LoginButton } from '../atoms/LoginButton/LoginButton';
import LabeledTextField from '../molecules/LabeledTextField/LabeledTextField';
import { GoogleButton } from '../atoms/GoogleButton'; 
import { Colors } from '@/src/styles/style';

type AuthMode = 'login' | 'register';

interface AuthScreenTemplateProps {
    onLogin: (data: any) => void;
    onRegister: (data: any) => void;
    onForgotPassword: () => void;
    onGoogleLogin: () => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoginForm = ({ onLogin, onForgotPassword, onGoogleLogin }: Omit<AuthScreenTemplateProps, 'onRegister'>) => (
    <VStack space="xl" className="w-full px-6">
        <VStack space="lg" className="w-full">
            <LabeledTextField
                label="Email"
                placeholder="markomarkovic@gmail.out"
                iconLocation="left"
                type="text"
                iconName="Mail"
            />
            <LabeledTextField
                label="Password"
                placeholder="•••••••••"
                iconLocation="left"
                type="password"
                iconName="Lock"
            />
        </VStack>

        <LoginButton
            title="Prijavi se"
            onPress={() => onLogin({ email: 'example', password: 'example' })}
            className="mt-2"
        />

        <TouchableOpacity
            onPress={onForgotPassword}
            className="self-center mt-1"
            activeOpacity={0.6}
        >
            <Text
                className="font-semibold text-center text-sm"
                style={{ color: Colors.primary }}
            >
                Zaboravljena lozinka
            </Text>
        </TouchableOpacity>

        <LabelSeparator label="ili" />

        <GoogleButton onPress={onGoogleLogin} />
    </VStack>
);

const RegisterForm = ({ onRegister, onGoogleLogin }: Omit<AuthScreenTemplateProps, 'onLogin' | 'onForgotPassword'>) => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(null);

    const validatePasswords = () => {
        let valid = true;

        if (password.length < 8) {
            setPasswordError('Lozinka mora imati najmanje 8 karaktera.');
            valid = false;
        } else {
            setPasswordError(null);
        }

        if (repeatPassword !== password) {
            setRepeatPasswordError('Lozinke se ne podudaraju.');
            valid = false;
        } else {
            setRepeatPasswordError(null);
        }

        return valid;
    };

    const handleRegisterPress = () => {
        const ok = validatePasswords();
        if (!ok) return;

        onRegister({
            password,
            repeatPassword,
        });
    };

    return (
        <VStack space="lg" className="w-full px-6">
            <LabeledTextField
                label="Ime"
                placeholder="Marko"
                iconLocation="left"
                type="text"
            />
            <LabeledTextField
                label="Prezime"
                placeholder="Marković"
                iconLocation="left"
                type="text"
            />
            <LabeledTextField
                label="Email"
                placeholder="markomarkovic@gmail.com"
                iconLocation="left"
                type="text"
                iconName="Mail"
            />
            <LabeledTextField
                label="Password"
                placeholder="•••••••••"
                iconLocation="left"
                type="password"
                iconName="Lock"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError(null);
                }}
                error={!!passwordError}
            />
            {passwordError && (
                <Text
                    style={{
                        color: '#DC2626',
                        fontSize: 12,
                        marginTop: 4,
                        marginLeft: 4,
                    }}
                >
                    {passwordError}
                </Text>
            )}

            <LabeledTextField
                label="Password"
                placeholder="Ponovi šifru"
                iconLocation="left"
                type="password"
                iconName="Lock"
                onChangeText={(text) => {
                    setRepeatPassword(text);
                    if (repeatPasswordError) setRepeatPasswordError(null);
                }}
                error={!!repeatPasswordError}
            />
            {repeatPasswordError && (
                <Text
                    style={{
                        color: '#DC2626',
                        fontSize: 12,
                        marginTop: 4,
                        marginLeft: 4,
                    }}
                >
                    {repeatPasswordError}
                </Text>
            )}

            <LoginButton
                title="Registruj se"
                onPress={handleRegisterPress}
                className="mt-4"
            />

            <LabelSeparator label="ili" />

            <GoogleButton onPress={onGoogleLogin} />
        </VStack>
    );
};

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
                <LoginForm
                    onLogin={props.onLogin}
                    onForgotPassword={props.onForgotPassword}
                    onGoogleLogin={props.onGoogleLogin}
                />
            );
        }
        return (
            <RegisterForm
                onRegister={props.onRegister}
                onGoogleLogin={props.onGoogleLogin}
            />
        );
    };

    const getTabButtonClassName = (mode: AuthMode) =>
        `flex-1 rounded-full h-[46px] m-0 ${authMode === mode ? 'bg-white' : 'bg-transparent'}`;

    const getTabButtonTextClassName = (mode: AuthMode) =>
        `${authMode === mode ? 'text-primary-500' : 'text-gray-500'} font-semibold`;

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
                        <HStack
                            className="w-11/12 h-[52px] rounded-full p-1 justify-center items-center self-center"
                            style={{
                                maxWidth: 380,
                                backgroundColor: Colors.secondary,
                            }}
                        >
                            <BasicButton
                                title="Prijava"
                                onPress={() => setAuthMode('login')}
                                className={getTabButtonClassName('login')}
                                textClassName={getTabButtonTextClassName('login')}
                            />
                            <BasicButton
                                title="Registracija"
                                onPress={() => setAuthMode('register')}
                                className={getTabButtonClassName('register')}
                                textClassName={getTabButtonTextClassName('register')}
                            />
                        </HStack>
                        <View className="w-full mt-6">
                            {renderForm()}
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
import { View, Text } from 'react-native'; 
import AuthScreenTemplate from '../../src/components/templates/AuthScreenTemplate';

export default function TabOneScreen() {

  
  const handleLogin = (data: any) => {
    console.log("Prijavljivanje korisnika sa podacima:", data);
  };

  const handleRegister = (data: any) => {
    console.log("Registrovanje novog korisnika sa podacima:", data);
  };

  const handleForgotPassword = () => {
    console.log("Navigacija na Zaboravljena lozinka stranicu");
  };

  const handleGoogleLogin = () => {
    console.log("Pokretanje Google Login procesa");
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