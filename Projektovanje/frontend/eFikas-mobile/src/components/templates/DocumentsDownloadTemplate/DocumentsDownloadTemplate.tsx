import React from 'react';
import { ScrollView, View } from 'react-native';
import styles from './index.styles';

export type DocumentsDownloadTemplateProps = {
  documentItemComponent: React.ComponentType<{ title: string }>;
  documentsData: { id: string; title: string }[];
};

const DocumentsDownloadTemplate: React.FC<DocumentsDownloadTemplateProps> = ({
  documentItemComponent: ItemComponent,
  documentsData
}) => {
  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listWrapper}>
          {documentsData.map((doc) => (
            <View key={doc.id} style={styles.itemWrapper}>
              <ItemComponent title={doc.title} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DocumentsDownloadTemplate;
