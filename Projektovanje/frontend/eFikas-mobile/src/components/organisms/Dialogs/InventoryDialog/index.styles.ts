import { StyleSheet } from "react-native";

export const getStyles = (Colors: any) =>
  StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: "center", 
        alignItems: "center"
    },
    centerContainer: {
        width: '80%',
        height: '80%',
        justifyContent: "center",
        alignItems: "center"
    },
    modalBox: {
        width: "100%",        
        maxHeight: "85%",       
        backgroundColor: Colors.background,
        padding: 20,
        borderRadius: 16,
        elevation: 6,
        justifyContent: 'space-evenly'
    },
    scrollStyle: {
        maxHeight: "80%", 
        paddingHorizontal: 10 
    }
});

