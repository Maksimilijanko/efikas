import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useQueryClient } from "@tanstack/react-query"; 
import { useTranslation } from 'react-i18next';
import TaskDamageCostTemplate from '@/src/components/templates/TaskDamageCostTemplate/TaskDamageCostTemplate'; 
import { Dropdown } from '@/src/components/atoms/Dropdown/Dropdown';
import FloatButton from '@/src/components/atoms/FloatButton/FloatButton';
import TaskDamageCostCard from "@/src/components/organisms/TaskDamageCostCard/TaskDamageCostCard"; 
import { ExpensesDialog } from '@/src/components/organisms/Dialogs/ExpensesDialog/ExpensesDialog'; 
import { useApartmentsList } from "@/src/hooks/useApartmentsList";
import { useExpenses } from "@/src/hooks/useExpenses"; 
import { expenseService } from "@/src/api/services/expenseService"; 
import { ApartmentExpenseDTO } from '@/src/types/types'; 
import { toastService } from '@/src/services/toastService';

const ExpensesScreen = () => { 
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [selectedApartment, setSelectedApartment] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false); 

    const { data: apartmentsData, isLoading: loadingApartments } = useApartmentsList();

    const { 
        data: expenses = [], 
        isLoading: loadingExpenses 
    } = useExpenses(selectedApartment?.id);

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

    const handleConfirmExpense = async (formData: any) => {
        const payload: ApartmentExpenseDTO = {
            name: formData.trosak,
            amount: parseFloat(formData.iznos) || 0,
            expenseType: formData.kategorija, 
            status: false,
            note: formData.napomena || "" 
        };

        try {
            const apartmentId = selectedApartment?.apartmentId || selectedApartment?.id;
            await expenseService.create(Number(apartmentId), payload);
            
            toastService.success(
                t('expenses.messages.successTitle'), 
                t('expenses.messages.successMessage')
            );

            await queryClient.invalidateQueries({ queryKey: ['expenses', Number(apartmentId)] });
            setIsModalVisible(false);
        } catch (error: any) {
            console.error("GREŠKA:", error.response?.data);
            toastService.error(
                t('expenses.messages.errorTitle'), 
                t('expenses.messages.errorMessage')
            );
        }
    };

    const handleExpenseComplete = async (item: ApartmentExpenseDTO) => {
        try {
            const apartmentId = selectedApartment?.id || selectedApartment?.value;
            await expenseService.updateStatus(Number(apartmentId), item.name, item);
            
            toastService.success(
                t('expenses.messages.statusSuccessTitle'), 
                t('expenses.messages.statusSuccessMessage')
            );
            
            await queryClient.invalidateQueries({ queryKey: ['expenses', Number(apartmentId)] });
        } catch (error) {
            toastService.error(
                t('expenses.messages.errorTitle'), 
                "Nije moguće promijeniti status troška."
            );
        }
    };

    if (loadingApartments) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <>
            <TaskDamageCostTemplate 
                dropdown={
                    <Dropdown 
                        placeholder={t('expenses.selectApartment')} 
                        options={apartments} 
                        optionLabel="label" 
                        optionValue="value" 
                        selectedValue={selectedApartment} 
                        setSelectedValue={setSelectedApartment} 
                    />
                }
                list={
                    <View>
                        {loadingExpenses ? (
                            <ActivityIndicator color="#0000ff" style={{ marginTop: 20 }} />
                        ) : (
                            expenses.map((item, index) => {
                                // Dinamički prevod kategorije iz tvog JSON-a
                                // Ako je item.expenseType "Režije", traži ključ "expenses.categories.Režije"
                                const translatedCategory = t(`expenses.categories.${item.expenseType}`);
                                
                                return (
                                    <TaskDamageCostCard 
                                        key={`expense-${item.name}-${index}`}
                                        id={item.name} 
                                        apartmant={selectedApartment?.label || ""} 
                                        description={`${translatedCategory}: ${item.name}`} 
                                        isFinished={item.status} 
                                        onFinish={() => handleExpenseComplete(item)} 
                                    />
                                );
                            })
                        )}
                    </View>
                }
                floatingButton={
                    <FloatButton size="lg" onClick={() => setIsModalVisible(true)} />
                }
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
