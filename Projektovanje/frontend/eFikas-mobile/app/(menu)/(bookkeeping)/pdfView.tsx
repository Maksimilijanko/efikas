import ViewPdfScreen from "@/src/components/screens/ViewPdfScreen/ViewPdfScreen";
import { useLocalSearchParams } from "expo-router";
import { Source } from "react-native-pdf";

export default function PdfView() {
    const { uri } = useLocalSearchParams<{ uri: string }>();

    if (!uri) return null;

    return <ViewPdfScreen pdfUri={uri} />
}