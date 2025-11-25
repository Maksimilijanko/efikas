import React from 'react';
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem"; 
import { useTranslation } from "react-i18next";
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

  const documentsDataForTemplate = rawIncomeBookData.map(doc => ({
    id: doc.id,
    title: t(doc.titleKey),
  }));

  return ( 
      <DocumentsDownloadTemplate
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