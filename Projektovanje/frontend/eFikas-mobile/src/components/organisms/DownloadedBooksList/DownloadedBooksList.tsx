import { ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Icon } from "../../atoms/Icon/Icon";
import { Label } from "../../atoms/Label/Label";
import { HStack } from "../../ui/hstack";
import { VStack } from "../../ui/vstack";
import { styles } from "./index.styles";
import { Image } from "../../ui/image";
import { Spinner } from "../../ui/spinner";
import { BookPath } from "@/src/types/types";
import MissingItemsNotifier from "../../molecules/MissingItemsNotifier/MissingItemsNotifier";


interface Props {
    bookPaths?: BookPath[];
    loading: boolean;
}

export default function DownloadedBooksList({ bookPaths, loading }: Props) {
    const { t } = useTranslation();
    const { Colors } = useTheme();
    const PDF_ICON_PATH = '..//..//..//..//assets//images//pdfIcon.png';

    const openPdf = (path: string) => {
        router.push({
            pathname: '/pdfView',
            params: {
                uri: `${path}`
            }
        });
    };

    return (
        <VStack style={styles.root}>
            <Label text={t('books.downloadedList.title')} />

            <ScrollView>
                { loading &&
                    <Spinner size="large" color="gray" />
                }

                {(bookPaths == null || bookPaths.length === 0) && 
					<MissingItemsNotifier label={t('books.downloadedList.noBooks')} />
                }

                <VStack style={styles.linksContainer}>
                    {bookPaths?.map((book, index) => (
                        <TouchableOpacity
                            key={book.path}
                            onPress={() => openPdf(book.path)}
                        >
                            <HStack style={styles.item}>
                                <Image
                                    size="xs"
                                    source={require(PDF_ICON_PATH)}
                                    alt="pdfIcon.svg"
                                />
                                <Label text={book.displayName} color={Colors.info} size="sm" />
                            </HStack>
                        </TouchableOpacity>
                    ))}
                </VStack>

                
            </ScrollView>
        </VStack>
        
    );
}