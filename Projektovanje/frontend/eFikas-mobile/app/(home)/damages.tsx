import DamageScreen from "@/src/components/screens/DamageScreen/DamageScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Damages() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DamageScreen />
    </GestureHandlerRootView>
  );
}