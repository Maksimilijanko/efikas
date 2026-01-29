import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { findFiscalDeviceIp } from "@/src/util/NetworkScanner";


export default function RootLayout() {
  useEffect(() => {
      const initializeApp = async () => {
        console.log("🚀 Aplikacija se pokreće, tražim kasu...");
        
        const foundIp = await findFiscalDeviceIp();
        
        if (foundIp) {
          // TODO: save info
          
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
