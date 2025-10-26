import { Button, ButtonText } from "@/components/ui/button";
import { MailIcon, SearchIcon } from "@/components/ui/icon";
import { SelectItem } from "@/components/ui/select";
import Dropdown from "@/src/components/atoms/Dropdown/Dropdown";
import FloatButton from "@/src/components/atoms/FloatButton/FloatButton";
import Icon from "@/src/components/atoms/Icon/Icon";
import LabelSeparator from "@/src/components/atoms/LabelSeparator/LabelSeparator";
import TextField from "@/src/components/atoms/TextField/TextField";
import ToggleButton from "@/src/components/atoms/ToggleButton/ToggleButton";
import i18n from "@/src/i18n";
import { useState } from "react";

import { I18nextProvider } from "react-i18next";
import { GestureResponderEvent, Text, View } from "react-native";

export default function Index() {

    const items = [
        { id: 1, label: "Apple", value: "apple" },
        { id: 2, label: "Banana", value: "banana" },
    ];
    const [toggle, setToggle] = useState(false);

    return(
        <I18nextProvider i18n={i18n}>
            <View style={{height: '100%'}} >
                <Text>Home stranica test</Text>
                <Button>
                    <ButtonText>Ovo je button od GlueStack v3</ButtonText>
                    
                </Button>


                <TextField iconLocation="right" icon={SearchIcon} placeholder={"Email"}   />
            </View>
        </I18nextProvider>
    );
    
}