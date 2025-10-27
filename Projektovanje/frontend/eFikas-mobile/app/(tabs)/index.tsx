import { Button, ButtonText } from "@/components/ui/button";
import { MailIcon, SearchIcon } from "@/components/ui/icon";
import { SelectItem } from "@/components/ui/select";
import Dropdown from "@/src/components/atoms/Dropdown/Dropdown";
import FloatButton from "@/src/components/atoms/FloatButton/FloatButton";
import Icon from "@/src/components/atoms/Icon/Icon";
import LabelSeparator from "@/src/components/atoms/LabelSeparator/LabelSeparator";
import TextField from "@/src/components/atoms/TextField/TextField";
import ToggleButton from "@/src/components/atoms/ToggleButton/ToggleButton";
import { LoginButton } from "@/src/components/atoms/LoginButton/LoginButton";
import { BasicButton } from "@/src/components/atoms/BasicButton/BasicButton";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { SegmentedControl } from "@/src/components/atoms/SegmentedControl/SegmentedControl";
import { Label } from "@/src/components/atoms/Label/Label";
import { IconButton } from "@/src/components/atoms/IconButton/IconButton";
// import { Calendar } from "@/src/components/atoms/Calendar/Calendar";
import { MenuItem } from "@/src/components/molecules/MenuItem/MenuItem";
import LabeledTextField from "@/src/components/molecules/LabeledTextField/LabeledTextField";
import { ScrollView } from 'react-native';
import i18n from "@/src/i18n";
import { useState } from "react";

import { I18nextProvider } from "react-i18next";
import { GestureResponderEvent, Text, View } from "react-native";


// opcije za slajder (SegmentedControl)
const options = ['Završene', 'Aktivne', 'Predstojeće'];

export default function Index() {

    const items = [
        { id: 1, label: "Apple", value: "apple" },
        { id: 2, label: "Banana", value: "banana" },
    ];
    const [toggle, setToggle] = useState(false);

    // Selektktovana opcija - default
    const [selectedOption, setSelectedOption] = useState('Aktivne');

    return(
        <I18nextProvider i18n={i18n}>
            <View style={{height: '100%'}} >
                <Text>Home stranica test</Text>
                
                {/* Dugmad */}
                {/* <LoginButton title = "Prijavi se" onPress={() => alert("Login")} /> */}
                {/* <LoginButton
                    title="Sign In"
                    onPress={() => alert("Login button pressed")}
                    className="w-[346px] h-[46px] rounded-[10px] justify-center items-center self-center bg-[rgb(var(--color-primary-500))]"
                    textClassName="text-white font-semibold"
                /> */}

                {/* <BasicButton title = "Štampaj račun" onPress={() => alert("Račun se štampa...")} /> */}
                {/* <BasicButton
                    title="Save"
                    onPress={() => alert("Cuvanje...")}
                    className="w-[190px] h-[46px] rounded-[32px] justify-center items-center self-center bg-[rgb(var(--color-primary-500))]"
                    textClassName="text-white font-semibold"
                /> */}

                {/* <DialogButton title = "Potvrdi" onPress={() => alert("Fiskalizacija uspjesno izvrsena")} /> */}
                {/* <DialogButton
                    title="Cancel"
                    onPress={() => alert("Otkazanoo")}
                    className="bg-gray-300"
                    textClassName="text-black"
                /> */}

                {/* Slider */}
                {/* <SegmentedControl
                    options={options}
                    selectedOption={selectedOption}
                    onOptionPress={setSelectedOption}
                />  */}

                {/* Labele */}
                {/* <Label text="Email" size="md" />
                <Label text="Email" required={true} size="md" />
                <Label text="Naslov" size="xl" />
                <Label text="Veliki naslov" size="3xl" align="center" />
                <Label text="Email adresa" className="text-[rgb(var(--color-tertiary-950))]" /> */}
               
               {/* Icon button-i */}
                {/* <Icon name="Home" />
                <IconButton 
                    iconName="Home" 
                    color="#333"
                    onPress={() => console.log("Home clicked")} 
                    className = "justify-center items-center"
                />
                <IconButton 
                    iconName="Settings" 
                    size={28}
                    color="#3176B8"
                    onPress={() => console.log("Settings clicked")} 
                />
                <IconButton 
                    iconName="Trash" 
                    disabled={true}
                    size={24} 
                    onPress={() => alert("Da li ste sigurni da zelite da obrisete...?")}
                /> */}

                {/* Menu items */}
                {/* <MenuItem 
                    text = "Home" 
                    onPress={() => alert("Home Menu Item je pritisnut!")}
                />
                 <MenuItem 
                    text = "Korisnik" 
                    leftIconName="User"
                    onPress={() => alert("Korisnik Menu Item je pritisnut!")}
                />
                <MenuItem 
                    text="Podešavanja" 
                    onPress={() => alert("Podesavanja Menu Item je pritisnut!")} 
                    leftIconName="Settings" 
                    rightIconName="ChevronRight" 
                />
                <MenuItem 
                    text="Odjava" 
                    onPress={() => alert("Dovidjenja!")}  
                    leftIconName="LogOut" 
                    showDivider={false} 
                /> */}

                {/* <TextField
                    size = "xl"
                    icon="Mail" 
                    placeholder="Email"
                    iconLocation="left"
                />
                <TextField
                    icon="Lock"
                    placeholder="Password"
                    type="password"
                /> */}

                {/* Labeled Text Field */}
                {/* <LabeledTextField
                    label="Username"
                    labelSize="lg"
                    size="lg"
                    placeholder="Enter your username"
                    required
                    iconName="User"
                    iconLocation="left"
                />
                <LabeledTextField
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    required
                    error={true}
                    iconName="Lock"
                /> */}


                
            </View>
        </I18nextProvider>
    );

}