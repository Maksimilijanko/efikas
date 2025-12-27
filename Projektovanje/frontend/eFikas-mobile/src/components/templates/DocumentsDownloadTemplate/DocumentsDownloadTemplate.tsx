import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import getStyles from './index.styles';
import { useTheme } from "@/src/providers/ThemeProvider";

import { BookkeepingMode, BookPath, DateRangeDTO } from '@/src/types/types';
import { router } from 'expo-router';
import BookkeepingSwitcher from '../../molecules/BookkeepingSwitcher/BookkeepingSwitcher';
import { VStack } from '../../ui/vstack';
import DownloadedBooksList from '../../organisms/DownloadedBooksList/DownloadedBooksList';
import { GuestBookType } from '@/src/types/enums';
import LabeledTextField from '../../molecules/LabeledTextField/LabeledTextField';
import { BasicButton } from '../../atoms/BasicButton/BasicButton';
import { dateService } from '@/src/services/dateService';
import { useTranslation } from 'react-i18next';

import DateTimePicker from '@react-native-community/datetimepicker';



export type DocumentsDownloadTemplateProps = {
  documentItemComponent: React.ComponentType<{ title: string }>;
  documentsData: { id: string; title: string }[];
  datePickersContent?: React.ReactNode;
  pdfPath: string | null;
  isDownloading: boolean;
  bookPaths?: BookPath[];
  isLoadingBooks?: boolean;
  areGuests?: boolean;
  downloadPDF?: (dateFormVisible: boolean, period: DateRangeDTO) => void;
  downloadPDFGuests?: (type: GuestBookType, dateFormVisible: boolean, period: DateRangeDTO) => void;
  bookkeepingModeChange?: (mode: BookkeepingMode) => void;
};


const DocumentsDownloadTemplate: React.FC<DocumentsDownloadTemplateProps> = ({
  documentItemComponent: ItemComponent,
  documentsData,
  pdfPath,
  isDownloading,
  bookPaths,
  isLoadingBooks,
  areGuests = false,
  downloadPDF,
  downloadPDFGuests,
}) => {
  const { t } = useTranslation();
  const { Colors } = useTheme();
  const styles = getStyles(Colors);
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [bookkeepingMode, setBookkeepingMode] = useState<BookkeepingMode>('yearly');
  const dateFormVisible = bookkeepingMode !== 'yearly';

  // Handle document selection
  const handleDocumentSelect = (id: string) => {
    const period: DateRangeDTO = {
      from: dateService.formatBackendDate(fromDate),
      to: dateService.formatBackendDate(toDate)
    }
    
    if(!areGuests) {
      

      downloadPDF(dateFormVisible, period);
    }
    else{
      if(id === '3')  // Domestic guests
        downloadPDFGuests(GuestBookType.DOMESTIC_GUESTS,dateFormVisible, period);
      else if(id === '4'){  // Foreign guests
        downloadPDFGuests(GuestBookType.FOREIGN_GUESTS, dateFormVisible, period);
      }
    }
  };

  useEffect(() => {
    if (pdfPath && !isDownloading) {
      router.push({
        pathname: '/pdfView',
        params: {
          uri: `${pdfPath}`
        }
      });
    }
  }, [pdfPath, isDownloading]);

  const onFromDateChange = (event, selectedDate: Date) => {
		setShowFromDatePicker(false);
		setFromDate(selectedDate);
	};

	const onToDateChange = (event, selectedDate: Date) => {
		setShowToDatePicker(false);
		setToDate(selectedDate);
	};


  const periodForm = (
    <VStack style={styles.periodForm}>
        <VStack style={{ gap: 10 }}>
            <LabeledTextField label={t('books.documents.yearFrom')} disabled={true} value={dateService.formatLocalDate(fromDate)} />
            <BasicButton title="Izaberi" onPress={() => setShowFromDatePicker(true)} />
        </VStack>
        
        <VStack style={{ gap: 10 }}>
            <LabeledTextField label={t('books.documents.yearTo')} disabled={true} value={dateService.formatLocalDate(toDate)} />
            <BasicButton title="Izaberi" onPress={() => setShowToDatePicker(true)} />
        </VStack>
    </VStack>
  )

  const datePickersContent = (
      <VStack>
          {showFromDatePicker && 
              <DateTimePicker
                  testID="dateTimePickerFrom"
                  value={fromDate}
                  mode={'date'}
                  is24Hour={true}
                  onChange={onFromDateChange}
              /> 
          }
          {showToDatePicker && 
              <DateTimePicker
                  testID="dateTimePickerTo"
                  value={toDate}
                  mode={'date'}
                  is24Hour={true}
                  onChange={onToDateChange}
              /> 
          }
      </VStack>
  );

  return (
    <View style={styles.root}>
      { bookkeepingMode === 'custom' && periodForm }

      {/* Buttons */ }
      <View style={styles.listWrapper}>
        {documentsData.map((doc) => (
          <TouchableOpacity 
            key={doc.id} 
            style={styles.itemWrapper}
            onPress={() => handleDocumentSelect(doc.id)}
          >
            <ItemComponent title={doc.title} />
          </TouchableOpacity>
        ))}
      </View>

      <View>
        {datePickersContent}
      </View>

      {/* Documents List Section */}
      <DownloadedBooksList bookPaths={bookPaths} loading={isLoadingBooks} />
      
      <VStack style={{ marginBottom: 50 }}>
          <BookkeepingSwitcher onModeChange={setBookkeepingMode} initialMode="yearly" />
      </VStack>
    </View>
  );
};

export default DocumentsDownloadTemplate;