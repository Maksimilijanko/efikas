import { router } from "expo-router";
import { fileService } from "./fileService";
import { toastService } from "./toastService";
import { t } from "i18next";

export const pdfService = {
	openPdf: (path: string) => {
		router.push({
			pathname: '/pdfView',
			params: {
				uri: `${path}`
			}
		});
		toastService.success(t('books.documents.viewSuccessMessage'), t('books.documents.viewSuccessDescription'));
	},

	deletePdf: (path: string) => {
		fileService.deleteFile(path);
		toastService.success(t('books.messages.successfulDeleteTitle'), t('books.messages.successfulDeleteMessage'));
	}
}