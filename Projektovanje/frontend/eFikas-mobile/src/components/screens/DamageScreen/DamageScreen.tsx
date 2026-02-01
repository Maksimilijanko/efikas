import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import TaskDamageCostTemplate from '@/src/components/templates/TaskDamageCostTemplate/TaskDamageCostTemplate';
import { Dropdown } from '@/src/components/atoms/Dropdown/Dropdown';
import FloatButton from '@/src/components/atoms/FloatButton/FloatButton';
import TaskDamageCostCard from "@/src/components/organisms/TaskDamageCostCard/TaskDamageCostCard";
import { DamageDialog } from '@/src/components/organisms/Dialogs/DamageDialog/DamageDialog';
import { useApartmentsList } from "@/src/hooks/useApartmentsList";
import { damageService } from "@/src/api/services/damageService";
import { ApartmentDamageDTO } from '@/src/types/types';
import { toastService } from '@/src/services/toastService';
import { useDamages } from '@/src/hooks/useDamages';

const DamageScreen = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [selectedApartment, setSelectedApartment] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { data: apartmentsData, isLoading: loadingApartments } = useApartmentsList();

    const {
        data: damages = [],
        isLoading: loadingDamages,
    } = useDamages(selectedApartment?.id);


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

    const handleConfirmDamage = async (formData: any) => {
        const payload: ApartmentDamageDTO = {
            name: formData.steta,
            damagePrice: parseFloat(formData.trosak) || 0,
            note: formData.napomena || "",
            status: false
        };

        try {
            const apartmentId = selectedApartment?.id || selectedApartment?.value;
            if (!apartmentId) return;

            await damageService.create(Number(apartmentId), payload);

            toastService.success(
                t('damages.messages.successTitle'),
                t('damages.messages.successMessage')
            );

            await queryClient.invalidateQueries({ queryKey: ['damages', Number(apartmentId)] });
            await queryClient.invalidateQueries({ queryKey: ["analytics", String(apartmentId)] });
            setIsModalVisible(false);
        } catch (error: any) {
            toastService.error(
                t('damages.messages.errorTitle'),
                t('damages.messages.errorMessage')
            );
        }
    };

    const handleFinishDamage = async (item: ApartmentDamageDTO) => {
        try {
            const apartmentId = selectedApartment?.id || selectedApartment?.value;
            await damageService.updateStatus(Number(apartmentId), item.name, item);

            toastService.success(
                t('damages.messages.statusSuccessTitle'),
                t('damages.messages.statusSuccessMessage')
            );

            await queryClient.invalidateQueries({ queryKey: ['damages', Number(apartmentId)] });
        } catch (error) {
            toastService.error(
                t('damages.messages.errorTitle'),
                t('damages.messages.errorMessage')
            );
        }
    };

    if (loadingApartments) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <>
            <TaskDamageCostTemplate
                dropdown={
                    <Dropdown
                        placeholder="Izaberite stan"
                        options={apartments}
                        optionLabel="label"
                        optionValue="value"
                        selectedValue={selectedApartment}
                        setSelectedValue={setSelectedApartment}
                    />
                }
                list={
                    <View>
                        {loadingDamages ? (
                            <ActivityIndicator color="#0000ff" style={{ marginTop: 20 }} />
                        ) : (
                            damages.map((item, index) => (
                                <TaskDamageCostCard
                                    key={`damage-${item.name}-${index}`}
                                    id={item.name}
                                    apartmant={selectedApartment?.label || ""}
                                    description={item.name}
                                    isFinished={item.status}
                                    onFinish={() => handleFinishDamage(item)}
                                />
                            ))
                        )}
                    </View>
                }
                floatingButton={
                    <FloatButton
                        size="lg"
                        onClick={() => setIsModalVisible(true)}
                    />
                }
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