import React from 'react';
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import DocumentItem, { DocumentItemProps, DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem"; 
import { useTranslation } from "react-i18next";

// Tip za sirove podatke
interface RawDocumentData {
    id: string;
    titleKey: string;
    documentType: DocumentType;
}

// Podaci specifični za Knjigu prihoda
const rawIncomeBookData: RawDocumentData[] = [
  { 
    id: '1', // Novi ID
    titleKey: 'books.bookTitles.IncomeBook', // Ključ za lokalizaciju Knjige prihoda
    documentType: 'IncomeBook' // Ispravan tip dokumenta
  },
];

const IncomeBookScreen: React.FC = () => {
  const { t } = useTranslation();
  
  // Kreiranje podataka za template s lokalizovanim naslovima
  const documentsDataForTemplate = rawIncomeBookData.map(doc => ({
    id: doc.id,
    title: t(doc.titleKey),
  }));

  return ( 
      <DocumentsDownloadTemplate
        documentsData={documentsDataForTemplate}
        
        documentItemComponent={(props) => {
          // Pronalaženje originalnog objekta pomoću prevedenog naslova
          const originalDoc = rawIncomeBookData.find(
            doc => t(doc.titleKey) === props.title
          );

          // Postavljanje documentType s fallbackom na 'IncomeBook'
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