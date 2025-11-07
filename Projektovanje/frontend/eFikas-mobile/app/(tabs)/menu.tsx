import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native"; 

import { Divider } from '../../components/ui/divider';

import { ChevronRight } from 'lucide-react-native'; 

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 


interface ListItemProps {
    iconType: 'Feather' | 'MaterialCommunityIcons'; 
    iconName: string; 
    label: string;
    onPress: () => void;
    isLast?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ iconType, iconName, label, onPress, isLast }) => {
    
    const renderIcon = () => {
        const iconColor = '#000'; 
        const iconSize = 24;

        if (iconType === 'Feather') {
           
            return <Feather name={iconName} size={iconSize} color={iconColor} style={styles.iconStyle} />;
        }
        if (iconType === 'MaterialCommunityIcons') {
           
            return <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} style={styles.iconStyle} />;
        }
        return null;
    };


    return (
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
                styles.listItem,
                { opacity: pressed ? 0.7 : 1 } 
            ]}
        >
            <View style={styles.listItemContent}>
                
                {renderIcon()}
                
                <Text style={styles.labelStyle}>{label}</Text>
                
                <ChevronRight 
                    size={22} 
                    color="#ccc" 
                    style={styles.arrowStyle}
                />
            </View>
            
            {!isLast && (
                <View style={styles.dividerContainer}> 
                    <Divider />
                </View>
            )}
            
        </Pressable>
    );
};



export default function Menu() {
    
   const handleItemPress = (item: string) => {

    console.log(`Pritisnuta stavka menija: ${item}`); 
    
   
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
        <View style={styles.screenContainer}>
            
          
            <Text style={styles.sectionTitle}>Profil</Text>
            
            <View style={styles.listContainer}>
                
                <ListItem 
                    iconType="Feather"
                    iconName="user" 
                    label="Profil" 
                    onPress={() => handleItemPress("Profil")} 
                />
                
                <ListItem 
                    iconType="MaterialCommunityIcons"
                    iconName="bell-outline" 
                    label="Obavještenja" 
                    onPress={() => handleItemPress("Obavještenja")} 
                />
                
                <ListItem 
                    iconType="Feather"
                    iconName="home" 
                    label="Moji stanovi" 
                    onPress={() => handleItemPress("Moji stanovi")} 
                    isLast={true} 
                />
            </View>

           
            <Text style={[styles.sectionTitle, styles.sectionMargin]}>Knjigovodstvo</Text>
            
            <View style={styles.listContainer}>
                
                <ListItem 
                    iconType="MaterialCommunityIcons"
                    iconName="wallet-outline" 
                    label="Troškovi" 
                    onPress={() => handleItemPress("Troškovi")} 
                />
                
                <ListItem 
                    iconType="Feather"
                    iconName="bar-chart-2" 
                    label="Statistika" 
                    onPress={() => handleItemPress("Statistika")} 
                />

                 <ListItem 
                    iconType="MaterialCommunityIcons"
                    iconName="book-open-outline" 
                    label="Knjiga prihoda" 
                    onPress={() => handleItemPress("Knjiga prihoda")} 
                />

                 <ListItem 
                    iconType="MaterialCommunityIcons"
                    iconName="book-edit-outline" 
                    label="Knjiga rashoda" 
                    onPress={() => handleItemPress("Knjiga rashoda")} 
                />

                 <ListItem 
                    iconType="MaterialCommunityIcons"
                    iconName="account-multiple-outline" 
                    label="Knjiga gostiju" 
                    onPress={() => handleItemPress("Knjiga gostiju")} 
                    isLast={true} 
                />
            </View>

          
            <Text style={[styles.sectionTitle, styles.sectionMargin]}>Podešavanja</Text>

            <View style={styles.listContainer}>

                <ListItem 
                    iconType="Feather"
                    iconName="settings" 
                    label="Podešavanja" 
                    onPress={() => handleItemPress("Podešavanja")} 
                />

                <ListItem 
                    iconType="Feather"
                    iconName="info" 
                    label="O aplikaciji" 
                    onPress={() => handleItemPress("O aplikaciji")} 
                />
                
                <ListItem 
                    iconType="MaterialCommunityIcons"
                    iconName="logout" 
                    label="Odjava" 
                    onPress={() => handleItemPress("Odjava")} 
                    isLast={true} 
                />
            </View>

        
            <View style={{ height: 50 }} />

        </View>
    );
}


const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 15,
        backgroundColor: 'default', 
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600', 
        color: '#3176BF', 
        marginBottom: 15,
        marginLeft: 5,
    },
    listContainer: {
        backgroundColor: 'default', 
        borderRadius: 10,
        overflow: 'hidden', 
    },
  
    sectionMargin: {
        marginTop: 20, 
    },
    listItem: {
        paddingHorizontal: 15,
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8, 
    },
    iconStyle: {
        marginRight: 15,
        flexGrow: 0, 
    },
    labelStyle: {
        flex: 1, 
        fontSize: 16,
        color: '#000',
    },
    arrowStyle: {
        marginLeft: 15,
    },
    
    dividerContainer: {
        marginLeft: 35, 
    }
});