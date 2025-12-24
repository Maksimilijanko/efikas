import { Source } from "react-native-pdf";
import PdfViewer from "../../organisms/PdfViewer/PdfViewer";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/src/providers/ThemeProvider";

interface Props {
    pdfUri: string;
}

export default function ViewPdfScreen({ pdfUri }: Props) {
    const { Colors } = useTheme();
    const styles = getStyles(Colors);
    const pdfSource = { uri: pdfUri };

    return (
        <View style={styles.pdfSection}>
            { pdfSource ? (
                    <PdfViewer 
                        pdfSource={pdfSource}
                    />
                )
                :
                    null
            }
        </View>
    )
}

const getStyles = (Colors: any) =>
  StyleSheet.create({
    pdfSection: {
      flex: 1, // Takes remaining 65% of screen
      backgroundColor: Colors.screenBackground,
    },
    pdfViewer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.screenBackground,
    },
    loadingText: {
      color: Colors.textPrimary,
      fontSize: 16,
    },

    placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 16,
      color: Colors.gray,
      fontStyle: 'italic',
    },
  });