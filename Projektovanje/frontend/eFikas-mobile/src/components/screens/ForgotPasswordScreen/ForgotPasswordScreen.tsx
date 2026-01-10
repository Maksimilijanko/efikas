import { useTranslation } from "react-i18next";
import FormField from "../../molecules/FormField/FormField";
import AuthScreenTemplate from "../../templates/AuthScreenTemplate/AuthScreenTemplate";
import { VStack } from "../../ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPasswordValidation } from "@/src/util/validationSchemas";
import { styles } from "./index.styles";
import { Label } from "../../atoms/Label/Label";
import { BasicButton } from "../../atoms/BasicButton/BasicButton";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Colors } from "@/src/styles/style";
import { HStack } from "../../ui/hstack";
import InputOtp from "../../atoms/InputOtp/InputOtp";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

export default function ForgotPasswordScreen() {
	const { t } = useTranslation();
	const { control, handleSubmit, reset, formState: { errors } } = useForm<ResetPasswordValidation.FormValues>({
		resolver: zodResolver(ResetPasswordValidation.schema),
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: ""
		},
	});


	const sendOtpForm = (
		<VStack style={styles.root}>
			<VStack>
				<Label text="Unesite Vaš email kako biste resetovali lozinku." />
				<Label text="Nakon unosa, dobićete jednokratni OTP kôd putem SMS-a." size="sm" color={Colors.tertiary} />
			</VStack>
			
			<VStack style={styles.emailFormContainer}>
				<FormField control={control} name={"email"} label="Email" placeholder="marko.markovic@gmail.com" iconName="Mail" />
				<BasicButton title="Pošalji OTP" onPress={() => {}} className="rounded-[10px] w-[100%]" />
			</VStack>
		</VStack>
	);

	const verifyOtpForm = (
		<VStack style={styles.root}>
			<VStack>
				<Label text="Unesite OTP kôd koji ste dobili" />
				
			</VStack>

			<VStack style={styles.emailFormContainer}>
				<InputOtp />
				<BasicButton title="Verifikuj OTP" onPress={() => {}} className="rounded-[10px] w-[100%]" />
			</VStack>

			<HStack style={styles.sendOtpAgainContainer}>
				<Label text="Niste još dobili OTP kôd?" size="sm" color={Colors.tertiary} />
				<TouchableOpacity
					onPress={() => {}}
					activeOpacity={0.4}
				>
					<Label size="sm" text={"Pošalji ponovo"} color={Colors.primary} className="underline"  />
				</TouchableOpacity>
			</HStack>
		</VStack>
	);

	const resetPasswordForm = (
		<VStack style={styles.root}>
			<VStack>
				<Label text="Postavite novu lozinku" />
			</VStack>
			
			<VStack style={styles.emailFormContainer}>
				<FormField control={control} name={"password"} type="password" label="Nova lozinka" placeholder="••••••••" iconName="Lock" />
				<FormField control={control} name={"repeatPassword"} type="password" label="Ponovite lozinku" placeholder="••••••••" iconName="Lock" />
				<BasicButton title="Resetuj lozinku" onPress={() => {}} className="rounded-[10px] w-[100%]" />
			</VStack>
		</VStack>
	);

	const test = (
		<View style={{flex: 1}}>
			<ProgressSteps>
				<ProgressStep label="Slanje OTP">
					{sendOtpForm}
				</ProgressStep>
				<ProgressStep label="Verifikacija OTP">
					{verifyOtpForm}
				</ProgressStep>
				<ProgressStep label="Reset lozinke">
					{resetPasswordForm}
				</ProgressStep>
			</ProgressSteps>
		</View>
		
	);

	return (
		<AuthScreenTemplate authForm={test} />
	);
}