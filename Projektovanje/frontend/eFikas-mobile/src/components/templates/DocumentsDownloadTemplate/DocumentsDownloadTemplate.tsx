import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import getStyles from './index.styles';
import { useTheme } from "@/src/providers/ThemeProvider";
import PdfViewer from '../../organisms/PdfViewer/PdfViewer';

import ReactNativeBlobUtil from 'react-native-blob-util';
import { Text } from 'react-native';
import { DownloadIncomeBookRequest } from '@/src/types/types';
import { bookService } from '@/src/api/services/bookService';
import { API_URLS } from '@/src/util/apiConstants';
import { router } from 'expo-router';



export type DocumentsDownloadTemplateProps = {
  documentItemComponent: React.ComponentType<{ title: string }>;
  documentsData: { id: string; title: string }[];
  downloadPDF: (request: any) => void;
  pdfPath: string | null;
  isDownloading: boolean;
  bookRequest: any;
};


const DocumentsDownloadTemplate: React.FC<DocumentsDownloadTemplateProps> = ({
  documentItemComponent: ItemComponent,
  documentsData,
  bookRequest,
  downloadPDF,
  pdfPath,
  isDownloading
}) => {
  const { Colors } = useTheme();
  const styles = getStyles(Colors);

  // State for the selected document request
  const [selectedRequest, setSelectedRequest] = useState<DownloadIncomeBookRequest | null>(null);

  // Handle document selection
  const handleDocumentSelect = () => {
    console.log("HALO");
    
    setSelectedRequest(bookRequest);
    downloadPDF(bookRequest);
  };

  useEffect(() => {
    if (pdfPath && !isDownloading) {
      console.log("Path: ", pdfPath);
      router.push({
        pathname: '/pdfView',
        params: {
          uri: `${pdfPath}`
        }
      });
    }
  }, [pdfPath, isDownloading]);

  return (
    <View style={styles.root}>
      {/* Documents List Section */}
      <View style={styles.documentsSection}>
        <ScrollView
          style={styles.documentsScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.documentsContent}
        >
          <View style={styles.listWrapper}>
            {documentsData.map((doc) => (
              <TouchableOpacity 
                key={doc.id} 
                style={styles.itemWrapper}
                onPress={() => handleDocumentSelect()}
              >
                <ItemComponent title={doc.title} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default DocumentsDownloadTemplate;