import { GuestBookType } from "@/src/types/enums";
import { DownloadIncomeBookRequest, GuestsBookRequest } from "@/src/types/types";
import { API_URLS } from "@/src/util/apiConstants";
import ReactNativeBlobUtil, { FetchBlobResponse } from "react-native-blob-util";

export const bookService = {
    downloadIncomeBook: async (downloadIncomeBookRequest: DownloadIncomeBookRequest): Promise<FetchBlobResponse> => {
        const resp = await ReactNativeBlobUtil.fetch(
            'POST',
            API_URLS.books.getIncomeBookPdf,
            {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf',
                // add Authorization header if needed
            },
            JSON.stringify(downloadIncomeBookRequest)
        );
        return resp; 
    },

    downloadGuestsBook: async (type: GuestBookType, guestsBookRequest: GuestsBookRequest): Promise<FetchBlobResponse> => {
        const url = type === GuestBookType.DOMESTIC_GUESTS ?
            API_URLS.books.getDomesticGuestsBookPdf
            :
            API_URLS.books.getForeignGuestsBookPdf;
        
        const resp = await ReactNativeBlobUtil.fetch(
            'POST',
            url,
            {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf',
                // add Authorization header if needed
            },
            JSON.stringify(guestsBookRequest)
        );
        return resp; 
    },
}