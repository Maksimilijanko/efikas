import { fileService } from "@/src/services/fileService";
import { GuestBookType } from "@/src/types/enums";
import { DownloadIncomeBookRequest, GuestsBookRequest, PdfResult } from "@/src/types/types";
import { API_URLS } from "@/src/util/apiConstants";
import { Platform } from "react-native";
import ReactNativeBlobUtil, { FetchBlobResponse } from "react-native-blob-util";


import { File, Directory, Paths } from 'expo-file-system';

import * as Sharing from 'expo-sharing';

type BlobFetchOptions = {
  downloadPath?: string; // full file path INCLUDING filename
  description?: string;
};

const fetchPdfHelper = async (
  url: string,
  options?: BlobFetchOptions
): Promise<PdfResult> => {
  let file: File;

  if (options?.downloadPath) {
    // Custom absolute path (Documents / Downloads)
    file = new File(options.downloadPath);
  } else {
    // Cache fallback
    const dir = new Directory(Paths.cache, 'pdfs');
    await dir.create({ intermediates: true });

    const fileName = `book_${Date.now()}.pdf`;
    file = new File(dir, fileName);
  }

  const result = await File.downloadFileAsync(url, file, {
    headers: {
      Accept: 'application/pdf',
    },
  });

  if (!result.exists) {
    throw new Error('PDF download failed');
  }

  return { uri: result.uri };
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
    streamIncomeBook: async (request: DownloadIncomeBookRequest): Promise<PdfResult>  => {
        const url = buildIncomeBookUrl(request);

        return fetchPdfHelper(url);
    },

    streamGuestsBook: async (type: GuestBookType, request: GuestsBookRequest): Promise<PdfResult> => {     
        const url = buildGuestsBookUrl(type, request);
        
        return fetchPdfHelper(url);
    },


    /* ==================================== DOWNLOADING BOOKS ==================================== */
    downloadIncomeBook: async (downloadPath: string, request: DownloadIncomeBookRequest): Promise<PdfResult> => {
        const url = buildIncomeBookUrl(request);
        const description = 'Downloading Income Book PDF';

        return fetchPdfHelper(url, { downloadPath, description: description });
    },

    downloadGuestsBook: async (downloadPath: string, type: GuestBookType, request: GuestsBookRequest): Promise<PdfResult> => {
        const url = buildGuestsBookUrl(type, request);
        const description = 'Downloading Guests Book PDF';
        
        return fetchPdfHelper(url, { downloadPath, description: description });
    },
}