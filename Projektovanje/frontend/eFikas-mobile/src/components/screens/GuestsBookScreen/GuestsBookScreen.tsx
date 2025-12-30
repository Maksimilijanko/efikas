import { bookService } from '@/src/api/services/bookService';
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem";
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import { dateService } from '@/src/services/dateService';
import { fileService } from '@/src/services/fileService';
import { toastService } from '@/src/services/toastService';
import { GuestBookType } from '@/src/types/enums';
import { BookPath, DateRangeDTO, GuestsBookRequest, PdfResult } from '@/src/types/types';
import { PATH_CONSTANTS } from '@/src/util/pathConstants';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Platform } from 'react-native';
import { FetchBlobResponse } from 'react-native-blob-util';
import * as Sharing from 'expo-sharing';

interface RawDocumentData {
	id: string;
	titleKey: string;
	documentType: DocumentType;
}

const rawGuestsBookData: RawDocumentData[] = [
	{
		id: '3',
		titleKey: 'books.bookTitles.DomesticGuestsBook',
		documentType: 'DomesticGuestsBook'
	},
	{
		id: '4',
		titleKey: 'books.bookTitles.ForeignGuestsBook',
		documentType: 'ForeignGuestsBook'
	},
];

const GuestsBookScreen: React.FC = () => {
	const { t } = useTranslation();

	const [pdfPath, setPdfPath] = useState<string | null>(null);
	const [isDownloading, setIsDownloading] = useState(false);
	const [bookPaths, setBookPaths] = useState<BookPath[]>([]);
	const [loadingBooks, setLoadingBooks] = useState(true);

	const documentsDataForTemplate = rawGuestsBookData.map(doc => ({
		id: doc.id,
		title: t(doc.titleKey),
		documentType: doc.documentType,
	}));

	const loadBooks = async () => {
		const path = fileService.getPdfDownloadPath(PATH_CONSTANTS.guestsBookPath);
		try {
			setLoadingBooks(true);
			const result = await fileService.loadDownloadedBooks(path);
			setBookPaths(result);
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingBooks(false);
		}
	};

	useEffect(() => {
		loadBooks();
	}, []);

	const buildRequest = (dateFormVisible: boolean, period: DateRangeDTO): GuestsBookRequest => ({
		period: {
			from: dateFormVisible
				? period.from
				: `${new Date().getFullYear()}-01-01`,
			to: dateFormVisible
				? period.to
				: dateService.formatBackendDate(new Date()),
		},
		active: false,
	});

	const isInvalidPeriod = (period: DateRangeDTO): boolean => {
		if (!period.from || !period.to) return true;

		return new Date(period.from) > new Date(period.to);
	}

	const executePdfAction = async (
		action: () => Promise<PdfResult>,
		onSuccess?: (path: string) => Promise<void> | void
	) => {
		try {
			setIsDownloading(true);

			const { uri } = await action();

			if (!(await fileService.fileExists(uri))) {
				throw new Error('File not found after download');
			}

			toastService.success(
				t('books.documents.downloadSuccessMessage'),
				t('books.documents.downloadSuccessDescription')
			);

			// Share / open PDF
			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(uri);
			}

			setPdfPath(uri);
			await onSuccess?.(uri);
			// else {
			// 	// Try to read backend error message
			// 	let errorMessage = "Genericka greska";

			// 	try {
			// 		const text = await resp.text(); // or res.json()
			// 		if (text) {
			// 			errorMessage = text;
			// 		}
			// 	} catch {
			// 		// ignore parsing errors
			// 	}

			// 	console.log(errorMessage);
			// 	throw new Error(errorMessage);
			// }
		} catch (err: any) {
			if (err.message?.includes('Status Code = 16')) {
				toastService.error(
					t('books.documents.invalidPeriodMessage'),
					t('books.documents.fromAfterToDescription')
				);
			} else {
				toastService.error(
					t('books.documents.downloadErrorTitle'), 
					t('books.documents.downloadErrorMessage')
				);
			}
		} finally {
			setIsDownloading(false);
		}
	};

	const streamPDF = async (type: GuestBookType, dateFormVisible: boolean, period: DateRangeDTO) => {
		if (isInvalidPeriod(period)) {
			toastService.error(
				t('books.documents.invalidPeriodMessage'),
				t('books.documents.fromAfterToDescription')
			);
			return;
		}

		const request = buildRequest(dateFormVisible, period);

		await executePdfAction(() =>
			bookService.streamGuestsBook(type, request)
		);
	}


	const downloadPDF = async (type: GuestBookType, dateFormVisible: boolean, period: DateRangeDTO) => {
		if (isInvalidPeriod(period)) {
			toastService.error(
				t('books.documents.invalidPeriodMessage'),
				t('books.documents.fromAfterToDescription')
			);
			return;
		}

		const request = buildRequest(dateFormVisible, period);

		const dir = fileService.getPdfDownloadPath(PATH_CONSTANTS.guestsBookPath);
		if (!fileService.fileExists(dir)) {
			fileService.createDirectory(dir);
		}

		const title =
			type === GuestBookType.DOMESTIC_GUESTS
				? t('books.documents.domesticGuestsBookDownloadTitle')
				: t('books.documents.foreignGuestsBookDownloadTitle');

		const path = `${dir}/${title}_${Date.now()}.pdf`;

		await executePdfAction(
			() => bookService.downloadGuestsBook(path, type, request),
			loadBooks
		);
	};

	return (
		<DocumentsDownloadTemplate
			streamPDFGuests={streamPDF}
			downloadPDFGuests={downloadPDF}
			areGuests={true}
			pdfPath={pdfPath}
			isDownloading={isDownloading}
			documentsData={documentsDataForTemplate}
			bookPaths={bookPaths}
			isLoadingBooks={loadingBooks}

			documentItemComponent={(props) => {
				return (
					<DocumentItem
						title={props.title}
						documentType={props.documentType}
						onPress={props.onPress}
						onDownloadPress={props.onDownloadPress}
					/>
				);
			}}
		/>
	);
};

export default GuestsBookScreen;