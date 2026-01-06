import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import FormField from "@/src/components/molecules/FormField/FormField";
import { HStack } from "@/src/components/ui/hstack";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/src/components/ui/modal";
import { VStack } from "@/src/components/ui/vstack";
import { Colors } from "@/src/styles/style";
import { LucideIconName } from "@/src/types/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

interface Props {
    visible: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function AddStoreDialog({
    visible,
    title,
    onClose,
    onConfirm,
}: Props) {
	const { t } = useTranslation();

	const renderStoreField = (labelTranslationString: string, placeholder: string, iconName: LucideIconName, onChangeText: () => void) => {
		return(
			<FormField
				label={t(labelTranslationString)}
				placeholder={placeholder}
				type="text"
				iconName={iconName}
				isInvalid={false}
				onChangeText={onChangeText}
			/>
		);
	  }

	return (
		<Modal isOpen={visible} onClose={onClose}>
			<ModalBackdrop />
			<ModalContent
                style={[
                    styles.modalContainer,
                    { backgroundColor: Colors.background, shadowColor: Colors.shadowColor },
                ]}
            >
                <ModalHeader>
                    <Text style={[styles.sectionTitle, { color: Colors.tertiary }]}>{title}</Text>
                </ModalHeader>

                <ModalBody style={styles.modalBody}>
					<VStack style={styles.addStoreContainer}>
						{renderStoreField('profile.store.labels.name', 'Naziv', 'Store', () => {})}
						{renderStoreField('profile.store.labels.address', 'Adresa', 'MapPinHouse', () => {})}
						{renderStoreField('profile.store.labels.activity', 'Naziv', 'Briefcase', () => {})}
						{renderStoreField('profile.store.labels.activityCode', 'nn.nn', 'Hash', () => {})}
						{renderStoreField('profile.store.labels.jib', '1234567891234', 'IdCard', () => {})}
					</VStack>
				</ModalBody>

                <ModalFooter style={styles.buttonsContainer}>
                    <HStack style={{ justifyContent: "space-between", width: "100%" }}>
                        <DialogButton title="Cancel" onPress={onClose} />
                        <DialogButton title="Confirm" onPress={() => {onConfirm(); onClose();}} />
                    </HStack>
                </ModalFooter>
            </ModalContent>
		</Modal>
	);
}

const styles = StyleSheet.create({
    modalContainer: {
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
    modalBody: {
        width: '100%',
		height: '45%'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 24,
        textAlign: "left",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginTop: 10,
    },
	addStoreContainer: {
		height: 'auto',
		gap: 10,
		flex: 1
	}
});