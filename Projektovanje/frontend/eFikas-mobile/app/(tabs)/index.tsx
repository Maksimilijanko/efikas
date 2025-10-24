import { Button, ButtonText } from "@/components/ui/button";
import i18n from "@/src/i18n";

import { I18nextProvider } from "react-i18next";
import { Text } from "react-native";

export default function Index() {
    return(
        <I18nextProvider i18n={i18n}>
            <>
                <Text>Home stranica test</Text>
                <Button>
                    <ButtonText>Ovo je button od GlueStack v3</ButtonText>
                </Button>
            </>
        </I18nextProvider>
    );
    
}