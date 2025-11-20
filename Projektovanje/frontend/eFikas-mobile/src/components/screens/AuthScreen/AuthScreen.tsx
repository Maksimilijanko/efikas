import { VStack } from "@/components/ui/vstack";
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

export default function AuthScreen() {
    const { t } = useTranslation();
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    
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
        jib: '0',
    });
    const [errorsRegister, setErrorsRegister] = useState({
        name: false,
        surname: false,
        email: false,
        password: false,
        repeatPassword: false,
    });

    const onLogin = (loginRequest: LoginRequest) => {
        // login logic
    };
    
    const onRegister = (registerRequest: RegisterRequest) => {
        // register logic
    };

    const onForgotPassword = () => {
        // forgot password logic
    };

    const onGoogleLogin = async () => {
        try {
            // Google login logic
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    };

    
    // =================================================================
    // LOGIN
    // =================================================================
    const LoginForm = () => {
        const handleLoginPress = () => {
            const emailInvalid = loginData.email.length < 6;
            const passwordInvalid = loginData.password.length < 6;

            setErrorsLogin({
                email: emailInvalid,
                password: passwordInvalid,
            });

            if (emailInvalid || passwordInvalid) return;

            onLogin(loginData);
        };

        return(
            <VStack space="xl" className="w-full px-6">
                <VStack space="lg" className="w-full">
                    <FormField
                        label="Email"
                        placeholder="markomarkovic@gmail.com"
                        iconName="Mail"
                        helperText={ t('auth.errors.emailError') }
                        errorText={ t('auth.errors.emailError') }
                        isInvalid={errorsLogin.email}
                    />

                    <FormField
                        label={ t('auth.login.password') }
                        placeholder="••••••••"
                        type="password"
                        iconName="Lock"
                        helperText={ t('auth.errors.passwordLengthError') }
                        errorText={ t('auth.errors.passwordLengthError') }
                        isInvalid={errorsLogin.password}
                    />
                </VStack>

                <LoginButton
                    title={ t('auth.login.loginButton') }
                    onPress={handleLoginPress}
                    className="mt-2"
                />

                <TouchableOpacity
                    onPress={onForgotPassword}
                    className="self-center mt-1"
                    activeOpacity={0.6}
                >
                    <Label text={ t('auth.login.forgotPassword') } color={Colors.primary} className="font-semibold text-center text-sm" />
                </TouchableOpacity>

                <LabelSeparator label={ t('auth.orSeparator') } />

                <GoogleButton onPress={onGoogleLogin} />
            </VStack>
        );
    }
        


    // =================================================================
    // REGISTER
    // =================================================================
    const RegisterForm = () => {
        const validateRegisterForm = (): boolean => {
            const newErrors = {
                name: registerData.name.length < 2,
                surname: registerData.surname.length < 2,
                email: registerData.email.length < 6,
                password: registerData.password.length < 8,
                repeatPassword: registerData.repeatPassword !== registerData.password,
                jib: registerData.jib.length !== 12
            };

            setErrorsRegister(newErrors);
            
            // Check if any errors exist
            return !Object.values(newErrors).some(error => error);
        };

        const handleRegisterPress = () => {
            const isValid = validateRegisterForm();
            if (!isValid) return;

            onRegister(registerData);
        };

        return (
            <VStack space="lg" className="w-full px-6">
                <FormField
                    label={ t('auth.register.firstName') }
                    placeholder="Marko"
                    type="text"
                    iconName="User"
                    isInvalid={errorsRegister.name}
                />
                <FormField
                    label={ t('auth.register.lastName') }
                    placeholder="Marković"
                    type="text"
                    iconName="User"
                    isInvalid={errorsRegister.surname}
                />
                <FormField
                    label="Email"
                    placeholder="markomarkovic@gmail.com"
                    iconName="Mail"
                    helperText={ t('auth.errors.emailError') }
                    errorText={ t('auth.errors.emailError') }
                    isInvalid={errorsRegister.email}
                />
                <FormField
                    label={ t('auth.register.password') }
                    placeholder="••••••••"
                    type="password"
                    iconName="Lock"
                    helperText={ t('auth.errors.passwordLengthError') }
                    errorText={ t('auth.errors.passwordLengthError') }
                    isInvalid={errorsRegister.password}
                />
                <FormField
                    label={ t('auth.register.repeatPassword') }
                    placeholder="••••••••"
                    type="password"
                    iconName="Lock"
                    helperText={ t('auth.errors.passwordLengthError') }
                    errorText={ t('auth.errors.passwordLengthError') }
                    isInvalid={errorsRegister.repeatPassword}
                />
                <FormField
                    label="JIB"
                    placeholder="123456789123"
                    iconName="Briefcase"
                    helperText="JIB mora biti 12 karaktera"
                    errorText="JIB mora biti 12 karaktera"
                    isInvalid={errorsRegister.email}
                />

                <LoginButton
                    title={ t('auth.register.registerButton') }
                    onPress={handleRegisterPress}
                    className="mt-4"
                />

                <LabelSeparator label={ t('auth.orSeparator') } />

                <GoogleButton onPress={onGoogleLogin} />
            </VStack>
        );
    };

    const authForm = (
        <VStack space="lg" className="w-full pt-8 items-center">
            <AuthSwitcher onModeChange={setAuthMode} initialMode="login" />
            <View className="w-full mt-6">
                {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
            </View>    
        </VStack>
        
    );

    return (
        <AuthScreenTemplate 
            authForm={authForm}
        />
    );
}