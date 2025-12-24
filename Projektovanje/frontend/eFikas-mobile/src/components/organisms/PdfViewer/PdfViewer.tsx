import { Dimensions, StyleSheet, View } from "react-native";

import Pdf, { Source } from 'react-native-pdf';

interface Props {
    pdfSource: number | Source;
}

export default function PdfViewer(props: Props) {
    return(
        // <View style={styles.container}>
        //     <Pdf
        //         source={props.pdfSource}
        //         onLoadComplete={(numberOfPages,filePath) => {
        //             console.log(`Number of pages: ${numberOfPages}`);
        //         }}
        //         onPageChanged={(page,numberOfPages) => {
        //             console.log(`Current page: ${page}`);
        //         }}
        //         onError={(error) => {
        //             console.log(error);
        //         }}
        //         onPressLink={(uri) => {
        //             console.log(`Link pressed: ${uri}`);
        //         }}
        //         style={styles.pdf}
        //     />
        // </View>

        <Pdf
            source={props.pdfSource}
            onLoadComplete={(numberOfPages,filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page,numberOfPages) => {
                console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
        />
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});