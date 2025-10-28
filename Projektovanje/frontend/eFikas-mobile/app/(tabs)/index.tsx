import { Button, ButtonText } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import Dropdown from "@/src/components/atoms/Dropdown/Dropdown";
import Icon from "@/src/components/atoms/Icon/Icon";
import LinkButton from "@/src/components/atoms/LinkButton/LinkButton";
import AnalyticsBar from "@/src/components/molecules/AnalyticsBar/AnalyticsBar";
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

                <AnalyticsBar label="Troskovi" value={50} maxValue={100} />
                <LinkButton label="Prikazi vise" />
            </View>
        </I18nextProvider>
    );
    
}