import { CreateCashRegisterDTO } from "@/src/api/services/cashRegisterService";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import FormField from "@/src/components/molecules/FormField/FormField";
import { HStack } from "@/src/components/ui/hstack";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/src/components/ui/modal";
import { VStack } from "@/src/components/ui/vstack";
import { useTheme } from "@/src/providers/ThemeProvider";
import { CashRegisterValidation } from "@/src/util/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	View,
} from "react-native";

interface Props {
	visible: boolean;
	onClose: () => void;
	onAdd: (payload: CreateCashRegisterDTO) => Promise<void>;
	isAdding?: boolean;
}

export default function AddCashRegisterDialog({
	visible,
	onClose,
	onAdd,
	isAdding,
}: Props) {
	const { Colors } = useTheme();
	const { t } = useTranslation();

	const [error, setError] = useState<string | null>(null);

	const { control: cashRegisterControl, handleSubmit, reset: resetForm, formState: { errors } } = useForm<CashRegisterValidation.FormValues>({
		resolver: zodResolver(CashRegisterValidation.schema),
		defaultValues: {
			cashRegisterNumber: 0,
			softwareVersion: ''
		},
	});

	const reset = () => {
		resetForm();
		setError(null);
	};

	const handleCancel = useCallback(() => {
		reset();
		onClose();
	}, [onClose]);

	const handleAdd = async (data: CashRegisterValidation.FormValues) => {
		setError(null);

		const payload: CreateCashRegisterDTO = {
			cashRegisterNumber: data.cashRegisterNumber,
			softwareVersion: data.softwareVersion
		}

		try {
			await onAdd(payload);
			reset();
			onClose();
		} catch (err) {
			setError(
				(err as Error)?.message ?? t("cashRegisters.toastMessages.createError")
			);
		}
	};

	const handleAddErrors = (e) => {
		console.log(e);
		setError(
			(e as Error)?.message ?? t("cashRegisters.toastMessages.createError")
		);
	}

	return (
		<Modal isOpen={visible} onClose={handleCancel}>
			<ModalBackdrop />
			<ModalContent
				style={[
					styles.wrapper,
					{ backgroundColor: Colors.background, shadowColor: Colors.shadowColor },
				]}
			>
				<ModalHeader>
					<Text style={[styles.sectionTitle, { color: Colors.tertiary }]}>
						{t("dialogs.cashRegister.title")}
					</Text>
				</ModalHeader>

				<ModalBody style={styles.modalBody}>
					<View style={[styles.modal, { backgroundColor: Colors.background }]}>
						<VStack style={styles.formContainer}>
							<FormField
								control={cashRegisterControl}
								name="cashRegisterNumber"
								required
								size="lg"
								label={t("cashRegisters.fields.number")}
								placeholder={"1115321"}
								type={"text"}
								iconName={"Hash"}
							/>
							<FormField
								control={cashRegisterControl}
								name="softwareVersion"
								required
								size="lg"
								label={t("cashRegisters.fields.version")}
								placeholder={"v1.0.0"}
								type={"text"}
								iconName={"PackagePlus"}
							/>
						</VStack>

						{error ? <Text style={[styles.errorText]}>{error}</Text> : null}
					</View>
				</ModalBody>

				<ModalFooter>
					<HStack style={styles.buttonsRow}>
						<DialogButton title={t("dialogs.cashRegister.cancel")} onPress={handleCancel} />
						<DialogButton title={t("dialogs.cashRegister.add")} onPress={handleSubmit(handleAdd, handleAddErrors)} />
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

const styles = StyleSheet.create({
	wrapper: { 
		width: "90%",
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 20,
        alignItems: "center",
        elevation: 8,
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
	},
	modal: {
		borderRadius: 12,
		padding: 10,
	},
	modalBody: {
        width: '100%',
    },
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 10,
		textAlign: "center",
	},
	formContainer: {
		gap: 20,
		marginBottom: 20
	},
	input: {
		height: 44,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		marginTop: 6,
	},
	errorText: {
		color: "crimson",
		textAlign: 'center'
	},
	buttonsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	buttonWrapper: {
		flex: 1,
	},
});
