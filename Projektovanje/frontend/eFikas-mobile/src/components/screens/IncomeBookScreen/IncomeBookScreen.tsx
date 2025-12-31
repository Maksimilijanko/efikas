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

    // const [pdfPath, setPdfPath] = useState<string | null>(null);
    // const [isDownloading, setIsDownloading] = useState(false);
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
            console.log("RESULTS: ", result);
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


    // const executePdfAction = async (
    //     action: () => Promise<FetchBlobResponse>,
    //     onSuccess?: (path: string) => Promise<void> | void
    // ) => {
    //     try {
    //         setIsDownloading(true);

    //         const resp = await action();
    //         const path = resp.path();

    //         if (fileService.fileExists(path)) {
    //             const realPath =
    //                 Platform.OS === 'android' ? `file://${path}` : path;
    //             console.log("HELLO: ", realPath);
    //             toastService.success(t('books.documents.downloadSuccessMessage'), t('books.documents.downloadSuccessDescription'));

    //             // Optional - if we want to open it immediately in the viewer:
    //             setPdfPath(`${realPath}`);
    //             await onSuccess?.(realPath);
    //         }
    //         else {
    //             // Try to read backend error message
    //             let errorMessage = "Genericka greska";

    //             try {
    //                 const text = await resp.text(); // or res.json()
    //                 if (text) {
    //                     errorMessage = text;
    //                 }
    //             } catch {
    //                 // ignore parsing errors
    //             }

    //             console.log(errorMessage);
    //             throw new Error(errorMessage);
    //         }
    //     } catch (err: any) {
    //         if (err.message?.includes('Status Code = 16')) {
    //             toastService.error(
    //                 t('books.documents.invalidPeriodMessage'),
    //                 t('books.documents.fromAfterToDescription')
    //             );
    //         } else {
    //             toastService.error('1', '2');
    //         }
    //     } finally {
    //         setIsDownloading(false);
    //     }
    // };

    // const streamPDF = async (dateFormVisible: boolean, period: DateRangeDTO) => {
    //     if (isInvalidPeriod(period)) {
    //         toastService.error(
    //             t('books.documents.invalidPeriodMessage'),
    //             t('books.documents.fromAfterToDescription')
    //         );
    //         return;
    //     }

    //     const request = buildRequest(dateFormVisible, period);

    //     await executePdfAction(() =>
    //         bookService.streamIncomeBook(request)
    //     );
    // }


    // const downloadPDF = async (dateFormVisible: boolean, period: DateRangeDTO) => {
    //     if (isInvalidPeriod(period)) {
    //         toastService.error(
    //             t('books.documents.invalidPeriodMessage'),
    //             t('books.documents.fromAfterToDescription')
    //         );
    //         return;
    //     }

    //     const request = buildRequest(dateFormVisible, period);

    //     const dir = fileService.getPdfDirectory(PATH_CONSTANTS.incomeBookPath);
    //     if (!fileService.fileExists(dir)) {
    //         fileService.createDirectory(dir);
    //     }

    //     const title = `${t('books.documents.incomeBookDownloadTitle')}_${Date.now()}.pdf`;
    //     const path = `${dir}/${title}`;

    //     await executePdfAction(
    //         () => bookService.downloadIncomeBook(path, request),
    //         loadBooks
    //     );
    // };

    
    // const executePdfAction = async (
    //     action: () => Promise<PdfResult>,
    //     onSuccess?: (path: string) => Promise<void> | void,
    //     title?: string,
    //     isStreaming = true,
    // ) => {
    //     try {
    //         setIsDownloading(true);

    //         const { uri } = await action();

    //         if (!(await fileService.fileExists(uri))) {
    //             throw new Error('File not found after download');
    //         }

    //         toastService.success(
    //             t('books.documents.downloadSuccessMessage'),
    //             t('books.documents.downloadSuccessDescription')
    //         );
            
    //         if(!isStreaming) {
    //             // ✅ Let user manually save / export
    //             // if (await Sharing.isAvailableAsync()) {
    //             // 	const sharePdfTitle = t('books.documents.sharingSavePdfTitle', {
    //             // 		title: title,
    //             // 	});
    //             // 	await Sharing.shareAsync(uri, {
    //             // 		mimeType: 'application/pdf',
    //             // 		dialogTitle: sharePdfTitle,
    //             // 	});
    //             // }
    //         }
            

    //         setPdfPath(uri);
    //         await onSuccess?.(uri);
    //     } catch (err) {
    //         console.log("ERROR: ", err.message);
    //         toastService.error(
    //             t('books.documents.downloadErrorTitle'),
    //             t('books.documents.downloadErrorMessage')
    //         );
    //     } finally {
    //         setIsDownloading(false);
    //     }
    // };


    // const streamPDF = async (dateFormVisible: boolean, period: DateRangeDTO) => {
    //     if (isInvalidPeriod(period)) {
    //         toastService.error(
    //             t('books.documents.invalidPeriodMessage'),
    //             t('books.documents.fromAfterToDescription')
    //         );
    //         return;
    //     }

    //     const request = buildRequest(dateFormVisible, period);

    //     await executePdfAction(() =>
    //         bookService.streamIncomeBook(request),
    //     );
    // }

    // const downloadPDF = async (
    //     dateFormVisible: boolean,
    //     period: DateRangeDTO
    // ) => {
    //     if (isInvalidPeriod(period)) {
    //         toastService.error(
    //             t('books.documents.invalidPeriodMessage'),
    //             t('books.documents.fromAfterToDescription')
    //         );
    //         return;
    //     }

    //     const request = buildRequest(dateFormVisible, period);

    //     const dir = fileService.getPdfDirectory(PATH_CONSTANTS.guestsBookPath);
    //     console.log("DIR INFO: ", dir.info());
    //     console.log("DIR URI: ", dir.uri);
    //     await fileService.ensureDirectory(dir);

    //     const title = t('books.documents.incomeBookDownloadTitle');
    //     const fileName = `${title}_${Date.now()}.pdf`;
    //     const filePath = `${dir.uri}${fileName}`;

    //     await executePdfAction(
    //         () => bookService.downloadIncomeBook(filePath, request),
    //         loadBooks,
    //         fileName,
    //         false,
    //     );
    // };
    

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