import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import getStyles from './index.styles';
import { useTheme } from "@/src/providers/ThemeProvider";

import { BookkeepingMode, BookPath, DateRangeDTO } from '@/src/types/types';
import { router } from 'expo-router';
import BookkeepingSwitcher from '../../molecules/BookkeepingSwitcher/BookkeepingSwitcher';
import { VStack } from '../../ui/vstack';
import DownloadedBooksList from '../../organisms/DownloadedBooksList/DownloadedBooksList';
import { GuestBookType } from '@/src/types/enums';
import LabeledTextField from '../../molecules/LabeledTextField/LabeledTextField';
import { dateService } from '@/src/services/dateService';
import { useTranslation } from 'react-i18next';

import DateTimePicker from '@react-native-community/datetimepicker';
import { HStack } from '../../ui/hstack';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { DocumentType } from '../../molecules/DocumentItem/DocumentItem';



export type DocumentsDownloadTemplateProps = {
	documentItemComponent: React.ComponentType<{
		title: string;
		documentType: DocumentType;
		onPress?: () => void;
		onDownloadPress?: () => void;
	}>;
	documentsData: { id: string; title: string; documentType: DocumentType; }[];
	datePickersContent?: React.ReactNode;
	pdfPath: string | null;
	isDownloading: boolean;
	bookPaths?: BookPath[];
	isLoadingBooks?: boolean;
	areGuests?: boolean;
	streamPDF?: (dateFormVisible: boolean, period: DateRangeDTO) => void;
	streamPDFGuests?: (type: GuestBookType, dateFormVisible: boolean, period: DateRangeDTO) => void;
	downloadPDF?: (dateFormVisible: boolean, period: DateRangeDTO) => void;
	downloadPDFGuests?: (type: GuestBookType, dateFormVisible: boolean, period: DateRangeDTO) => void;
	bookkeepingModeChange?: (mode: BookkeepingMode) => void;
};


const DocumentsDownloadTemplate: React.FC<DocumentsDownloadTemplateProps> = ({
	documentItemComponent: ItemComponent,
	documentsData,
	pdfPath,
	isDownloading,
	bookPaths,
	isLoadingBooks,
	areGuests = false,
	streamPDF,
	streamPDFGuests,
	downloadPDF,
	downloadPDFGuests,
}) => {
	const { t } = useTranslation();
	const { Colors } = useTheme();
	const styles = getStyles(Colors);
	const [fromDate, setFromDate] = useState<Date | null>(new Date());
	const [toDate, setToDate] = useState<Date | null>(new Date());
	const [showFromDatePicker, setShowFromDatePicker] = useState(false);
	const [showToDatePicker, setShowToDatePicker] = useState(false);
	const [bookkeepingMode, setBookkeepingMode] = useState<BookkeepingMode>('yearly');
	const dateFormVisible = bookkeepingMode === 'custom';
	const GUEST_BOOK_MAP: Record<string, GuestBookType> = {
		'3': GuestBookType.DOMESTIC_GUESTS,
		'4': GuestBookType.FOREIGN_GUESTS,
	};

	const handleDocumentSelect = (id: string) => {
		const period: DateRangeDTO = {
			from: dateService.formatBackendDate(fromDate),
			to: dateService.formatBackendDate(toDate),
		};

		if (!areGuests) {
			streamPDF?.(dateFormVisible, period);
		} else {
			const type = GUEST_BOOK_MAP[id];
			if (!type) return;
			streamPDFGuests?.(type, dateFormVisible, period);
		}
	};

	const handleDownload = (id: string) => {
		const period: DateRangeDTO = {
			from: dateService.formatBackendDate(fromDate),
			to: dateService.formatBackendDate(toDate),
		};

		if (!areGuests) {
			downloadPDF?.(dateFormVisible, period);
		} else {
			const type = GUEST_BOOK_MAP[id];
			if (!type) return;
			downloadPDFGuests?.(type, dateFormVisible, period);
		}
	};

	useEffect(() => {
		if (pdfPath && !isDownloading) {
			router.push({
				pathname: '/pdfView',
				params: {
					uri: `${pdfPath}`
				}
			});
		}
	}, [pdfPath, isDownloading]);

	const onFromDateChange = (event, selectedDate: Date) => {
		setShowFromDatePicker(false);
		setFromDate(selectedDate);
	};

	const onToDateChange = (event, selectedDate: Date) => {
		setShowToDatePicker(false);
		setToDate(selectedDate);
	};

	const renderDatePickerInputItem = (label: string, value: string, onPress: () => void) => {
		return (
			<HStack style={{ gap: 10 }}>
				<LabeledTextField
					size="xl"
					label={label}
					disabled={true}
					value={value}
					rightElement={
						<IconButton iconName="CalendarPlus" onPress={onPress} color='gray' />
					}
				/>
			</HStack>
		);
	}

	const periodForm = (
		<VStack style={styles.periodForm}>
			{renderDatePickerInputItem(t('books.documents.yearFrom'), dateService.formatLocalDate(fromDate), () => setShowFromDatePicker(true))}
			{renderDatePickerInputItem(t('books.documents.yearTo'), dateService.formatLocalDate(toDate), () => setShowToDatePicker(true))}
		</VStack>
	)

	const datePickersContent = (
		<VStack>
			{showFromDatePicker &&
				<DateTimePicker
					testID="dateTimePickerFrom"
					value={fromDate}
					mode={'date'}
					is24Hour={true}
					onChange={onFromDateChange}
				/>
			}
			{showToDatePicker &&
				<DateTimePicker
					testID="dateTimePickerTo"
					value={toDate}
					mode={'date'}
					is24Hour={true}
					onChange={onToDateChange}
				/>
			}
		</VStack>
	);

	return (
		<View style={styles.root}>
			{bookkeepingMode === 'custom' && periodForm}

			{/* Buttons */}
			<View style={styles.listWrapper}>
				{documentsData.map((doc) => (
					<ItemComponent
						key={doc.id}
						title={doc.title}
						documentType={doc.documentType}
						onPress={() => handleDocumentSelect(doc.id)}
						onDownloadPress={() => handleDownload(doc.id)}
					/>
				))}
			</View>

			<View>
				{datePickersContent}
			</View>

			{/* Documents List Section */}
			<DownloadedBooksList bookPaths={bookPaths} loading={isLoadingBooks} />

			<VStack style={{ marginBottom: 50 }}>
				<BookkeepingSwitcher onModeChange={setBookkeepingMode} initialMode="yearly" />
			</VStack>
		</View>
	);
};

export default DocumentsDownloadTemplate;