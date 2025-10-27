import { Button, ButtonText } from "@/components/ui/button";
import Icon from "@/src/components/atoms/Icon/Icon";
import ApartmentAttribute from "@/src/components/molecules/ApartmentAttribute/ApartmentAttribute";
import i18n from "@/src/i18n";

import { I18nextProvider } from "react-i18next";
import { Text, View } from "react-native";

export default function Index() {

    return(
        <I18nextProvider i18n={i18n}>
            <View style={{height: '100%'}} >
                <Text>Home stranica test</Text>
                <Button>
                    <ButtonText>Ovo je button od GlueStack v3</ButtonText>
                    
                </Button>

                <ApartmentAttribute 
                    label="Wi-Fi" 
                    icon={<Icon name="wifi" />}
                />
            </View>
        </I18nextProvider>
    );
    
}