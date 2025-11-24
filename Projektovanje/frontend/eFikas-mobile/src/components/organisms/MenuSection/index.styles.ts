import { StyleSheet } from 'react-native';
import { Colors } from "@/src/styles/style";

export const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        color: Colors.primary,
        marginBottom: 15,
        marginLeft: 5,
    },
    listContainer: {
        borderRadius: 10,
        overflow: "hidden",
    },
    sectionMargin: {
        marginTop: 20,
    },
});