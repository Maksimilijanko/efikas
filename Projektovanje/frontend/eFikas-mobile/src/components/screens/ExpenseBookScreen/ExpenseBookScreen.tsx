import React from 'react';
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem"; // Pretpostavljam da ste dodali DocumentItemProps
import { useTranslation } from "react-i18next";

const rawExpenseBookData = [
  { 
    id: '2', 
    titleKey: 'books.bookTitles.ExpenseBook',
    documentType: 'ExpenseBook' 
  },
];

const ExpenseBookScreen: React.FC = () => {
  const { t } = useTranslation();
  const documentsDataForTemplate = rawExpenseBookData.map(doc => ({
    id: doc.id,
    title: t(doc.titleKey),
  }));

  return ( 
      <DocumentsDownloadTemplate
        documentsData={documentsDataForTemplate}
        
        documentItemComponent={(props) => {
          const originalDoc = rawExpenseBookData.find(
            doc => t(doc.titleKey) === props.title
          );
          return (
            <DocumentItem 
              title={props.title} 
              documentType={originalDoc?.documentType as DocumentType || 'ExpenseBook'}
            />
          );
        }}
      />  
  );
};

export default ExpenseBookScreen;