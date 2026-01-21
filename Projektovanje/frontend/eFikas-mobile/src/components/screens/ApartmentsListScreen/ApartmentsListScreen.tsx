import React, { useState } from "react";
import { View } from "react-native";
import ApartmentsListTemplate from "../../templates/ApartmentsListTemplate/ApartmentsListTemplate";
import ApartmentCard from "../../organisms/ApartmentCard/ApartmentCard";
import FloatButton from "../../atoms/FloatButton/FloatButton";
import { Icon } from "../../atoms/Icon/Icon";
import { EditDeleteDialog } from "../../organisms/Dialogs/EditDeleteDialog/EditDeleteDialog";
import { useApartmentsList } from "@/src/hooks/useApartmentsList";
import { useDeleteApartment } from "@/src/hooks/useDeleteApartment";
import { toastService } from "@/src/services/toastService";
import { router } from "expo-router";
import { MessageDialog } from "@/src/components/organisms/Dialogs/MessageDialog/MessageDialog";
import { t } from "i18next";

interface DialogState {
  visible: boolean;
  apartmentId: number | null;
  position: { top: number; right: number } | null;
}

const ApartmentsListScreen: React.FC = () => {
  const { data, isLoading, error } = useApartmentsList();
  const deleteMutation = useDeleteApartment();

  const [dialogState, setDialogState] = useState<DialogState>({
    visible: false,
    apartmentId: null,
    position: null,
  });

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [apartmentIdPendingDelete, setApartmentIdPendingDelete] = useState<number | null>(null);

  const handleLongPress = (apartmentId: number, event: any) => {
    const { pageY } = event.nativeEvent;

    setDialogState({
      visible: true,
      apartmentId,
      position: { top: pageY - 20, right: 16 },
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ visible: false, apartmentId: null, position: null });
  };

  const handleEdit = () => {
    if (dialogState.apartmentId !== null) {
      router.push({
        pathname: "/editApartment",
        params: { apartmentId: String(dialogState.apartmentId) },
      });
      handleCloseDialog();
    }
  };

  const handleDelete = () => {
    const id = dialogState.apartmentId;
    if (id === null) return;

    handleCloseDialog();
    setApartmentIdPendingDelete(id);
    setConfirmDeleteVisible(true);
  };

  const closeConfirmDelete = () => {
    setConfirmDeleteVisible(false);
    setApartmentIdPendingDelete(null);
  };

  const confirmDelete = () => {
    const id = apartmentIdPendingDelete;
    if (id === null) return;

    closeConfirmDelete();

    deleteMutation.mutate(id, {
      onSuccess: (response) => {
        toastService.success(
          t("apartment.toast.deleteSuccessTitle") || "Uspešno obrisano",
          (response as any)?.message ||
          t("apartment.toast.deleteSuccessMessage") ||
          "Apartman je uspešno obrisan."
        );
      },
      onError: (err: any) => {
        toastService.error(
          t("common.error"),
          t("apartment.toast.deleteErrorMessage")
        );
      },
    });
  };

  if (isLoading) return <ApartmentsListTemplate apartments={[]} />;
  if (error) return <ApartmentsListTemplate apartments={[]} />;

  const apartments =
    data?.map((item) => (
      <View key={item.apartmentId}>
        <ApartmentCard
          name={item.name}
          address={item.address}
          imageUrl={item.imageUrl || ""}
          status={item.status}
          statusUntil={item.statusUntil}
          nextGuestsDate={item.nextGuestsDate}
          onPress={() =>
            router.push({
              pathname: "/chosenApartment",
              params: { apartmentId: String(item.apartmentId) },
            })
          }

          onLongPress={(event) => handleLongPress(item.apartmentId, event)}
          style={{}}
        />
      </View>
    )) ?? [];

  return (
    <>
      <ApartmentsListTemplate
        apartments={apartments}
        floatingActionButton={
          <FloatButton
            size="lg"
            icon={() => <Icon name="HousePlus" size={22} color="white" />}
            onClick={() => router.push("/addApartment")}
          />
        }
      />

      <EditDeleteDialog
        visible={dialogState.visible}
        onClose={handleCloseDialog}
        onEdit={handleEdit}
        onDelete={handleDelete}
        position={dialogState.position || undefined}
      />

      <MessageDialog
        visible={confirmDeleteVisible}
        title={t("apartment.dialogs.deleteConfirm.title")}
        description={t("apartment.dialogs.deleteConfirm.description")}
        primaryText={t("apartment.dialogs.deleteConfirm.cancel")}
        onPrimary={closeConfirmDelete}
        secondaryText={t("apartment.dialogs.deleteConfirm.confirm")}
        onSecondary={confirmDelete}
        onRequestClose={closeConfirmDelete}
      />
    </>
  );
};

export default ApartmentsListScreen;
