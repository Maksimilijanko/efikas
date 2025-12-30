import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Platform } from 'react-native';

import { bookService } from '@/src/api/services/bookService';
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem";
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import { dateService } from '@/src/services/dateService';
import { fileService } from '@/src/services/fileService';
import { toastService } from '@/src/services/toastService';
import { BookPath, DateRangeDTO, DownloadIncomeBookRequest } from '@/src/types/types';
import { PATH_CONSTANTS } from '@/src/util/pathConstants';
import { FetchBlobResponse } from 'react-native-blob-util';

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
    const [pdfPath, setPdfPath] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [bookPaths, setBookPaths] = useState<BookPath[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    const documentsDataForTemplate = rawIncomeBookData.map(doc => ({
		id: doc.id,
		title: t(doc.titleKey),
		documentType: doc.documentType,
	}));

    const loadBooks = async () => {
        const path = fileService.getPdfDownloadPath(PATH_CONSTANTS.incomeBookPath);
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


    const buildRequest = (dateFormVisible: boolean, period: DateRangeDTO): DownloadIncomeBookRequest => ({
        period: {
            from: dateFormVisible
            ? period.from
            : `${new Date().getFullYear()}-01-01`,
            to: dateFormVisible
            ? period.to
            : dateService.formatBackendDate(new Date()),
        },
        taxpayerId: 1,
        storeId: 0,
    });

    const isInvalidPeriod = (period: DateRangeDTO): boolean => {
        if (!period.from || !period.to) return true;

        return new Date(period.from) > new Date(period.to);
    }

    const executePdfAction = async (
        action: () => Promise<FetchBlobResponse>,
        onSuccess?: (path: string) => Promise<void> | void
    ) => {
        try {
            setIsDownloading(true);

            const resp = await action();
            const path = resp.path();

            if (fileService.fileExists(path)) {
                const realPath =
                    Platform.OS === 'android' ? `file://${path}` : path;
                console.log("HELLO: ", realPath);
                toastService.success(t('books.documents.downloadSuccessMessage'), t('books.documents.downloadSuccessDescription'));

                // Optional - if we want to open it immediately in the viewer:
                setPdfPath(`${realPath}`);
                await onSuccess?.(realPath);
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

                console.log(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (err: any) {
            if (err.message?.includes('Status Code = 16')) {
                toastService.error(
                    t('books.documents.invalidPeriodMessage'),
                    t('books.documents.fromAfterToDescription')
                );
            } else {
                toastService.error('1', '2');
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const streamPDF = async (dateFormVisible: boolean, period: DateRangeDTO) => {
        if (isInvalidPeriod(period)) {
            toastService.error(
                t('books.documents.invalidPeriodMessage'),
                t('books.documents.fromAfterToDescription')
            );
            return;
        }

        const request = buildRequest(dateFormVisible, period);

        await executePdfAction(() =>
            bookService.streamIncomeBook(request)
        );
    }


    const downloadPDF = async (dateFormVisible: boolean, period: DateRangeDTO) => {
        if (isInvalidPeriod(period)) {
            toastService.error(
                t('books.documents.invalidPeriodMessage'),
                t('books.documents.fromAfterToDescription')
            );
            return;
        }

        const request = buildRequest(dateFormVisible, period);

        const dir = fileService.getPdfDownloadPath(PATH_CONSTANTS.incomeBookPath);
        if (!fileService.fileExists(dir)) {
            fileService.createDirectory(dir);
        }

        const title = `${t('books.documents.incomeBookDownloadTitle')}_${Date.now()}.pdf`;
        const path = `${dir}/${title}`;

        await executePdfAction(
            () => bookService.downloadIncomeBook(path, request),
            loadBooks
        );
    };

    
    // const downloadPDF = async (dateFormVisible: boolean, period: DateRangeDTO) => {
    //     if(dateFormVisible && (period.from == null || period.to == null )) {
    //         toastService.error(t('books.documents.customDateErrorMessage'), t('books.documents.customDateErrorDescription'));
            
    //         return;
    //     }

    //     const request = buildRequest(dateFormVisible, period);

    //     try {
    //         setIsDownloading(true);

    //         const dir = RNBlobUtilService.getPdfDownloadPath(PATH_CONSTANTS.incomeBookPath);
    //         if(!RNBlobUtilService.fileExists(dir)) {
    //             RNBlobUtilService.createDirectory(dir);
    //         }
    //         const downloadPath = `${dir}/${t('books.documents.incomeBookDownloadTitle')}_${Date.now()}.pdf`;
    //         const resp = await bookService.downloadIncomeBook(downloadPath, request);

    //         // If we got here, the file exists
    //         const path = resp.path();
    //         // ReactNativeBlobUtil doesnt give HTTP status, only state of downloaded file (exists or not)
    //         if(RNBlobUtilService.fileExists(path)) {
    //             const realPath = Platform.OS === 'android' ? 'file://' + resp.path() : '' + resp.path();
    //             toastService.success(t('books.documents.downloadSuccessMessage'), t('books.documents.downloadSuccessDescription'));

    //             // Optional - if we want to open it immediately in the viewer:
    //             setPdfPath(`${realPath}`);
    //             await loadBooks();
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

    //             throw new Error(errorMessage);
    //         }
            
    //     } catch (err: any) {
    //         console.log('Download failed: ', err.message);

    //         if (err.message.includes('Status Code = 16')) {
    //             setPdfPath(null);
    //             toastService.error(
    //                 t('books.documents.invalidPeriodMessage'),
    //                 t('books.documents.fromAfterToDescription')
    //             );
    //         } else {
    //             toastService.error("1", "2");
    //         }
    //     } finally {
    //         setIsDownloading(false);
    //     }
    // };

    return (
        <DocumentsDownloadTemplate
            streamPDF={streamPDF}
            downloadPDF={downloadPDF}
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