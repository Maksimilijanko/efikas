import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import GoogleButton from "../../atoms/GoogleButton";
import LabelSeparator from "../../atoms/LabelSeparator/LabelSeparator";
import { LoginButton } from "../../atoms/LoginButton/LoginButton";
import { Text } from "react-native";
import LabeledTextField from "../../molecules/LabeledTextField/LabeledTextField";
import AuthScreenTemplate from "../../templates/AuthScreenTemplate/AuthScreenTemplate";
import { RegisterRequest } from "@/src/types/types";

export default function RegisterScreen() {

    const onRegister = (registerReguest: RegisterRequest) => {

    }

    const onGoogleLogin = () => {

    }
    
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
    
    return(
        <AuthScreenTemplate 
            authForm={<RegisterForm />}
            authMode="register"
            onRegister={onRegister}
            onGoogleLogin={onGoogleLogin} onLogin={onGoogleLogin} 
        />
    );
}