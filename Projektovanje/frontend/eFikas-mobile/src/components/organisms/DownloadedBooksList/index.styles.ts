import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 0.3,
        width: '90%',
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    linksContainer: {
        gap: 10
    },
    item: {
        gap: 10,
        alignItems: 'center'
    },
});