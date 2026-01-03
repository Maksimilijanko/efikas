import { useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { useTranslation } from "react-i18next";
import { GuestBookType } from '../types/enums';
import { bookService } from '../api/services/bookService';
import { Directory, Paths } from 'expo-file-system';
import { DocumentType } from '../components/molecules/DocumentItem/DocumentItem';
import { fileService } from '../services/fileService';
import { PATH_CONSTANTS } from '../util/pathConstants';
import { toastService } from '../services/toastService';
import { DateRangeDTO, DownloadIncomeBookRequest, GuestsBookRequest, PdfResult } from '../types/types';
import { dateService } from '../services/dateService';

import * as Sharing from 'expo-sharing';

export const useDownload = () => {
    const { t } = useTranslation();

    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [pdfPath, setPdfPath] = useState<string | null>(null);

    //#region Validation 

    const isInvalidPeriod = (period: DateRangeDTO): boolean => {
        if (!period.from || !period.to) return true;
        return new Date(period.from) > new Date(period.to);
    };

    const checkPeriodValidity = (period: DateRangeDTO): boolean => {
        if (isInvalidPeriod(period)) {
            toastService.error(
                t('books.documents.invalidPeriodMessage'),
                t('books.documents.fromAfterToDescription')
            );
            return false;
        }
        return true;
    }

    //#endregion


    //#region Building
    const buildIncomeRequest = (dateFormVisible: boolean, period: DateRangeDTO): DownloadIncomeBookRequest => ({
        period: {
            from: dateFormVisible
            ? period.from
            : `${new Date().getFullYear()}-01-01`,
            to: dateFormVisible
            ? period.to
            : dateService.formatBackendDate(new Date()),
        },
        taxpayerId: 1,
        storeId: 0,
    });

    const buildGuestsRequest = (
        dateFormVisible: boolean,
        period: DateRangeDTO
    ): GuestsBookRequest => ({
        period: {
            from: dateFormVisible
                ? period.from
                : `${new Date().getFullYear()}-01-01`,
            to: dateFormVisible
                ? period.to
                : dateService.formatBackendDate(new Date()),
        },
        active: false,
    });

    //#endregion

    //#region Core Executor 

    const executePdfAction = async (
        action: () => Promise<PdfResult>,
        {
            shareTitle,
            onSuccess,
            isStreaming = true,
        }: {
            shareTitle?: string;
            onSuccess?: (uri: string) => Promise<void> | void;
            isStreaming?: boolean;
        } = {}
    ) => {
        try {
            setDownloadError(null);
            setIsDownloading(true);

            const { uri } = await action();

            if (!(await fileService.fileExists(uri))) {
                throw new Error('File not found after download');
            }

            toastService.success(
                t('books.documents.downloadSuccessMessage'),
                t('books.documents.downloadSuccessDescription')
            );

            if (!isStreaming && shareTitle && (await Sharing.isAvailableAsync())) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: t('books.documents.sharingSavePdfTitle', {
                        title: shareTitle,
                    }),
                });
            }

            setPdfPath(uri);
            await onSuccess?.(uri);
        } catch (err: any) {
            setDownloadError(
                err.message || t('books.documents.downloadErrorMessage')
            );
        } finally {
            setIsDownloading(false);
        }
    };

    //#endregion

    /*  ================================== PUBLIC API ================================== */

    //#region Streaming 
    const streamIncomeBook = async (dateFormVisible: boolean, period: DateRangeDTO) => {
        if(!checkPeriodValidity(period)) return;

        const request = buildIncomeRequest(dateFormVisible, period);

        await executePdfAction(() =>
            bookService.streamIncomeBook(request),
        );
    }

    const streamGuestsBook = async (
        type: GuestBookType,
        dateFormVisible: boolean,
        period: DateRangeDTO
    ) => {
        if(!checkPeriodValidity(period)) return;

        const request = buildGuestsRequest(dateFormVisible, period);

        await executePdfAction(() =>
            bookService.streamGuestsBook(type, request)
        );
    };

    //#endregion


    //#region Downloading 

    const downloadIncomeBook = async (
        dateFormVisible: boolean,
        period: DateRangeDTO,
        onSuccess?: () => Promise<void> | void
    ) => {
        if(!checkPeriodValidity(period)) return;

        const request = buildIncomeRequest(dateFormVisible, period);

        const dir = fileService.getPdfDirectory(PATH_CONSTANTS.incomeBookPath);
        await fileService.ensureDirectory(dir);

        const title = t('books.documents.incomeBookDownloadTitle');
        const fileName = `${title}_${Date.now()}.pdf`;
        const filePath = `${dir.uri}${fileName}`;

        await executePdfAction(
            () => bookService.downloadIncomeBook(filePath, request),
            {
                isStreaming: false,
                shareTitle: fileName,
                onSuccess,
            }
        );
    };

    const downloadGuestsBook = async (
        type: GuestBookType,
        dateFormVisible: boolean,
        period: DateRangeDTO,
        onSuccess?: () => Promise<void> | void
    ) => {
        if(!checkPeriodValidity(period)) return;

        const request = buildGuestsRequest(dateFormVisible, period);

        const dir = fileService.getPdfDirectory(PATH_CONSTANTS.guestsBookPath);
        await fileService.ensureDirectory(dir);

        const title =
            type === GuestBookType.DOMESTIC_GUESTS
                ? t('books.documents.domesticGuestsBookDownloadTitle')
                : t('books.documents.foreignGuestsBookDownloadTitle');

        const fileName = `${title}_${Date.now()}.pdf`;
        const filePath = `${dir.uri}${fileName}`;

        await executePdfAction(
            () => bookService.downloadGuestsBook(filePath, type, request),
            {
                isStreaming: false,
                shareTitle: fileName,
                onSuccess,
            }
        );
    };

    //#endregion

    return {
        /* state */
        isDownloading,
        downloadError,
        pdfPath,

        /* actions */
        streamIncomeBook,
        streamGuestsBook,
        downloadIncomeBook,
        downloadGuestsBook,
    };
};