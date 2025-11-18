import { VStack } from "@/components/ui/vstack";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import LabeledTextField from "../../molecules/LabeledTextField/LabeledTextField";
import { useState } from "react";
import { LoginButton } from "../../atoms/LoginButton/LoginButton";
import GoogleButton from "../../atoms/GoogleButton";
import LabelSeparator from "../../atoms/LabelSeparator/LabelSeparator";
import { TouchableOpacity } from "react-native";
import { Label } from "../../atoms/Label/Label";
import { Colors } from "@/src/styles/style";
import { LoginRequest } from "@/src/types/types";
import { Icon } from "../../atoms/Icon/Icon";
import AuthScreenTemplate from "../../templates/AuthScreenTemplate/AuthScreenTemplate";

export default function LoginScreen() {
    const [isInvalid, setIsInvalid] = useState(false);

    const onLogin = (loginRequest: LoginRequest) => {

    }
    
    const onRegister = () => {

    }

    const onForgotPassword = () => {

    }

    const onGoogleLogin = () => {

    }

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
                        <FormControlErrorIcon as={ <Icon name="OctagonAlert" /> } className="text-red-500" />
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
                        <FormControlErrorIcon as={ <Icon name="OctagonAlert" /> } className="text-red-500" />
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

    

    return(
        <AuthScreenTemplate 
            authForm={<LoginForm />}
            onLogin={onLogin}
            onRegister={onRegister}
            onForgotPassword={onForgotPassword}
            onGoogleLogin={onGoogleLogin}
        />
    );
}