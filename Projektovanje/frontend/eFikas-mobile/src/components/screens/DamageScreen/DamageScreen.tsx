import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import TaskDamageCostTemplate from '@/src/components/templates/TaskDamageCostTemplate/TaskDamageCostTemplate'; 
import { Dropdown } from '@/src/components/atoms/Dropdown/Dropdown';
import FloatButton from '@/src/components/atoms/FloatButton/FloatButton';
import TaskDamageCostCard from "@/src/components/organisms/TaskDamageCostCard/TaskDamageCostCard"; 
import { DamageDialog } from '@/src/components/organisms/Dialogs/DamageDialog/DamageDialog'; 
import { Colors } from "@/src/styles/style"; 


interface Damage {
    id: string;
    apartmant: string;
    damage: string; 
    date?: string; 
    cost?: string; 
    note?: string; 
    isFinished: boolean; 
}

const APARTMENT_OPTIONS = [
   { label: 'Stan Centar', value: 'Stan Centar', id: 1, address: 'ulica 1' },
   { label: 'Stan Ilidža', value: 'Stan Ilidža', id: 2, address: 'ulica 2' },
   { label: 'Kuća Trebević', value: 'Kuća Trebević', id: 3, address: 'ulica 3' },
];

const INITIAL_DAMAGES: Damage[] = [];

const DamageScreen = () => { 
    const [damages, setDamages] = useState<Damage[]>(INITIAL_DAMAGES); 
    const [selectedApartment, setSelectedApartment] = useState(APARTMENT_OPTIONS[0]);
    const [isModalVisible, setIsModalVisible] = useState(false); 


   const handleOpenDialog = () => {
        if (!selectedApartment) {
            Alert.alert("Greška", "Morate izabrati stan prije dodavanja štete."); 
            return;
        }  
     setIsModalVisible(true);
    };



    const handleConfirmDamage = (data: {
         steta: string; 
         datum: string;
          trosak: string; 
          napomena: string;
     }) => {
         if (!selectedApartment) return;

       const newDamage: Damage = {
            id: Date.now().toString(),
            apartmant: selectedApartment.label,
            damage: data.steta, 
            date: data.datum,
            cost: data.trosak, 
            note: data.napomena, 
            isFinished: false,
        };

        setDamages(prevDamages => [newDamage, ...prevDamages]);
    }; 

   const handleDamageComplete = (damageId: string) => {
         setDamages(prevDamages => 
            prevDamages.map(damage => 
               damage.id === damageId ? { ...damage, isFinished: true } : damage
            )
         );
       console.log(`Šteta sa ID: ${damageId} je riješena`); 
 };


    const dropdownComponent = (
        <Dropdown
            placeholder="Izaberite stan" 
            options={APARTMENT_OPTIONS}
            optionLabel="label"
            optionValue="value"
            selectedValue={selectedApartment}
            setSelectedValue={setSelectedApartment}
        />
    );

   const listComponent = (
      <View>
           {damages.map(damage => ( 
               <TaskDamageCostCard
                    key={damage.id}
                    id={damage.id} 
                    apartmant={damage.apartmant}
                    description={damage.damage} 
                    isFinished={damage.isFinished} 
                    onFinish={handleDamageComplete} 
                 /> 
               ))}
      </View>
    );

   const floatingButtonComponent = (
       <FloatButton 
           onClick={handleOpenDialog} 
        />
    );


    return (
        <>
           <TaskDamageCostTemplate 
                dropdown={dropdownComponent}
                list={listComponent}
                floatingButton={floatingButtonComponent}
            />

            <DamageDialog 
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleConfirmDamage} 
             />  
        </>
    );
};

export default DamageScreen;

//primjer poziva
/*
 <GestureHandlerRootView style={{ flex: 1 }}> 

  <DamageScreen />

  </GestureHandlerRootView>
*/