import { fileService } from "@/src/services/fileService";
import { GuestBookType } from "@/src/types/enums";
import { DownloadIncomeBookRequest, GuestsBookRequest, PdfResult } from "@/src/types/types";
import { API_URLS } from "@/src/util/apiConstants";
import { Platform } from "react-native";
import ReactNativeBlobUtil, { FetchBlobResponse } from "react-native-blob-util";


import { File, Directory, Paths } from 'expo-file-system';
import { SECURE_STORE_KEYS } from "@/src/util/secureStoreKeys";
import { secureStoreService } from "@/src/services/secureStoreService";

type BlobFetchOptions = {
	downloadPath?: string; // full file path INCLUDING filename
	description?: string;
};

export const fetchPdfHelper = async (
	url: string,
	options?: BlobFetchOptions
): Promise<PdfResult> => {
	let file: File;

	if (options?.downloadPath) {
		file = new File(options.downloadPath);
	}
	else {
		const dir = new Directory(Paths.cache, 'books');
		fileService.ensureDirectory(dir);

		file = new File(dir, `Book_${Date.now()}.pdf`);
	}

	// Ensure parent directory exists
	//await new Directory(file.parentDirectory).create({ intermediates: true });
	// 2. Manually get the token just like your interceptor does
    const authResponseString = await secureStoreService.getItemAsync(
        SECURE_STORE_KEYS.authenticationResponseKey
    );
    
    let token = "";
    if (authResponseString) {
        const authResponse = JSON.parse(authResponseString);
        token = authResponse.token;
    }

    // 3. Pass the token into the headers
    const result = await File.downloadFileAsync(url, file, {
        headers: {
            'Accept': 'application/pdf',
            'Authorization': `Bearer ${token}`, // <--- Add this line!
        },
        idempotent: true,
    });

	console.log("RESULT DOWNLOAD: ", result.uri);

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
	streamIncomeBook: async (request: DownloadIncomeBookRequest): Promise<PdfResult> => {
		const url = buildIncomeBookUrl(request);
		console.log("URL FOR BOOK: ", url)

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