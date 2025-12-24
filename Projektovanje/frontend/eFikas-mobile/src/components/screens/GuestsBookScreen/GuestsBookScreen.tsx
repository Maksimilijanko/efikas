import React, { useState } from 'react';
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem"; 
import { useTranslation } from "react-i18next";
import { GuestsBookRequest } from '@/src/types/types';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { bookService } from '@/src/api/services/bookService';
import { GuestBookType } from '@/src/types/enums';

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
  
  const documentsDataForTemplate = rawGuestsBookData.map(doc => ({
    id: doc.id,
    title: t(doc.titleKey),
  }));

  const request: GuestsBookRequest = {
    period: {
      from: "2025-12-14",
      to: "2025-12-21"
    },
    active: false,
  };

  const downloadPDF = async (request: GuestsBookRequest) => {
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
  
        const resp = await bookService.downloadGuestsBook(GuestBookType.DOMESTIC_GUESTS, request);
  
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
      documentsData={documentsDataForTemplate}
      bookRequest={request}

      documentItemComponent={(props) => {
        const originalDoc = rawGuestsBookData.find(
          doc => t(doc.titleKey) === props.title
        );
        // Postavljanje documentType s fallbackom na 'DomesticGuestsBook'
        const docType: DocumentType = originalDoc?.documentType || 'DomesticGuestsBook';

        return (
          <DocumentItem
            title={props.title}
            documentType={docType} />
        );
      }} 
    />  
  );
};

export default GuestsBookScreen;