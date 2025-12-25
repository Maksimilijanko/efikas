import React, { useState } from 'react';
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem";
import { useTranslation } from "react-i18next";
import { DownloadIncomeBookRequest } from '@/src/types/types';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { bookService } from '@/src/api/services/bookService';
import { toastService } from '@/src/services/toastService';

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


    const documentsDataForTemplate = rawIncomeBookData.map(doc => ({
        id: doc.id,
        title: t(doc.titleKey),
    }));

    const request: DownloadIncomeBookRequest = {
        taxpayerId: 1,
        period: {
            from: "2024-01-05",
            to: "2024-01-07"
        },
        storeId: 0
    };

    const downloadPDF = async (request: DownloadIncomeBookRequest) => {
        try {
            setIsDownloading(true);

            const dirs = ReactNativeBlobUtil.fs.dirs;
            const downloadPath = `${dirs.DownloadDir}/${t('books.documents.incomeBookDownloadTitle')}_${Date.now()}.pdf`;

            console.log("Downlaod path 1: ", downloadPath);
            const res = await bookService.downloadIncomeBook(downloadPath, request);
            const realPath = res.path();
            toastService.success(t('books.documents.downloadSuccessMessage'), t('books.documents.downloadSuccessDescription'));

            // Optional - if we want to open it immediately in the viewer:
            setPdfPath(`file://${realPath}`);
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <DocumentsDownloadTemplate
            downloadPDF={downloadPDF}
            pdfPath={pdfPath}
            isDownloading={isDownloading}
            bookRequest={request}

            documentsData={documentsDataForTemplate}
            documentItemComponent={(props) => {
                const originalDoc = rawIncomeBookData.find(
                    doc => t(doc.titleKey) === props.title
                );

                const docType: DocumentType = originalDoc?.documentType || 'IncomeBook';

                return (
                    <DocumentItem
                        title={props.title}
                        documentType={docType}
                    />
                );
            }}
        />
    );
};

export default IncomeBookScreen;