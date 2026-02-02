import { Edit2 } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
	Keyboard,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';

import { DialogButton } from '@/src/components/atoms/DialogButton/DialogButton';
import { Label } from '@/src/components/atoms/Label/Label';
import TextField from '@/src/components/atoms/TextField/TextField';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter } from '@/src/components/ui/modal';
import { Colors } from '@/src/styles/style';
import LabeledTextField from '@/src/components/molecules/LabeledTextField/LabeledTextField';
import { dateService } from '@/src/services/dateService';
import DateTimePicker from '../../DateTimePicker/DateTimePicker';
import { Icon } from '@/src/components/atoms/Icon/Icon';
import { IconButton } from '@/src/components/atoms/IconButton/IconButton';
import { ApartmentTaskDTO } from '@/src/types/types';
import { useTheme } from '@/src/providers/ThemeProvider';

const MAX_CHAR_LIMIT = 150;
const TEXT_AREA_HEIGHT = 180;

interface TasksDialogProps {
	visible: boolean;
	onConfirm: (data: ApartmentTaskDTO) => void;
	onClose: () => void;
}

export const TasksDialog: React.FC<TasksDialogProps> = ({
	visible,
	onClose,
	onConfirm,
}) => {
	const { Colors } = useTheme();
	const [zadatak, setZadatak] = useState('');
	const [napomena, setNapomena] = useState('');
	const [datum, setDatum] = useState<Date>(new Date());
	const [dateDialogVisible, setDateDialogVisible] = useState(false);

	const [keyboardOffset, setKeyboardOffset] = useState(0);
	const { height: screenHeight } = useWindowDimensions();

	const modalHeight = screenHeight * 0.75;
	const dialogWidth = '100%';

	const resetFields = () => {
		setDatum(new Date())
		setZadatak('');
		setNapomena('');
	};

	useEffect(() => {
		if (visible) resetFields();
	}, [visible]);

	useEffect(() => {
		if (!visible) {
			setKeyboardOffset(0);
			return;
		}

		const keyboardDidShowListener = Keyboard.addListener(
			Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
			(e) => {
				setKeyboardOffset(-e.endCoordinates.height * 0.5);
			},
		);
		const keyboardDidHideListener = Keyboard.addListener(
			Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
			() => {
				setKeyboardOffset(0);
			},
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, [visible]);

	const styles = useMemo(() => createStyles(Colors), [Colors]);

	const handleConfirm = () => {

		const payload: ApartmentTaskDTO = {
			name: zadatak,
			note: napomena,
			status: false,
			dateTime: datum.toISOString()
		}

		onConfirm(payload);
		resetFields();
		onClose();
	};

	const handleCancel = () => {
		resetFields();
		onClose();
	};

	const handleIconPress = () => {
		console.log('Kliknuta ikona olovke u napomeni za zadatke!');
	};

	const confirmDateDialog = (value: Date) => {
		console.log("RESERVATION DATE DIALOG VALUE: ", value);
		setDatum(value);
		setDateDialogVisible(false);
	};

	return (
		<Modal isOpen={visible} onClose={handleCancel}>
			<ModalBackdrop />
			<ModalContent style={styles.modalContent}>
				<ModalBody>
					<ScrollView
						showsVerticalScrollIndicator={true}
					>
						<View style={styles.contentArea}>
							<LabeledTextField
								label="Zadatak"
								placeholder={"Unesite naziv zadatka"}
								size="lg"
								labelSize="lg"
								inputProps={{
									onChangeText: setZadatak,
									value: zadatak,
								}}
							/>

							<LabeledTextField
								label="Datum"
								placeholder={"DD.MM.GGGG hh:mm"}
								size="lg"
								labelSize="lg"
								inputProps={{
									value: dateService.formatLocalDateTime(datum)
								}}
								rightElement={
									<IconButton
										iconName="CalendarPlus"
										onPress={() => setDateDialogVisible(true)}
										color="gray"
									/>
								}
							/>
							<DateTimePicker
								visible={dateDialogVisible}
								initialValue={new Date()}
								timePicker={true}
								onClose={() => setDateDialogVisible(false)}
								onConfirm={confirmDateDialog}
							/>


							<Label text="Napomena" color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
							<View style={styles.textAreaWrapper}>
								<TextField
									placeholder="Unesite dodatne detalje..."
									variant="outline"
									size="md"
									style={styles.textAreaFieldStyle}
									inputProps={{
										multiline: true,
										onChangeText: setNapomena,
										value: napomena,
										placeholderTextColor: Colors.tertiary,
										textAlignVertical: 'top',
										maxLength: MAX_CHAR_LIMIT,
										style: {
											paddingRight: 35,
											paddingLeft: 10,
											flex: 1,
											minHeight: TEXT_AREA_HEIGHT,
											textAlign: 'left',
											writingDirection: 'ltr',
										},
									}}
								/>
								<TouchableOpacity
									onPress={handleIconPress}
									style={styles.textAreaIconStyleFixed}
									hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								>
									<Edit2 size={20} color={Colors.textSecondary} />
								</TouchableOpacity>
							</View>

							<View style={styles.charCounterContainer}>
								<Text style={styles.charCounterText}>
									{napomena.length}/{MAX_CHAR_LIMIT}
								</Text>
							</View>
						</View>
					</ScrollView>
				</ModalBody>

				<ModalFooter>
					<View style={styles.buttonContainer}>
						<View style={styles.buttonWrapper}>
							<DialogButton title="Potvrdi" onPress={handleConfirm} />
						</View>
						<View style={styles.buttonWrapper}>
							<DialogButton title="Odustani" onPress={handleCancel} />
						</View>
					</View>
				</ModalFooter>
				
			</ModalContent>
		</Modal>
	);
};

const createStyles = (Colors: any) => StyleSheet.create({
	modalContent: {
		padding: 0,
		margin: 0,
		backgroundColor: Colors.background,
		maxHeight: 550
	},
	
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 15,
	},
	contentArea: { paddingHorizontal: 25, paddingTop: 15, gap: 10, },

	textAreaWrapper: {
		position: 'relative',
		marginBottom: 0,
		minHeight: TEXT_AREA_HEIGHT,
		backgroundColor: Colors.background,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.secondary,
		shadowColor: Colors.shadowColor,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
		overflow: 'hidden',
	},

	textAreaFieldStyle: {
		borderWidth: 0,
		shadowOpacity: 0,
		paddingTop: 10,
		paddingLeft: 2,
		minHeight: '100%',
	},

	textAreaIconStyleFixed: {
		position: 'absolute',
		right: 5,
		bottom: 5,
		zIndex: 10,
		padding: 5,
	},

	charCounterContainer: {
		alignItems: 'flex-end',
		width: '100%',
		paddingRight: 5,
		paddingTop: 4,
		marginBottom: 10,
	},
	charCounterText: {
		fontSize: 12,
		color: Colors.textSecondary,
	},

	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: 12,
		paddingVertical: 15,
		borderTopWidth: 1,
		borderTopColor: Colors.secondary,
		backgroundColor: Colors.background,
	},
	buttonWrapper: { flex: 1, marginHorizontal: 8 },
});
