import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Platform } from 'react-native';

import { bookService } from '@/src/api/services/bookService';
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem";
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import { dateService } from '@/src/services/dateService';
import { fileService } from '@/src/services/fileService';
import { toastService } from '@/src/services/toastService';
import { BookPath, DateRangeDTO, DownloadIncomeBookRequest, PdfResult } from '@/src/types/types';
import { PATH_CONSTANTS } from '@/src/util/pathConstants';
import { FetchBlobResponse } from 'react-native-blob-util';
import { useDownload } from '@/src/hooks/useDownload';
import { EditDeleteDialog } from '../../organisms/Dialogs/EditDeleteDialog/EditDeleteDialog';
import { ConfirmationDialog } from '../../organisms/Dialogs/ConfirmationDialog/ConfirmationDialog';
import { pdfService } from '@/src/services/pdfService';

interface RawDocumentData {
    id: string;
    titleKey: string;
    documentType: DocumentType;
}

const rawIncomeBookData: RawDocumentData[] = [
    {
        id: '1',
        titleKey: 'books.bookTitles.IncomeBook',
        documentType: 'IncomeBook'
    },
];

const IncomeBookScreen: React.FC = () => {
    const { t } = useTranslation();
    const {
        streamIncomeBook,
        downloadIncomeBook,
        isDownloading,
        pdfPath,
    } = useDownload();

    const [bookPaths, setBookPaths] = useState<BookPath[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [bookPathToDelete, setBookPathToDelete] = useState<string>("");

    const documentsDataForTemplate = rawIncomeBookData.map(doc => ({
		id: doc.id,
		title: t(doc.titleKey),
		documentType: doc.documentType,
	}));


    const loadBooks = async () => {
        const dir = fileService.getPdfDirectory(PATH_CONSTANTS.incomeBookPath);
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

	// Opens the modal to ask user for permission to delete
	const onDeleteBook = (pathToDelete: string) => {
		setDeleteDialogVisible(true);
		setBookPathToDelete(pathToDelete);
	};

	// Handles the deletion of a book
	const handleDeleteBook = () => {
		if(bookPathToDelete && bookPathToDelete !== "") {
			pdfService.deletePdf(bookPathToDelete);
			setBookPaths(prevBooks => prevBooks.filter(book => book.path !== bookPathToDelete));
		}
	}
    
    return (
		<>
			<DocumentsDownloadTemplate
				streamPDF={streamIncomeBook}
				downloadPDF={downloadIncomeBook}
				pdfPath={pdfPath}
				isDownloading={isDownloading}
				bookPaths={bookPaths}
				isLoadingBooks={loadingBooks}

				documentsData={documentsDataForTemplate}
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
				handleDeleteBook={(path: string) => onDeleteBook(path)}
			/>

			<ConfirmationDialog 
				visible={deleteDialogVisible} 
				title={t('dialogs.download.deleteBookTitle', {title: ''})} 
				onClose={() => setDeleteDialogVisible(false)} 
				onConfirm={handleDeleteBook}			
			/>
		</>
        
    );
};

export default IncomeBookScreen;