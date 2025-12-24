import ExpensesScreen from "@/src/components/screens/ExpensesScreen/ExpensesScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Expenses() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExpensesScreen />
    </GestureHandlerRootView>
  );
}