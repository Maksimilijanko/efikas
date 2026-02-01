import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { findFiscalDeviceIp } from "@/src/util/NetworkScanner";
import { useEffect } from 'react';
import { API_URLS } from "@/src/util/apiConstants";
import { asyncStorageService } from "@/src/services/asyncStorageService";
import { ASYNC_STORAGE_KEYS } from "@/src/util/secureStoreKeys";


export default function RootLayout() {
  useEffect(() => {
      const initializeApp = async () => {
        console.log("🚀 Aplikacija se pokreće, tražim kasu...");
        
        const foundIp = await findFiscalDeviceIp(API_URLS.cash_register.api_token);
        
        if (foundIp) {
          asyncStorageService.setItemAsync(ASYNC_STORAGE_KEYS.cashRegisterIp, foundIp);
          console.log("🔗 Spojen na kasu:", foundIp);
        }
      };

      initializeApp();
    }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
