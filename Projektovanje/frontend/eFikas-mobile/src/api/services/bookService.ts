import { GuestBookType } from "@/src/types/enums";
import { DownloadIncomeBookRequest, GuestsBookRequest } from "@/src/types/types";
import { API_URLS } from "@/src/util/apiConstants";
import { act } from "react";
import ReactNativeBlobUtil, { FetchBlobResponse } from "react-native-blob-util";

const getBlobResponseHelper = async (downloadPath: string, description: string, url: string): Promise<FetchBlobResponse> => {
    return ReactNativeBlobUtil.config({
        fileCache: true,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: downloadPath,
            description: description,
            mime: 'application/pdf',
            mediaScannable: true,
        },
    }).fetch('GET', url, {
        Accept: 'application/pdf',
    });
}

export const bookService = {
    downloadIncomeBook: async (downloadPath: string, downloadIncomeBookRequest: DownloadIncomeBookRequest): Promise<FetchBlobResponse> => {
        const from = downloadIncomeBookRequest.period.from, to = downloadIncomeBookRequest.period.to;
        const taxpayerId = downloadIncomeBookRequest.taxpayerId;
        const url = `${API_URLS.books.getIncomeBookPdf}?taxpayerId=${taxpayerId}&from=${from}&to=${to}`;
        const description = 'Downloading Income Book PDF';

        return getBlobResponseHelper(downloadPath, description, url);
    },

    downloadGuestsBook: async (downloadPath: string, type: GuestBookType, guestsBookRequest: GuestsBookRequest): Promise<FetchBlobResponse> => {
        const from = guestsBookRequest.period.from, to = guestsBookRequest.period.to;
        const active = guestsBookRequest.active;        
        const url = type === GuestBookType.DOMESTIC_GUESTS ?
            `${API_URLS.books.getDomesticGuestsBookPdf}?active=${active}&from=${from}&to=${to}`
            :
            `${API_URLS.books.getForeignGuestsBookPdf}?active=${active}&from=${from}&to=${to}`;
        const description = 'Downloading Guests Book PDF';
        
        return getBlobResponseHelper(downloadPath, description, url);
    },
}