import TasksScreen from "@/src/components/screens/TasksScreen/TasksScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Tasks() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TasksScreen />
    </GestureHandlerRootView>
  );
}