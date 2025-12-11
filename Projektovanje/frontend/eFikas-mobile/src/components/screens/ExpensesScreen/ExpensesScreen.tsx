import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import TaskDamageCostTemplate from '@/src/components/templates/TaskDamageCostTemplate/TaskDamageCostTemplate'; 
import { Dropdown } from '@/src/components/atoms/Dropdown/Dropdown';
import FloatButton from '@/src/components/atoms/FloatButton/FloatButton';
import TaskDamageCostCard from "@/src/components/organisms/TaskDamageCostCard/TaskDamageCostCard"; 
import { ExpensesDialog } from '@/src/components/organisms/Dialogs/ExpensesDialog/ExpensesDialog'; 
import { Colors } from "@/src/styles/style"; 


interface Expense {
    id: string;
    apartmant: string;
    costType: string; 
    date?: string; 
    amount?: string; 
    note?: string; 
    isFinished: boolean; 
}

const APARTMENT_OPTIONS = [
   { label: 'Stan Centar', value: 'Stan Centar', id: 1, address: 'ulica 1' },
   { label: 'Stan Ilidža', value: 'Stan Ilidža', id: 2, address: 'ulica 2' },
   { label: 'Kuća Trebević', value: 'Kuća Trebević', id: 3, address: 'ulica 3' },
];

const INITIAL_EXPENSES: Expense[] = [];


const ExpensesScreen = () => { 
    const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
    const [selectedApartment, setSelectedApartment] = useState(APARTMENT_OPTIONS[0]);
    const [isModalVisible, setIsModalVisible] = useState(false); 


   const handleOpenDialog = () => {
       if (!selectedApartment) {
           Alert.alert("Greška", "Morate izabrati stan prije dodavanja troška.");
            return;
        }  
         setIsModalVisible(true);
   };

    const handleConfirmExpense = (data: {
        trosak: string; 
        iznos: string; 
        napomena: string;
     }) => { 
     if (!selectedApartment) return;

       const newExpense: Expense = {
            id: Date.now().toString(),
             apartmant: selectedApartment.label,
            costType: data.trosak,
           amount: data.iznos,
            note: data.napomena,
            isFinished: false,
        };

        setExpenses(prevExpenses => [newExpense, ...prevExpenses]); 
    };
   
    const handleExpenseComplete = (expenseId: string) => {
         setExpenses(prevExpenses => 
             prevExpenses.map(expense => 
                 expense.id === expenseId ? { ...expense, isFinished: true } : expense
             )
        );
      console.log(`Trošak sa ID: ${expenseId} je označen kao PLAĆEN.`); 
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
          {expenses.map(expense => ( 
                <TaskDamageCostCard
                    key={expense.id}
                    id={expense.id} 
                    apartmant={expense.apartmant}
                    description={
                            expense.costType + 
                            (expense.amount ? ` (${expense.amount} KM)` : '')
                        } 
                    isFinished={expense.isFinished} 
                    onFinish={handleExpenseComplete} 
                /> 
               ))}
        </View>
    );

   const floatingButtonComponent = (
        <FloatButton 
            size="lg"
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
  
            <ExpensesDialog 
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleConfirmExpense} 
            /> 
        </>
    );
};

export default ExpensesScreen;

//primjer poziva
/*
 <GestureHandlerRootView style={{ flex: 1 }}> 

  <ExpensesScreen />

  </GestureHandlerRootView>
*/
