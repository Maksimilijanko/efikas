import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next'; 

import TaskDamageCostTemplate from '@/src/components/templates/TaskDamageCostTemplate/TaskDamageCostTemplate'; 
import { Dropdown } from '@/src/components/atoms/Dropdown/Dropdown';
import FloatButton from '@/src/components/atoms/FloatButton/FloatButton';
import TaskDamageCostCard from "@/src/components/organisms/TaskDamageCostCard/TaskDamageCostCard"; 
import { TasksDialog } from '@/src/components/organisms/Dialogs/TasksDialog/TasksDialog'; 

import { useApartmentsList } from "@/src/hooks/useApartmentsList";
import { useTasks } from "@/src/hooks/useTasks";
import { taskService } from "@/src/api/services/taskService";
import { toastService } from '@/src/services/toastService'; 

import { ApartmentTaskDTO } from '@/src/types/types';

const TasksScreen = () => { 
    const queryClient = useQueryClient();
    const { t } = useTranslation(); 
    const [selectedApartment, setSelectedApartment] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false); 

    const { data: apartmentsData, isLoading: loadingApartments } = useApartmentsList();

    const { 
        data: tasks = [], 
        isLoading: loadingTasks 
    } = useTasks(selectedApartment?.id);

    const apartments = apartmentsData?.map((apt: any) => ({
        label: apt.name || "Bez imena", 
        value: (apt.apartmentId || apt.id)?.toString() || "", 
        id: apt.apartmentId || apt.id
    })) ?? [];

    useEffect(() => {
        if (apartments.length > 0 && !selectedApartment) {
            setSelectedApartment(apartments[0]);
        }
    }, [apartmentsData]);

    const handleConfirmTask = async (formData: ApartmentTaskDTO) => {
        const apartmentId = selectedApartment?.id || selectedApartment?.value;
        if (!apartmentId) return;

        const payload: ApartmentTaskDTO = formData;

        try {
            await taskService.create(Number(apartmentId), payload);
            
            toastService.success(
                t('tasks.messages.successTitle'), 
                t('tasks.messages.successMessage')
            );

            await queryClient.invalidateQueries({ queryKey: ['tasks', Number(apartmentId)] });
            setIsModalVisible(false);
        } catch (error) {
            toastService.error(
                t('tasks.messages.errorTitle'), 
                t('tasks.messages.errorMessage')
            );
        }
    };

    const handleTaskFinish = async (task: ApartmentTaskDTO) => {
        try {
            const apartmentId = selectedApartment?.id || selectedApartment?.value;
            if (!apartmentId) return;
            
            await taskService.updateStatus(Number(apartmentId), task.name, task);
            
            toastService.success(
                t('tasks.messages.statusSuccessTitle'), 
                t('tasks.messages.statusSuccessMessage')
            );

            await queryClient.invalidateQueries({ queryKey: ['tasks', Number(apartmentId)] });
        } catch (error) {
            toastService.error(
                t('tasks.messages.errorTitle'), 
                t('tasks.messages.errorMessage')
            );
        }
    };

    if (loadingApartments) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <>
            <TaskDamageCostTemplate 
                dropdown={
                    <Dropdown 
                        placeholder={t('common.selectApartment')} 
                        options={apartments} 
                        optionLabel="label" 
                        optionValue="value" 
                        selectedValue={selectedApartment} 
                        setSelectedValue={setSelectedApartment} 
                    />
                }
                list={
                    <View>
                        {loadingTasks ? (
                            <ActivityIndicator color="#0000ff" style={{ marginTop: 20 }} />
                        ) : (
                            tasks.map((task, index) => (
                                <TaskDamageCostCard 
                                    key={`task-${task.name}-${index}`}
                                    id={task.name} 
                                    apartmant={selectedApartment?.label || ""} 
                                    description={task.name} 
                                    isFinished={task.status} 
                                    onFinish={() => handleTaskFinish(task)} 
                                />
                            ))
                        )}
                    </View>
                }
                floatingButton={
                    <FloatButton size="lg" onClick={() => setIsModalVisible(true)} />
                }
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