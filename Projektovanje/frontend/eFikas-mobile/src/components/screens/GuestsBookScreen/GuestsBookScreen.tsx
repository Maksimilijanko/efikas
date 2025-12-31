import { bookService } from '@/src/api/services/bookService';
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem";
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import { useDownload } from '@/src/hooks/useDownload';
import { dateService } from '@/src/services/dateService';
import { fileService } from '@/src/services/fileService';
import { toastService } from '@/src/services/toastService';
import { GuestBookType } from '@/src/types/enums';
import { BookPath, DateRangeDTO, GuestsBookRequest, PdfResult } from '@/src/types/types';
import { PATH_CONSTANTS } from '@/src/util/pathConstants';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

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
	const {
		streamGuestsBook,
		downloadGuestsBook,
		isDownloading,
		pdfPath,
	} = useDownload();

	const [bookPaths, setBookPaths] = useState<BookPath[]>([]);
	const [loadingBooks, setLoadingBooks] = useState(true);

	const documentsDataForTemplate = rawGuestsBookData.map(doc => ({
		id: doc.id,
		title: t(doc.titleKey),
		documentType: doc.documentType,
	}));

	const loadBooks = async () => {
		const dir = fileService.getPdfDirectory(PATH_CONSTANTS.guestsBookPath);

		try {
			setLoadingBooks(true);

			const result = await fileService.loadDownloadedBooks(dir.uri);
			setBookPaths(result);
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingBooks(false);
		}
	};

	useEffect(() => {
		loadBooks();
	}, [isDownloading]);


	return (
		<DocumentsDownloadTemplate
			streamPDFGuests={streamGuestsBook}
			downloadPDFGuests={downloadGuestsBook}
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