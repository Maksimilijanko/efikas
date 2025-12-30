import { Platform } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util"
import { BookPath } from "../types/types";

export const RNBlobUtilService = {
    createDirectory: (path: string) => {
        if(ReactNativeBlobUtil.fs.exists(path))
            ReactNativeBlobUtil.fs.mkdir(path);
    },

    fileExists: (path: string): boolean => {
        if(ReactNativeBlobUtil.fs.exists(path)) return true;

        return false;
    },

    lsDir: async (path: string): Promise<string[]> => {
        return await ReactNativeBlobUtil.fs.ls(path);
    },

    loadDownloadedBooks: async (path: string): Promise<BookPath[]> => {
        if (Platform.OS !== 'android') return [];

        if(!ReactNativeBlobUtil.fs.exists(path)) {
            return [];
        }

        const files = await RNBlobUtilService.lsDir(path);

        return files
            .filter(name => name.toLowerCase().endsWith('.pdf'))
            .map(name => ({
                displayName: name.replace('.pdf', ''),
                path: `file://${path}/${name}`,
            }));
    }
}