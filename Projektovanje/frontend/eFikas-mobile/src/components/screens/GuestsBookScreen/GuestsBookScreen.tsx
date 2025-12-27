import { bookService } from '@/src/api/services/bookService';
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem";
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import { dateService } from '@/src/services/dateService';
import { RNBlobUtilService } from '@/src/services/RNBlobUtilService';
import { toastService } from '@/src/services/toastService';
import { GuestBookType } from '@/src/types/enums';
import { BookkeepingMode, BookPath, DateRangeDTO, GuestsBookRequest } from '@/src/types/types';
import { PATH_CONSTANTS } from '@/src/util/pathConstants';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Animated, Platform } from 'react-native';
import { VStack } from '../../ui/vstack';


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
	}));

	const loadBooks = async () => {
		try {
			setLoadingBooks(true);
			const result = await RNBlobUtilService.loadDownloadedBooks(PATH_CONSTANTS.guestsBookPath);
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


	const downloadPDF = async (type: GuestBookType, dateFormVisible: boolean, period: DateRangeDTO) => {
		if (dateFormVisible && (period.from == null || period.to == null)) {
			toastService.error(t('books.documents.customDateErrorMessage'), t('books.documents.customDateErrorDescription'));
			return;
		}

		const request = buildRequest(dateFormVisible, period);

		try {
			setIsDownloading(true);

			const dir = PATH_CONSTANTS.guestsBookPath;
			if (!RNBlobUtilService.fileExists(dir)) {
				RNBlobUtilService.createDirectory(dir);
			}

			const title = type === GuestBookType.DOMESTIC_GUESTS ?
				t('books.documents.domesticGuestsBookDownloadTitle')
				:
				t('books.documents.foreignGuestsBookDownloadTitle')
			const downloadPath = `${dir}/${title}_${Date.now()}.pdf`;

			const resp = await bookService.downloadGuestsBook(downloadPath, type, request);

			// If we got here, the file exists
			const path = resp.path();
			// ReactNativeBlobUtil doesnt give HTTP status, only state of downloaded file (exists or not)
			if (RNBlobUtilService.fileExists(path)) {
				const realPath = Platform.OS === 'android' ? 'file://' + resp.path() : '' + resp.path();
				toastService.success(t('books.documents.downloadSuccessMessage'), t('books.documents.downloadSuccessDescription'));

				// Optional - if we want to open it immediately in the viewer:
				setPdfPath(`${realPath}`);
				await loadBooks();
			}
			else {
				// Try to read backend error message
				let errorMessage = "Genericka greska";

				try {
					const text = await resp.text(); // or res.json()
					if (text) {
						errorMessage = text;
					}
				} catch {
					// ignore parsing errors
				}

				throw new Error(errorMessage);
			}

		} catch (err: any) {
			console.log('Download failed: ', err.message);

			if (err.message.includes('Status Code = 16')) {
				toastService.error(
					t('books.documents.invalidPeriodMessage'),
					t('books.documents.fromAfterToDescription')
				);
			} else {
				toastService.error("1", "2");
			}
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<DocumentsDownloadTemplate
			downloadPDFGuests={downloadPDF}
			areGuests={true}
			pdfPath={pdfPath}
			isDownloading={isDownloading}
			documentsData={documentsDataForTemplate}
			bookPaths={bookPaths}
			isLoadingBooks={loadingBooks}

			documentItemComponent={(props) => {
				const originalDoc = rawGuestsBookData.find(
					doc => t(doc.titleKey) === props.title
				);
				// Postavljanje documentType s fallbackom na 'DomesticGuestsBook'
				const docType: DocumentType = originalDoc?.documentType || 'DomesticGuestsBook';

				return (
					<VStack>
						<DocumentItem
							title={props.title}
							documentType={docType} 
						/>
                    </VStack>
				);
			}}
		/>
	);
};

export default GuestsBookScreen;