import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        width: '90%',
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    linksContainer: {
        gap: 10,
		alignItems: 'stretch',
    },
	linksItemContainer: {
        gap: 10,
		alignItems: 'center',
		justifyContent: 'space-between'
    },
    item: {
        gap: 10,
        alignItems: 'center',
    },
});