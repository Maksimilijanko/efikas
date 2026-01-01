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
    
    return (
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
        />
    );
};

export default IncomeBookScreen;