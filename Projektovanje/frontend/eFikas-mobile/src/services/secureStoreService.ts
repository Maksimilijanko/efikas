import * as SecureStore from 'expo-secure-store';

export const secureStoreService = {
    setItemAsync: async (key: string, itemJson: string) => {
        return await SecureStore.setItemAsync(key, itemJson);
    },

    getItemAsync: async(key: string): Promise<string | null> => {
        return await SecureStore.getItemAsync(key);
    },

    deleteItemAsync: async(key: string) => {
        return await SecureStore.deleteItemAsync(key);
    },
}