import { VStack } from "@/src/components/ui/vstack";
import { useAuth } from "@/src/hooks/useAuth";
import { Colors } from "@/src/styles/style";
import { LoginRequest, RegisterRequest } from "@/src/types/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { GoogleButton } from "../../atoms/GoogleButton";
import { Label } from "../../atoms/Label/Label";
import LabelSeparator from "../../atoms/LabelSeparator/LabelSeparator";
import { LoginButton } from "../../atoms/LoginButton/LoginButton";
import AuthSwitcher from "../../molecules/AuthSwitcher/AuthSwitcher";
import FormField from "../../molecules/FormField/FormField";
import AuthScreenTemplate from "../../templates/AuthScreenTemplate/AuthScreenTemplate";


// =================================================================
// LOGIN
// =================================================================
const LoginForm = ({
    errorsLogin,
    onLoginDataChange,
    onErrorsLoginChange,
    onLoginPress,
    onForgotPassword,
    onGoogleLogin,
    isLoading
}: {
    errorsLogin: { email: boolean; password: boolean };
    onLoginDataChange: (field: keyof LoginRequest, value: string) => void;
    onErrorsLoginChange: (field: keyof typeof errorsLogin, value: boolean) => void;
    onLoginPress: () => void;
    onForgotPassword: () => void;
    onGoogleLogin: () => void;
    isLoading?: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <VStack space="xl" className="w-full px-6">
            <VStack space="lg" className="w-full">
                <FormField
                    label="Email"
                    placeholder="markomarkovic@gmail.com"
                    iconName="Mail"
                    helperText={t('auth.errors.emailError')}
                    errorText={t('auth.errors.emailError')}
                    isInvalid={errorsLogin.email}
                    onChangeText={(value) => {
                        onLoginDataChange('email', value);
                        onErrorsLoginChange('email', false);
                    }}
                />

                <FormField
                    label={t('auth.login.password')}
                    placeholder="••••••••"
                    type="password"
                    iconName="Lock"
                    helperText={t('auth.errors.passwordLengthError')}
                    errorText={t('auth.errors.passwordLengthError')}
                    isInvalid={errorsLogin.password}
                    onChangeText={(value) => {
                        onLoginDataChange('password', value);
                        onErrorsLoginChange('password', false);
                    }}
                />
            </VStack>

            <LoginButton
                title={t('auth.login.loginButton')}
                onPress={onLoginPress}
                className="mt-2"
                loadingTitle={t('auth.login.loadingTitle')}
                isLoading={isLoading}
            />

            <TouchableOpacity
                onPress={onForgotPassword}
                className="self-center mt-1"
                activeOpacity={0.6}
            >
                <Label text={t('auth.login.forgotPassword')} color={Colors.primary} className="font-semibold text-center text-sm" />
            </TouchableOpacity>

            <LabelSeparator label={t('auth.orSeparator')} />
            <GoogleButton onPress={onGoogleLogin} />
        </VStack>
    );
};


// =================================================================
// REGISTER
// =================================================================
const RegisterForm = ({
    registerData,
    errorsRegister,
    onRegisterDataChange,
    onErrorsRegisterChange,
    onRegisterPress,
    onGoogleLogin,
    isLoading
}: {
    registerData: RegisterRequest;
    errorsRegister: { name: boolean; surname: boolean; email: boolean; password: boolean; repeatPassword: boolean; jib: boolean, address: boolean };
    onRegisterDataChange: (field: keyof RegisterRequest, value: string) => void;
    onErrorsRegisterChange: (field: keyof typeof errorsRegister, value: boolean) => void;
    onRegisterPress: () => void;
    onGoogleLogin: () => void;
    isLoading?: boolean;
}) => {
    const { t } = useTranslation();

    const validateRegisterForm = (): boolean => {
        const newErrors = {
            name: registerData.name.length < 2,
            surname: registerData.surname.length < 2,
            email: registerData.email.length < 6,
            password: registerData.password.length < 8,
            repeatPassword: registerData.repeatPassword !== registerData.password,
            jib: registerData.jib.length !== 13 || !/^\d+$/.test(registerData.jib),
            address: registerData.address.length < 10,
        };

        onErrorsRegisterChange('all', newErrors); // handle this in parent
        return !Object.values(newErrors).some(error => error);
    };

    const handleRegisterPress = () => {
        const isValid = validateRegisterForm();
        if (!isValid) return;
        onRegisterPress();
    };

    return (
        <VStack space="lg" className="w-full px-6">
            <FormField
                label={t('auth.register.firstName')}
                placeholder="Marko"
                type="text"
                iconName="User"
                isInvalid={errorsRegister.name}
                onChangeText={(value) => {
                    onRegisterDataChange('name', value);
                    onErrorsRegisterChange('name', false);
                }}
            />
            <FormField
                label={t('auth.register.lastName')}
                placeholder="Marković"
                type="text"
                iconName="User"
                isInvalid={errorsRegister.surname}
                onChangeText={(value) => {
                    onRegisterDataChange('surname', value);
                    onErrorsRegisterChange('surname', false);
                }}
            />
            <FormField
                label="Email"
                placeholder="markomarkovic@gmail.com"
                iconName="Mail"
                helperText={t('auth.errors.emailError')}
                errorText={t('auth.errors.emailError')}
                isInvalid={errorsRegister.email}
                onChangeText={(value) => {
                    onRegisterDataChange('email', value);
                    onErrorsRegisterChange('email', false);
                }}
            />
            <FormField
                label={t('auth.register.password')}
                placeholder="••••••••"
                type="password"
                iconName="Lock"
                helperText={t('auth.errors.passwordLengthError')}
                errorText={t('auth.errors.passwordLengthError')}
                isInvalid={errorsRegister.password}
                onChangeText={(value) => {
                    onRegisterDataChange('password', value);
                    onErrorsRegisterChange('password', false);
                }}
            />
            <FormField
                label={t('auth.register.repeatPassword')}
                placeholder="••••••••"
                type="password"
                iconName="Lock"
                helperText={t('auth.errors.passwordLengthError')}
                errorText={t('auth.errors.passwordMismatchError')}
                isInvalid={errorsRegister.repeatPassword}
                onChangeText={(value) => {
                    onRegisterDataChange('repeatPassword', value);
                    onErrorsRegisterChange('repeatPassword', false);
                }}
            />
            <FormField
                label="JIB"
                placeholder="123456789123"
                iconName="Briefcase"
                helperText={t('auth.errors.jibLengthError')}
                errorText={t('auth.errors.jibLengthError')}
                isInvalid={errorsRegister.jib}
                onChangeText={(value) => {
                    // Allow only numbers and limit to 13 characters
                    const numericValue = value.replace(/[^0-9]/g, '');
                    onRegisterDataChange('jib', numericValue);
                    onErrorsRegisterChange('jib', false);
                }}
            />

            <FormField
                label={t('auth.register.address')}
                placeholder={t('auth.register.addressPlaceholder')}
                iconName="House"
                isInvalid={errorsRegister.address}
                onChangeText={(value) => {
                    onRegisterDataChange('address', value);
                    onErrorsRegisterChange('address', false);
                }}
            />

            <LoginButton
                title={t('auth.register.registerButton')}
                onPress={handleRegisterPress}
                className="mt-4"
                loadingTitle={t('auth.register.loadingTitle')}
                isLoading={isLoading}
            />

            <LabelSeparator label={t('auth.orSeparator')} />

            <GoogleButton onPress={onGoogleLogin} />
        </VStack>
    );
};


export default function AuthScreen() {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const { t } = useTranslation();
    const { login, register, isLoggingIn, isRegistering } = useAuth();
    
    // TODO: Maybe integrate later with react-hook-form library...
    const [loginData, setLoginData] = useState<LoginRequest>({
        email: "",
        password: ""
    });
    const [errorsLogin, setErrorsLogin] = useState({
        email: false,
        password: false,
    });

    const [registerData, setRegisterData] = useState<RegisterRequest>({
        name: "",
        surname: "",
        email: "",
        password: "",
        repeatPassword: "",
        jib: "",
        address: ""
    });
    const [errorsRegister, setErrorsRegister] = useState({
        name: false,
        surname: false,
        email: false,
        password: false,
        repeatPassword: false,
        jib: false,
        address: false,
    });

    // TODO: wait for backend
    const onForgotPassword = async () => {
        // forgot password logic
    };

    const onGoogleLogin = async () => {
        try {
            // Google login logic
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    };


    // Handler functions
    const handleLoginDataChange = (field: keyof LoginRequest, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };

    const handleErrorsLoginChange = (field: keyof typeof errorsLogin | 'all', value: any) => {
        if (field === 'all') {
            setErrorsLogin(value);
        } else {
            setErrorsLogin(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleRegisterDataChange = (field: keyof RegisterRequest, value: string) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
    };

    const handleErrorsRegisterChange = (field: keyof typeof errorsRegister | 'all', value: any) => {
        if (field === 'all') {
            setErrorsRegister(value);
        } else {
            setErrorsRegister(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleLoginPress = async () => {
        const emailInvalid = loginData.email.length < 6;
        const passwordInvalid = loginData.password.length < 2;

        setErrorsLogin({
            email: emailInvalid,
            password: passwordInvalid,
        });

        if (emailInvalid || passwordInvalid) return;
        login(loginData);
    };

    const handleRegisterPress = async () => {
        register(registerData);
    };


    const authForm = (
        <VStack space="lg" className="w-full pt-8 items-center">
            <AuthSwitcher onModeChange={setAuthMode} initialMode="login" />
            <View className="w-full mt-6">
                {authMode === 'login' ? (
                    <LoginForm
                        errorsLogin={errorsLogin}
                        onLoginDataChange={handleLoginDataChange}
                        onErrorsLoginChange={handleErrorsLoginChange}
                        onLoginPress={handleLoginPress}
                        onForgotPassword={onForgotPassword}
                        onGoogleLogin={onGoogleLogin}
                        isLoading={isLoggingIn}
                    />
                ) : (
                    <RegisterForm
                        registerData={registerData}
                        errorsRegister={errorsRegister}
                        onRegisterDataChange={handleRegisterDataChange}
                        onErrorsRegisterChange={handleErrorsRegisterChange}
                        onRegisterPress={handleRegisterPress}
                        onGoogleLogin={onGoogleLogin}
                        isLoading={isRegistering}
                    />
                )}
            </View>
        </VStack>
    );

    return (
        <AuthScreenTemplate 
            authForm={authForm}
        />
    );
}