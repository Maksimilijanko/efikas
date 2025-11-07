import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/src/styles/style";

import { MenuItem } from "@/src/components/molecules/MenuItem/MenuItem";


export default function Menu() {
   //Naknadno dodati logiku nakon implementacije ostalih komponenti 
    const handleItemPress = (item: string) => {
    
     switch (item) {
        
         case "Profil":
             console.log("Navigacija: Otvori detalje profila."); 
             break;
         
         case "Obavještenja":
             console.log("Navigacija: Otvori ekran sa obaveštenjima.");
             break;

         case "Moji stanovi":
             console.log("Navigacija: Otvori listu stanova.");
             break;

         case "Troškovi":
             console.log("Navigacija: Otvori sekciju Troškovi.");
             break;

         case "Statistika":
             console.log("Navigacija: Otvori grafikone statistike.");
             break;

         case "Knjiga prihoda":
             console.log("Navigacija: Otvori sekciju Knjiga prihoda.");
             break;

         case "Knjiga rashoda":
             console.log("Navigacija: Otvori sekciju Knjiga rashoda.");
             break;

         case "Knjiga gostiju":
             console.log("Navigacija: Otvori Knjigu gostiju.");
             break;
             
         
         case "Podešavanja":
             console.log("Navigacija: Otvori opšte podešavanje aplikacije.");
             break;

         case "O aplikaciji":
             console.log("Prikaz: Informacije o aplikaciji i verziji.");
             break;

         case "Odjava":
             console.log("Akcija: Pokreni proces odjave (briši token).");
             break;

         default:
             console.log(`Greška: Nije definisana akcija za nepoznatu stavku: ${item}`);
     }
 };
    
    return(
<ScrollView contentContainerStyle={styles.scrollContent} style={styles.screenContainer}>            
         
            <Text style={styles.sectionTitle}>Profil</Text>
            
            <View style={styles.listContainer}>
                
              
                <MenuItem 
                    leftIconName="User"
                    text="Profil" 
                    onPress={() => handleItemPress("Profil")} 
                />
                
                
                <MenuItem 
                    leftIconName="Bell" 
                    text="Obavještenja" 
                    onPress={() => handleItemPress("Obavještenja")} 
                />
                
                
                <MenuItem 
                    leftIconName="Home"
                    text="Moji stanovi" 
                    onPress={() => handleItemPress("Moji stanovi")} 
                    showDivider={false} 
                />
            </View>

          
            <Text style={[styles.sectionTitle, styles.sectionMargin]}>Knjigovodstvo</Text>
            
            <View style={styles.listContainer}>
                
                <MenuItem 
                    leftIconName="Wallet"
                    text="Troškovi" 
                    onPress={() => handleItemPress("Troškovi")} 
                />
                
              
                <MenuItem 
                    leftIconName="BarChart2"
                    text="Statistika" 
                    onPress={() => handleItemPress("Statistika")} 
                />

              
                <MenuItem 
                    leftIconName="BookOpen" 
                    text="Knjiga prihoda" 
                    onPress={() => handleItemPress("Knjiga prihoda")} 
                />

             
                <MenuItem 
                    leftIconName="BookMarked" 
                    text="Knjiga rashoda" 
                    onPress={() => handleItemPress("Knjiga rashoda")} 
                />

            
                <MenuItem 
                    leftIconName="Users" 
                    text="Knjiga gostiju" 
                    onPress={() => handleItemPress("Knjiga gostiju")} 
                    showDivider={false} 
                />
            </View>


            <Text style={[styles.sectionTitle, styles.sectionMargin]}>Podešavanja</Text>

            <View style={styles.listContainer}>

                <MenuItem 
                    leftIconName="Settings"
                    text="Podešavanja" 
                    onPress={() => handleItemPress("Podešavanja")} 
                />

              
                <MenuItem 
                    leftIconName="Info" 
                    text="O aplikaciji" 
                    onPress={() => handleItemPress("O aplikaciji")} 
                />
                
             
                <MenuItem 
                    leftIconName="LogOut" 
                    text="Odjava" 
                    onPress={() => handleItemPress("Odjava")} 
                    showDivider={false} 
                />
            </View>


            <View style={{ height: 50 }} />

        </ScrollView>
    );
}


const styles = StyleSheet.create({
   screenContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 15, 
    },
    sectionTitle: {
        fontSize: 16,
        color: Colors.primary,
        marginBottom: 15,
        marginLeft: 5,
    },
    listContainer: {
        borderRadius: 10,
        overflow: 'hidden', 
    },

    sectionMargin: {
        marginTop: 20, 
    },
});