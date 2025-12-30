import { Platform } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import { BookPath } from "../types/types";
import { Directory, File, Paths } from "expo-file-system";


const BASE_PATH_ANDROID = ReactNativeBlobUtil.fs.dirs.DownloadDir;
const BASE_PATH_IOS = ReactNativeBlobUtil.fs.dirs.DocumentDir;

export const fileService = {
    getPdfDownloadPath: (filename: string): string => {
        if (Platform.OS === 'android') {
            return `${BASE_PATH_ANDROID}/${filename}`;
        }

        // iOS
        return `${BASE_PATH_IOS}/${filename}`;
    },

    fileExists: (path: string): boolean => {
        const file = new File(Paths.cache, path, "file.txt");
        return file.exists;
    },

    createDirectory: async (path: string) => {
        const dir = new Directory(path);
        await dir.create({ intermediates: true });
    },

    lsDir: async (path: string): Promise<string[]> => {
        return await ReactNativeBlobUtil.fs.ls(path);
    },

    loadDownloadedBooks: async (path: string): Promise<BookPath[]> => {
        if (Platform.OS !== 'android') return [];

        if(!ReactNativeBlobUtil.fs.exists(path)) {
            return [];
        }

        const files = await fileService.lsDir(path);

        return files
            .filter(name => name.toLowerCase().endsWith('.pdf'))
            .map(name => ({
                displayName: name.replace('.pdf', ''),
                path: `file://${path}/${name}`,
            }));
    }
}