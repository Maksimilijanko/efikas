import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText } from "@/components/ui/form-control";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/src/styles/style";
import { LoginRequest, RegisterRequest } from "@/src/types/types";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { GoogleButton } from "../../atoms/GoogleButton";
import { Icon } from "../../atoms/Icon/Icon";
import { Label } from "../../atoms/Label/Label";
import LabelSeparator from "../../atoms/LabelSeparator/LabelSeparator";
import { LoginButton } from "../../atoms/LoginButton/LoginButton";
import AuthSwitcher from "../../molecules/AuthSwitcher/AuthSwitcher";
import LabeledTextField from "../../molecules/LabeledTextField/LabeledTextField";
import AuthScreenTemplate from "../../templates/AuthScreenTemplate/AuthScreenTemplate";

export default function AuthScreen() {
    const [isInvalid, setIsInvalid] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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

    const LoginForm = () => (
        <VStack space="xl" className="w-full px-6">
            <VStack space="lg" className="w-full">
                <FormControl
                    isInvalid={isInvalid}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={true}
                >
                <LabeledTextField
                    label="Email"
                    placeholder="markomarkovic@gmail.out"
                    iconLocation="left"
                    type="text"
                    iconName="Mail"
                />
                
                <FormControlHelper>
                    <FormControlHelperText>
                        Email mora biti bar 6 karaktera
                    </FormControlHelperText>
                </FormControlHelper>
                
                <FormControlError>
                    <FormControlErrorIcon as={<Icon name="OctagonAlert" />} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        Email mora biti bar 6 karaktera
                    </FormControlErrorText>
                </FormControlError>
                </FormControl>

                <FormControl
                    isInvalid={isInvalid}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={true}
                >
                <LabeledTextField
                    label="Password"
                    placeholder="•••••••••"
                    iconLocation="left"
                    type="password"
                    iconName="Lock"
                />
                
                <FormControlHelper>
                    <FormControlHelperText>
                        Lozinka mora biti bar 6 karaktera
                    </FormControlHelperText>
                </FormControlHelper>
                
                <FormControlError>
                    <FormControlErrorIcon as={<Icon name="OctagonAlert" />} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        Lozinka mora biti bar 6 karaktera
                    </FormControlErrorText>
                </FormControlError>
                </FormControl>
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
                <Label text="Zaboravljena lozinka" color={Colors.primary} className="font-semibold text-center text-sm" />
            </TouchableOpacity>

            <LabelSeparator label="ili" />

            <GoogleButton onPress={onGoogleLogin} />
        </VStack>
    );

    const RegisterForm = () => {
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
                    label="Lozinka"
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
                    label="Ponovi lozinku"
                    placeholder="Ponovi lozinku"
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