import { Directory, File, Paths } from "expo-file-system";
import { BookPath } from "../types/types";


export const BASE_PATH = Paths.document;

export const fileService = {
    getPdfDirectory: (folder: string) => {
        return new Directory(BASE_PATH, folder);
    },

    fileExists: async (uri: string): Promise<boolean> => {
        const file = new File(uri);
        return await file.exists;
    },

    createDirectory: async (path: string) => {
        const dir = new Directory(path);
        await dir.create({ intermediates: true });
    },
    
    deleteDirectory: (dir: Directory) => {
        if(dir.exists)
            dir.delete();
    },
    
    ensureDirectory: async (dir: Directory) => {
        if(!dir.exists)
            await dir.create({ intermediates: true });
    },

    lsDir: (path: string): (Directory | File)[] => {
        return new Directory(path).list();
    },

    loadDownloadedBooks: async (path: string): Promise<BookPath[]> => {
        if(!new Directory(path).exists) {
            return [];
        }

        const entries = fileService.lsDir(path); // plain objects
        console.log("ENTR: ", entries)

        return entries
            .filter(entry =>
                entry.exists &&
                entry.uri.toLowerCase().endsWith('.pdf')
            )
            .map(entry => ({
                displayName: entry.uri
                    .split('/')
                    .pop()!
                    .replace('.pdf', ''),
                path: entry.uri,
            }));
    }
}