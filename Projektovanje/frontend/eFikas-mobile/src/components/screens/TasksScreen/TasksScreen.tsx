import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import TaskDamageCostTemplate from '@/src/components/templates/TaskDamageCostTemplate/TaskDamageCostTemplate'; 
import { Dropdown } from '@/src/components/atoms/Dropdown/Dropdown';
import FloatButton from '@/src/components/atoms/FloatButton/FloatButton';
import TaskDamageCostCard from "@/src/components/organisms/TaskDamageCostCard/TaskDamageCostCard"; 
import { TasksDialog } from '@/src/components/organisms/Dialogs/TasksDialog/TasksDialog'; 
import { Colors } from "@/src/styles/style"; 

interface Task {
    id: string;
    apartmant: string;
    task: string; 
    date?: string;  
    time?: string;
    description?: string;
    isFinished: boolean; 
}

const APARTMENT_OPTIONS = [
   { label: 'Stan Centar', value: 'Stan Centar', id: 1, address: 'ulica 1' },
   { label: 'Stan Ilidža', value: 'Stan Ilidža', id: 2, address: 'ulica 2' },
   { label: 'Kuća Trebević', value: 'Kuća Trebević', id: 3, address: 'ulica 3' },
];

const INITIAL_TASKS: Task[] = [];

const TasksScreen = () => { 
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
     const [selectedApartment, setSelectedApartment] = useState(APARTMENT_OPTIONS[0]);
    const [isModalVisible, setIsModalVisible] = useState(false); 


   const handleOpenDialog = () => {
        if (!selectedApartment) {
            Alert.alert("Greška", "Morate izabrati stan prije dodavanja zadatka.");
             return;
        } 
        setIsModalVisible(true);
    };


    const handleConfirmTask = (data: {
        zadatak: string;
        datum: string;
         vrijeme: string;
         napomena: string;
     }) => {
        if (!selectedApartment) return;

        const newTask: Task = {
             id: Date.now().toString(),
            apartmant: selectedApartment.label,
            task: data.zadatak, 
            date: data.datum,
            time: data.vrijeme,
            description: data.napomena,
            isFinished: false, 
        };

        setTasks(prevTasks => [newTask, ...prevTasks]);
    };
    
  
    const handleTaskFinish = (taskId: string) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId ? { ...task, isFinished: true } : task
            )
        );
       
        console.log(`Zadatak sa ID: ${taskId} je označen kao ZAVRŠEN`);
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
           {tasks.map(task => (
                <TaskDamageCostCard
                    key={task.id}
                    id={task.id} 
                     apartmant={task.apartmant}
                    description={task.task}
                    isFinished={task.isFinished} 
                    onFinish={handleTaskFinish} 
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
             
             <TasksDialog 
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleConfirmTask} 
            /> 
        </>
    );
};

export default TasksScreen;


//primjer poziva
/*
 <GestureHandlerRootView style={{ flex: 1 }}> 

  <TasksScreen />

  </GestureHandlerRootView>
*/