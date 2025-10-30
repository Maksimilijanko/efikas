import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App";


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}
