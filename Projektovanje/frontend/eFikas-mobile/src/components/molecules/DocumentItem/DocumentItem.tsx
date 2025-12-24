import { IconButton } from "@/src/components/atoms/IconButton/IconButton";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
// import { Colors } from '@/src/styles/style';
import { MessageDialog } from "@/src/components/organisms/Dialogs/MessageDialog/MessageDialog";
import { Spinner } from "@/src/components/ui/spinner";
import { useDownload } from "@/src/hooks/useDownload";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

export type DocumentType = 
    | 'IncomeBook'  // Knjiga prihoda
    | 'ExpenseBook' // Knjiga rashoda
    | 'DomesticGuestsBook' // Knjiga domacih gostiju
    | 'ForeignGuestsBook'; // Knjiga stranih gostiju

export type DocumentItemProps = {
    title: string;
    documentType: DocumentType;
};

const DocumentItem: React.FC<DocumentItemProps> = ({ title, documentType }) => {
    const { t } = useTranslation();
    const { Colors } = useTheme();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { downloadDocument, isDownloading, downloadError } = useDownload();

    const styles = getStyles(Colors);

    // Reakcija na gresku iz hook-a
    useEffect(() => {
        if (downloadError) {
            Alert.alert(
                t('books.documents.downloadErrorTitle'),
                downloadError);
        }
    }, [downloadError]);

    const handleDownloadPress = async () => {
        const success = await downloadDocument(documentType);
    
        if (success) {
            setIsDialogOpen(true);
        }
        // Ako nije uspjelo (success je false), greska se vec prikazuje putem useEffect/Alert
    };

    return (
        <View>
            <View style={styles.container}>
                <Text style={[styles.title, { marginRight: 10 }]}>{title}</Text> 
                {isDownloading ? (
                    <Spinner 
                        size="small" 
                        color={Colors.primary}
                    />
                ) : (
                    <IconButton 
                        iconName="Download"
                        onPress={handleDownloadPress}
                        size={24}
                        color={Colors.textPrimary}
                    />
                )}
            </View>
            <MessageDialog
                visible={isDialogOpen}
                title={t("dialogs.download.title")}
                description={t("dialogs.download.subtitle")}
                primaryText={t("dialogs.download.okButton")}
                onPrimary={() => setIsDialogOpen(false)}
            />
        </View>
    );
};

const getStyles = (Colors: any) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 36,
            borderRadius: 20,
            paddingHorizontal: 24,
            borderColor: Colors.borderColor,
            borderWidth: 1,
            backgroundColor: Colors.background,
            ...Platform.select({
              ios: {
                shadowColor: Colors.shadowColor,
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 4 },
              },
              android: { 
                elevation: 2,
              },
            }),
        },

        title: {
            fontSize: 18,
            fontWeight: "600",
            color: Colors.textPrimary,
        },
    });

export default DocumentItem;