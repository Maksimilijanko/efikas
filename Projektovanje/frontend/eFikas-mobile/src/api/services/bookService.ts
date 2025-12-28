import { RNBlobUtilService } from "@/src/services/RNBlobUtilService";
import { GuestBookType } from "@/src/types/enums";
import { DownloadIncomeBookRequest, GuestsBookRequest } from "@/src/types/types";
import { API_URLS } from "@/src/util/apiConstants";
import { Platform } from "react-native";
import ReactNativeBlobUtil, { FetchBlobResponse } from "react-native-blob-util";


type BlobFetchOptions = {
    downloadPath?: string;
    description?: string;
};

const fetchPdfHelper = (url: string, options?: BlobFetchOptions): Promise<FetchBlobResponse> => {
    // return ReactNativeBlobUtil.config({
    //     fileCache: true,
    //     ...(options?.downloadPath && {
    //         addAndroidDownloads: {
    //             useDownloadManager: true,
    //             notification: true,
    //             path: options.downloadPath,
    //             description: options.description,
    //             mime: 'application/pdf',
    //             mediaScannable: true,
    //         },
    //     }),
    // }).fetch('GET', url, {
    //     Accept: 'application/pdf',
    // });

    const path = options?.downloadPath
    ? RNBlobUtilService.getPdfDownloadPath(options.downloadPath)
    : undefined;

    return ReactNativeBlobUtil.config({
        fileCache: true,
        path: Platform.OS === 'ios' ? path : undefined,

        ...(Platform.OS === 'android' && path
        ? {
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path,
                description: options?.description,
                mime: 'application/pdf',
                mediaScannable: true,
            },
            }
        : {}),
    }).fetch('GET', url, {
        Accept: 'application/pdf',
    });
};

const buildGuestsBookUrl = (type: GuestBookType, { active, period }: GuestsBookRequest) => {
    const base =
        type === GuestBookType.DOMESTIC_GUESTS
            ? API_URLS.books.getDomesticGuestsBookPdf
            : API_URLS.books.getForeignGuestsBookPdf;

    return `${base}?active=${active}&from=${period.from}&to=${period.to}`;
};

const buildIncomeBookUrl = ({ taxpayerId, period }: DownloadIncomeBookRequest) =>
    `${API_URLS.books.getIncomeBookPdf}?taxpayerId=${taxpayerId}&from=${period.from}&to=${period.to}`;

export const bookService = {
    /* ==================================== STREAMING BOOKS ==================================== */
    streamIncomeBook: async (request: DownloadIncomeBookRequest): Promise<FetchBlobResponse>  => {
        const url = buildIncomeBookUrl(request);

        return fetchPdfHelper(url);
    },

    streamGuestsBook: async (type: GuestBookType, request: GuestsBookRequest): Promise<FetchBlobResponse> => {     
        const url = buildGuestsBookUrl(type, request);
        
        return fetchPdfHelper(url);
    },


    /* ==================================== DOWNLOADING BOOKS ==================================== */
    downloadIncomeBook: async (downloadPath: string, request: DownloadIncomeBookRequest): Promise<FetchBlobResponse> => {
        const url = buildIncomeBookUrl(request);
        const description = 'Downloading Income Book PDF';

        return fetchPdfHelper(url, { downloadPath, description: description });
    },

    downloadGuestsBook: async (downloadPath: string, type: GuestBookType, request: GuestsBookRequest): Promise<FetchBlobResponse> => {
        const url = buildGuestsBookUrl(type, request);
        const description = 'Downloading Guests Book PDF';
        
        return fetchPdfHelper(url, { downloadPath, description: description });
    },
}