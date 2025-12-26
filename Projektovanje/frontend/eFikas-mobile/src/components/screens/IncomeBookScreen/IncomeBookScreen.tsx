import { bookService } from '@/src/api/services/bookService';
import DocumentItem, { DocumentType } from "@/src/components/molecules/DocumentItem/DocumentItem";
import DocumentsDownloadTemplate from "@/src/components/templates/DocumentsDownloadTemplate/DocumentsDownloadTemplate";
import { toastService } from '@/src/services/toastService';
import { BookkeepingMode, DownloadIncomeBookRequest } from '@/src/types/types';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import ReactNativeBlobUtil from 'react-native-blob-util';
import { VStack } from '../../ui/vstack';


import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BasicButton } from '../../atoms/BasicButton/BasicButton';
import LabeledTextField from '../../molecules/LabeledTextField/LabeledTextField';
import { dateService } from '@/src/services/dateService';
import { Platform } from 'react-native';

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
    const [fromDate, setFromDate] = useState<Date | null>(new Date());
    const [toDate, setToDate] = useState<Date | null>(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    const [pdfPath, setPdfPath] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const [bookkeepingMode, setBookkeepingMode] = useState<BookkeepingMode>('yearly');
    const dateFormVisible = bookkeepingMode !== 'yearly';
    
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(dateFormVisible ? 1 : 0, { duration: 500 }),
        height: withTiming(dateFormVisible ? 'auto' : 0),
        marginBottom: 20
    }));

    const documentsDataForTemplate = rawIncomeBookData.map(doc => ({
        id: doc.id,
        title: t(doc.titleKey),
    }));


    const request: DownloadIncomeBookRequest = {
        taxpayerId: 1,
        period: {
            from: dateFormVisible ? null : `${new Date().getFullYear()}-01-01`,
            to: dateFormVisible ? null : `${dateService.formatBackendDate(new Date())}`
        },
        storeId: 0
    };

    const downloadPDF = async (request: DownloadIncomeBookRequest) => {
        console.log("req 1: ", request);

        if(dateFormVisible && (fromDate == null || toDate == null )) {
            toastService.error(t('books.documents.customDateErrorMessage'), t('books.documents.customDateErrorDescription'));
            
            return;
        }

        try {
            if(dateFormVisible) {
                request.period.from = dateService.formatBackendDate(fromDate);
                request.period.to = dateService.formatBackendDate(toDate);
            }
            
            setIsDownloading(true);
            console.log("req 2: ", request);

            const dirs = ReactNativeBlobUtil.fs.dirs;
            const downloadPath = `${dirs.DownloadDir}/${t('books.documents.incomeBookDownloadTitle')}_${Date.now()}.pdf`;

            console.log("Downlaod path 1: ", downloadPath);
            const resp = await bookService.downloadIncomeBook(downloadPath, request);

            const { status } = resp.info();
            if (status >= 400) {
                // Try to read backend error message
                let errorMessage = "Genericka greska";

                try {
                    const text = await resp.text(); // or res.json()
                    if (text) {
                        errorMessage = text;
                    }
                } catch {
                    // ignore parsing errors
                }

                throw new Error(errorMessage);
            }
            
            if(status === 200) {
                const realPath = Platform.OS === 'android' ? 'file://' + resp.path() : '' + resp.path();
                toastService.success(t('books.documents.downloadSuccessMessage'), t('books.documents.downloadSuccessDescription'));

                // Optional - if we want to open it immediately in the viewer:
                setPdfPath(`${realPath}`);
            }
            
        } catch (err: any) {
            console.log('Download failed: ', err.message);

            if (err.message.includes('Status Code = 16')) {
                toastService.error(
                    t('books.documents.invalidPeriodMessage'),
                    t('books.documents.fromAfterToDescription')
                );
            } else {
                toastService.error(
                    "1", "2"
                );
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const onFromDateChange = (event, selectedDate) => {
        setShowFromDatePicker(false);
        setFromDate(selectedDate);
        request.period.from = dateService.formatBackendDate(selectedDate);
    };

    const onToDateChange = (event, selectedDate) => {
        setShowToDatePicker(false);
        setToDate(selectedDate);
    };

    const periodForm = (
        <Animated.View style={animatedStyle}>
            <VStack style={{ gap: 10 }}>
                <LabeledTextField label={t('books.documents.yearFrom')} disabled={true} value={dateService.formatLocalDate(fromDate)} />
                <BasicButton title="Izaberi" onPress={() => setShowFromDatePicker(true)} />
            </VStack>
            
            <VStack style={{ gap: 10 }}>
                <LabeledTextField label={t('books.documents.yearTo')} disabled={true} value={dateService.formatLocalDate(toDate)} />
                <BasicButton title="Izaberi" onPress={() => setShowToDatePicker(true)} />
            </VStack>
        </Animated.View>
    );

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
                    <VStack>
                        { bookkeepingMode === 'yearly' ? null : periodForm }
                        <DocumentItem
                            title={props.title}
                            documentType={docType}
                        />
                        
                    </VStack>
                );
            }}
            datePickersContent={datePickersContent}
            bookkeepingModeChange={setBookkeepingMode}
        />
    );
};

export default IncomeBookScreen;