import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { findFiscalDeviceIp } from "@/src/util/NetworkScanner";
import { useEffect } from 'react';
import { API_URLS } from "@/src/util/apiConstants";


export default function RootLayout() {
  useEffect(() => {
      const initializeApp = async () => {
        console.log("🚀 Aplikacija se pokreće, tražim kasu...");
        
        const foundIp = await findFiscalDeviceIp(API_URLS.cash_register.api_token);
        
        if (foundIp) {
          
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
