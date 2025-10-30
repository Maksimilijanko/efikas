import i18n from "@/src/i18n";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Text, View } from "react-native";



// opcije za slajder (SegmentedControl)
const options = ['Završene', 'Aktivne', 'Predstojeće'];

export default function Index() {

    // const items = [
    //     { id: 1, label: "Apple", value: "apple" },
    //     { id: 2, label: "Banana", value: "banana" },
    // ];

    const [toggle, setToggle] = useState(false);
    // Selektktovana opcija - default
    const [selectedOption, setSelectedOption] = useState('Aktivne');

    const testReservations = [
    {
      id: "1",
      startDate: "2025-10-03",
      endDate: "2025-10-05",
      guestName: "Marko Marković",
      note: "Rezervacija za vikend",
    },
    {
      id: "2",
      startDate: "2025-11-06",
      endDate: "2025-11-08",
      guestName: "Ana Anić",
      note: "Porodična rezervacija",
    },
    {
      id: "3",
      startDate: "2025-11-08",
      endDate: "2025-11-10",
      guestName: "Ivan Ivanić",
      note: "Jednodnevna rezervacija",
    },
  ];
    
    const [selected, setSelected] = useState<string | number>('');

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
          Label text="Veliki naslov" size="3xl" align="center" />
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
            size={60}
            strokeWidth={2.3}
            color="#3176B8"
            onPress={() => console.log("Settings clicked")} 
          />
          <IconButton 
            iconName="Trash" 
            disabled={false}
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
            iconLocation="left"
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
            // error={true}
            iconName="Lock"
          /> */}

          {/* <ApartmentAttribute 
            label="Wi-Fi" 
            icon={<Icon name="Wifi" color="#3176B8"/>}
          /> */}

          {/* Apartment Feature Card */}
          {/* <ApartmentFeatureCard
            label="Parking"
            icon={<Icon name="SquareParking" size={24} color="#3176B8" />}
            rightElement={
                <Icon name="ChevronRight" size={24} color="#272439ff" />
            }
            backgroundColor="#e6e6e6ff"
          />
          <ApartmentFeatureCard
            label="Wi-Fi"
            icon={<Icon name="Wifi" size={24} color="#3176B8" />}
            rightElement={
              <Icon name="ChevronRight" size={24} color="#272439ff" />
            }
            onPress={() => alert("Otvori dialog za Wi-Fi")}
            backgroundColor="#e6e6e6ff"
          />
          <ApartmentFeatureCard
            label="Grijanje"
            icon={<Icon name="Thermometer" size={24} color="#3176B8" />}
            rightElement={
              <Switch
                size="md"
                trackColor={{ false: "#ccc", true: "#3176B8" }}
              />
            }
          /> */}

          {/* <IconCard iconName="Home" size={35} color="#3176B8" label="Početna" />
          <IconCard iconName="User" label="Profil" />
          <IconCard
            iconName="Settings"
            size={40}
            label="Postavke"
            onPress={() => alert("Settings!")}
            labelProps={{ error: false, align: "center" }}
          /> */}
          {/* <IconCard
            iconName="Wallet"
            size={40}
            color="#3176B8"
            label="Troškovi"
            onPress={() => alert("Troskovi!")}
            labelProps={{ error: false, align: "center", size: "xl", className: "text-black font-semibold" }}
          />
          <IconCard
            iconName="Wrench"
            size={40}
            strokeWidth = {1.5}
            color="#3176B8"
            label="Zadaci"
            onPress={() => alert("Zadaci!")}
            labelProps={{ error: false, align: "center", size: "xl", className: "text-[rgb(var(--color-primary-900))] font-bold"}}
          />
          <IconCard
            iconName="BrushCleaning"
            size={40}
            color="#3176B8"
            label="Šteta"
            onPress={() => alert("Stete!")}
            labelProps={{ error: false, align: "center" }}
          /> */}
                
          {/* <ReservationsCalendar reservations={testReservations} /> */}
          
          {/* <Dropdown
              options={[
                  { label: 'AA', value: 'AAA' },
                  { label: 'AA2', value: 'AAA2' }
              ]} 
              placeholder="Izaberite item"
              textInputPlaceholder="Pretraga"
              selectedValue={value} 
              setSelectedValue={setValue}
              label="Pretraga"
          /> */}
    </View>
  </I18nextProvider>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });