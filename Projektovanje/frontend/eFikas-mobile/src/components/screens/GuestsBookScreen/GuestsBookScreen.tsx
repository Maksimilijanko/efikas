import React from 'react';
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem"; 
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
  
  const documentsDataForTemplate = rawGuestsBookData.map(doc => ({
    id: doc.id,
    title: t(doc.titleKey),
  }));

  return ( 
      <DocumentsDownloadTemplate
        documentsData={documentsDataForTemplate}
        
        documentItemComponent={(props) => {
          const originalDoc = rawGuestsBookData.find(
            doc => t(doc.titleKey) === props.title
          );

          // Postavljanje documentType s fallbackom na 'DomesticGuestsBook'
          const docType: DocumentType = originalDoc?.documentType || 'DomesticGuestsBook';
          
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

export default GuestsBookScreen;