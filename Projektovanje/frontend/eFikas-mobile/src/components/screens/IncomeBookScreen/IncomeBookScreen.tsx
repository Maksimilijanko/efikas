import React, { useState } from 'react';
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem"; 
import { useTranslation } from "react-i18next";
import { DownloadIncomeBookRequest } from '@/src/types/types';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { bookService } from '@/src/api/services/bookService';
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
    taxpayerId: 1, // Adjust based on your data structure
    period: {
      from: "2024-01-05",
      to: "2024-01-06"
    },
    storeId: 0
  };

  const downloadPDF = async (request: DownloadIncomeBookRequest) => {
    try {
      setIsDownloading(true);

      const dirs = ReactNativeBlobUtil.fs.dirs;
      const fileName = `Income_Book_${request.period.from}_${request.period.to}.pdf`;
      const downloadPath = `${dirs.DownloadDir}/${fileName}`;

      const exists = await ReactNativeBlobUtil.fs.exists(downloadPath);
      if (exists) {
        setPdfPath(downloadPath);
        return;
      }

      const resp = await bookService.downloadIncomeBook(request);

      // Save streamed PDF to file
      await ReactNativeBlobUtil.fs.writeFile(
        downloadPath,
        resp.data,
        'base64'
      );

      setPdfPath(downloadPath);
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