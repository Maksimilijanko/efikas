import { VStack } from "@/src/components/ui/vstack";
import { useAuth } from "@/src/hooks/useAuth";
import { Colors } from "@/src/styles/style";
import { LoginRequest, LucideIconName, RegisterRequest } from "@/src/types/types";
import { LoginValidation, RegistrationValidation } from "@/src/util/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Path, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { GoogleButton } from "../../atoms/GoogleButton";
import { Label } from "../../atoms/Label/Label";
import LabelSeparator from "../../atoms/LabelSeparator/LabelSeparator";
import { LoginButton } from "../../atoms/LoginButton/LoginButton";
import AuthSwitcher from "../../molecules/AuthSwitcher/AuthSwitcher";
import FormField from "../../molecules/FormField/FormField";
import AuthScreenTemplate from "../../templates/AuthScreenTemplate/AuthScreenTemplate";
import { router } from "expo-router";



// =================================================================
// LOGIN
// =================================================================
const LoginForm = ({
    onLoginPress,
    onForgotPassword,
    onGoogleLogin,
    isLoading
}: {
    onLoginPress: (data: LoginValidation.FormValues) => void;
    onForgotPassword: () => void;
    onGoogleLogin: () => void;
    isLoading?: boolean;
}) => {
    const { t } = useTranslation();
	const { control, handleSubmit, reset, formState: { errors } } = useForm<LoginValidation.FormValues>({
		resolver: zodResolver(LoginValidation.schema),
		defaultValues: {
			email: "",
			password: ""
		},
	});

	const renderLoginField = (
		label: string, 
		name: Path<LoginValidation.FormValues>, 
		placeholder: string, 
		helperText: string,
		type: 'text' | 'password',
		iconName: LucideIconName
	) => {
		return(
			<FormField
				control={control}
				name={name}
				label={label}
				placeholder={t(placeholder)}
				helperText={helperText}
				type={type}
				iconName={iconName}
				isInvalid={false}
			/>
		);
	}

	const onSubmit = (data: LoginValidation.FormValues) => {
		onLoginPress(data);
		reset();
	}

    return (
        <VStack space="xl" className="w-full px-6">
            <VStack space="lg" className="w-full">
				{renderLoginField("Email", 'email', 'markomarkovic@gmail.com', t('auth.errors.emailError'), 'text', "Mail")}
				{renderLoginField(t('auth.login.password'), 'password', '••••••••', t('auth.errors.passwordLengthError'), 'password', "Lock")}
            </VStack>

            <LoginButton
                title={t('auth.login.loginButton')}
                onPress={() => handleSubmit(onSubmit)()}
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
    onRegisterPress,
    onGoogleLogin,
    isLoading
}: {
    onRegisterPress: (data: RegistrationValidation.FormValues) => void;
    onGoogleLogin: () => void;
    isLoading?: boolean;
}) => {
    const { t } = useTranslation();

	const { control, handleSubmit, reset, formState: { errors } } = useForm<RegistrationValidation.FormValues>({
		resolver: zodResolver(RegistrationValidation.schema),
		defaultValues: {
			email: "",
			password: ""
		},
	});


	const renderRegisterField = (
		label: string, 
		name: Path<RegistrationValidation.FormValues>, 
		placeholder: string, 
		helperText: string | undefined,
		type: 'text' | 'password',
		iconName: LucideIconName
	) => {
		return(
			<FormField
				control={control}
				name={name}
				label={label}
				placeholder={t(placeholder)}
				helperText={helperText}
				type={type}
				iconName={iconName}
				isInvalid={false}
			/>
		);
	}

	const onSubmit = (data: RegistrationValidation.FormValues) => {
		onRegisterPress(data);
		reset();
	}

    return (
        <VStack space="lg" className="w-full px-6">
			{renderRegisterField(t('auth.register.firstName'), 'name', 'Marko', undefined, 'text', "User")}
            {renderRegisterField(t('auth.register.lastName'), 'surname', 'Marković', undefined, 'text', "User")}
			{renderRegisterField('Email', 'email', 'marko.markovic@gmail.com', undefined, 'text', "Mail")}
			{renderRegisterField(t('auth.register.password'), 'password', '••••••••', t('auth.errors.passwordLengthError'), 'password', "Lock")}
			{renderRegisterField(t('auth.register.repeatPassword'), 'repeatPassword', '••••••••', t('auth.errors.passwordLengthError'), 'password', "Lock")}
			{renderRegisterField("JMBG", 'jmbg', '1234567891234', t('auth.errors.jmbgLengthError'), 'text', "Briefcase")}
			{renderRegisterField(t('auth.register.address'), 'address', 'Ulica 123', undefined, 'text', "House")}

            <LoginButton
                title={t('auth.register.registerButton')}
                onPress={() => handleSubmit(onSubmit)()}
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
    
    // TODO: wait for backend
    const onForgotPassword = async () => {
        router.push('/(auth)/forgotPassword');
    };

    const onGoogleLogin = async () => {
        try {
            // Google login logic
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    };

    const handleLoginPress = async (data: LoginValidation.FormValues) => {
		const request: LoginRequest = {
			email: data.email,
			password: data.password
		}

        login(request);
    };

    const handleRegisterPress = async (data: RegistrationValidation.FormValues) => {
		const request: RegisterRequest = {
			name: data.name,
			surname: data.surname,
			email: data.email,
			password: data.password,
			repeatPassword: data.repeatPassword,
			jmbg: data.jmbg,
			address: data.address
		}

        register(request);
    };


    const authForm = (
        <VStack space="lg" className="w-full pt-8 items-center">
            <AuthSwitcher onModeChange={setAuthMode} initialMode="login" />
            <View className="w-full mt-6">
                {authMode === 'login' ? (
                    <LoginForm
                        onLoginPress={handleLoginPress}
                        onForgotPassword={onForgotPassword}
                        onGoogleLogin={onGoogleLogin}
                        isLoading={isLoggingIn}
                    />
                ) : (
                    <RegisterForm
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