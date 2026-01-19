import { StyleSheet } from "react-native";
import { Colors } from '@/src/styles/style';

export const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 12,
        marginVertical: 6,
        shadowColor: Colors.shadowColor,
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3.8,
        // elevation: 5,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2.5,
        elevation: 5,
    },
    hstack: {
        justifyContent: "space-between",
        alignItems: "center",
    },
    rightElement: {
		
    },
});
