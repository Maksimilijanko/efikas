import { useTheme } from "@/src/providers/ThemeProvider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import { Icon } from "../../atoms/Icon/Icon";
import { Label } from "../../atoms/Label/Label";
import { HStack } from "../../ui/hstack";
import { VStack } from "../../ui/vstack";
import { styles } from "./index.styles";
import { Image } from "../../ui/image";


interface BookPath {
    displayName: string;
    path: string;
}

interface Props {
    bookPaths?: BookPath[];
}

export default function DownloadedBooksList({ bookPaths }: Props) {
    const { t } = useTranslation();
    const { Colors } = useTheme();
    const [books, setBooks] = useState<BookPath[]>([]);
    const [loading, setLoading] = useState(true);
    const PDF_ICON_PATH = '..//..//..//..//assets//images//pdfIcon.png';

    const loadDownloadedBooks = async (): Promise<BookPath[]> => {
        if (Platform.OS !== 'android') return [];

        const dir = ReactNativeBlobUtil.fs.dirs.DownloadDir;

        const files = await ReactNativeBlobUtil.fs.ls(dir);

        return files
            .filter(name => name.toLowerCase().endsWith('.pdf'))
            .map(name => ({
                displayName: name.replace('.pdf', ''),
                path: `file://${dir}/${name}`,
            }));
    };

    const openPdf = (path: string) => {
        router.push({
            pathname: '/pdfView',
            params: {
                uri: `${path}`
            }
        });
    };

    useEffect(() => {
        (async () => {
        try {
            const result = await loadDownloadedBooks();
            setBooks(result);
        } finally {
            setLoading(false);
        }
        })();
    }, []);

    return (
        <VStack style={styles.root}>
            <Label text={t('books.downloadedList.title')} />
            <ScrollView >
                {(books == null || books.length === 0) &&
                    <HStack>
                        <Icon name="Info" />
                        <Label text={t('books.downloadedList.noBooks')} color="gray" />
                    </HStack> 
                }

                <VStack style={styles.linksContainer}>
                    {books?.map((book, index) => (
                        <TouchableOpacity
                            key={book.path}
                            onPress={() => openPdf(book.path)}
                        >
                            <HStack style={styles.item}>
                                <Image
                                    size="xs"
                                    // source={{
                                    //     uri: "https://commons.wikimedia.org/wiki/File:PDF_file_icon.svg"
                                    // }}
                                    source={require(PDF_ICON_PATH)}
                                    alt="pdfIcon.svg"
                                />
                                <Label text={book.displayName} color={Colors.info} />
                            </HStack>
                        </TouchableOpacity>
                    ))}
                </VStack>

                
            </ScrollView>
        </VStack>
        
    );
}