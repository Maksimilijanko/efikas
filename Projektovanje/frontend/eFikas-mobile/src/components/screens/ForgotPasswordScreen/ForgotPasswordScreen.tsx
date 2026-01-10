import { Colors } from "@/src/styles/style";
import { ResetPasswordValidation } from "@/src/util/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { BasicButton } from "../../atoms/BasicButton/BasicButton";
import InputOtp from "../../atoms/InputOtp/InputOtp";
import { Label } from "../../atoms/Label/Label";
import FormField from "../../molecules/FormField/FormField";
import Stepper, { CustomProgressStepProps } from "../../organisms/Stepper/Stepper";
import AuthScreenTemplate from "../../templates/AuthScreenTemplate/AuthScreenTemplate";
import { HStack } from "../../ui/hstack";
import { VStack } from "../../ui/vstack";
import { styles } from "./index.styles";
import { useEffect, useState } from "react";
import { toastService } from "@/src/services/toastService";

export default function ForgotPasswordScreen() {
	const RESEND_OTP_SECONDS = 30;
	const { t } = useTranslation();
	const { control, handleSubmit, reset, formState: { errors } } = useForm<ResetPasswordValidation.FormValues>({
		resolver: zodResolver(ResetPasswordValidation.schema),
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: ""
		},
	});
	const [activeStep, setActiveStep] = useState(0);


	const [resendTimer, setResendTimer] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [otpCode, setOtpCode] = useState("");

	useEffect(() => {
		if (resendTimer === 0) {
			setIsResendDisabled(false);
			return;
		}

		const interval = setInterval(() => {
			setResendTimer(prev => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [resendTimer]);


	//#region HANDLERS
	const activateOtpTimeout = () => {
		setIsResendDisabled(true);
		setResendTimer(RESEND_OTP_SECONDS);
	}

	const onSendOtp = () => {
		setActiveStep(1);
		//activateOtpTimeout();
	}

	const onVerifyOtp = () => {
		if (otpCode.length !== 6) {
			toastService.error("Unesite ispravan OTP kôd");
			return;
		}

		// Call backend verification here...
		console.log("Verifying OTP:", otpCode);

		setActiveStep(2);
	}

	const sendOtpAgain = () => {
		toastService.info("OTP poslat ponovo");

		// Calling backend resend OTP here...

		activateOtpTimeout();
	}

	const onSubmit = (data: ResetPasswordValidation.FormValues) => {
		console.log(`Reset password data: ${data}`);
		reset();
	}

	const onResetPassword = () => {
		handleSubmit(onSubmit)()
	}

	//#endregion


	//#region FORMS
	const sendOtpForm = (
		<VStack style={styles.root}>
			<VStack>
				<Label text="Unesite Vaš email kako biste resetovali lozinku." />
				<Label text="Nakon unosa, dobićete jednokratni OTP kôd putem SMS-a." size="sm" color={Colors.tertiary} />
			</VStack>
			
			<VStack style={styles.emailFormContainer}>
				<FormField control={control} name={"email"} label="Email" placeholder="marko.markovic@gmail.com" iconName="Mail" />
				<BasicButton title="Pošalji OTP" onPress={onSendOtp} className="rounded-[10px] w-[100%]"  />
			</VStack>
		</VStack>
	);

	const verifyOtpForm = (
		<VStack style={styles.root}>
			<VStack>
				<Label text="Unesite OTP kôd koji ste dobili" />
				
			</VStack>

			<VStack style={styles.emailFormContainer}>
				<InputOtp onCompleteOtp={setOtpCode} />
				<BasicButton title="Verifikuj OTP" onPress={onVerifyOtp} className="rounded-[10px] w-[100%]" disabled={otpCode.length !== 6} />
			</VStack>

			<HStack style={styles.sendOtpAgainContainer}>
				<Label text="Niste još dobili OTP kôd?" size="sm" color={Colors.tertiary} />
				<TouchableOpacity
					onPress={sendOtpAgain}
					activeOpacity={0.4}
					disabled={isResendDisabled}
				>
					<Label
						size="sm"
						text={
							isResendDisabled
								? `Pošalji ponovo (${resendTimer}s)`
								: "Pošalji ponovo"
						}
						color={isResendDisabled ? Colors.tertiary : Colors.primary}
						className={isResendDisabled ? "" : "underline"}
					/>
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
				<BasicButton title="Resetuj lozinku" onPress={onResetPassword} className="rounded-[10px] w-[100%]" />
			</VStack>
		</VStack>
	);
	//#endregion

	const STEPPER_CONFIG: CustomProgressStepProps[] = [
		{ label: "Slanje OTP", buttonNextText: "Sljedeće", buttonPreviousText: "Nazad", componentToRender: sendOtpForm, onPreviousStep: () => setActiveStep(0), onNextStep: () => setActiveStep(1) },
		{ label: "Verifikacija OTP", buttonNextText: "Sljedeće", buttonPreviousText: "Nazad", componentToRender: verifyOtpForm, onPreviousStep: () => setActiveStep(0), onNextStep: () => setActiveStep(2) },
		{ label: "Reset lozinke", buttonNextText: "Sljedeće", buttonPreviousText: "Nazad", componentToRender: resetPasswordForm, onPreviousStep: () => setActiveStep(1), onNextStep: () => setActiveStep(2) }
	];

	const test = (
		<View style={{flex: 1, }}>
			<Stepper progressSteps={STEPPER_CONFIG} activeStep={activeStep} />
		</View>
		
	);

	return (
		<AuthScreenTemplate authForm={test} />
	);
}