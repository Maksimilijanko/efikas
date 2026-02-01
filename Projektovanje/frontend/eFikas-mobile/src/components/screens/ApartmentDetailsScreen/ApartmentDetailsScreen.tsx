import React, { useState } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, Pressable } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Stack, useLocalSearchParams, router } from "expo-router";

import LandingApartmentInfo from "@/src/components/organisms/LandingApartmentInfo/LandingApartmentInfo";
import ApartmentDetailsTemplate from "../../templates/ApartmentDetailsTemplate/ApartmentDetailsTemplate";
import { apartmentDetailsService } from "@/src/api/services/apartmentDetailsService";
import { Gallery } from "../../organisms/Gallery/Gallery";
import { ReservationsCalendar } from "../../atoms/ReservationsCalendar/ReservationsCalendar";
import { Label } from "../../atoms/Label/Label";
import { useTheme } from "@/src/providers/ThemeProvider";
import { EditDeleteDialog } from "../../organisms/Dialogs/EditDeleteDialog/EditDeleteDialog";
import { MessageDialog } from "@/src/components/organisms/Dialogs/MessageDialog/MessageDialog";
import { useDeleteApartment } from "@/src/hooks/useDeleteApartment";
import { toastService } from "@/src/services/toastService";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Icon } from "../../atoms/Icon/Icon";

interface DialogState {
  visible: boolean;
  apartmentId: number | null;
  position: { top: number; right: number } | null;
}

export default function ApartmentDetailsScreen() {
  const { Colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteApartment();

  const params = useLocalSearchParams<{ apartmentId?: string }>();
  const apartmentId = params.apartmentId ? Number(params.apartmentId) : NaN;

  const [dialogState, setDialogState] = useState<DialogState>({
    visible: false,
    apartmentId: null,
    position: null,
  });

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [apartmentIdPendingDelete, setApartmentIdPendingDelete] = useState<number | null>(null);

  const openOptionsMenu = (event?: any) => {
    const pageY = event?.nativeEvent?.pageY ?? 80;

    setDialogState({
      visible: true,
      apartmentId: Number.isFinite(apartmentId) ? apartmentId : null,
      position: { top: pageY - 20, right: 16 },
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ visible: false, apartmentId: null, position: null });
  };

  const handleEdit = () => {
    const id = dialogState.apartmentId;
    if (id == null) return;

    router.push({
      pathname: "/editApartment",
      params: { apartmentId: String(id) },
    });

    handleCloseDialog();
  };

  const handleDelete = () => {
    const id = dialogState.apartmentId;
    if (id == null) return;

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
    if (id == null) return;

    closeConfirmDelete();

    deleteMutation.mutate(id, {
      onSuccess: (response) => {
        toastService.success(
          t("apartment.toast.deleteSuccessTitle") || "Uspešno obrisano",
          (response as any)?.message ||
          t("apartment.toast.deleteSuccessMessage") ||
          "Apartman je uspešno obrisan."
        );

        router.back();
      },
      onError: () => {
        toastService.error(
          t("common.error"),
          t("apartment.toast.deleteErrorMessage")
        );
      },
    });
  };

  const { data: apartment, isLoading, isError, refetch } = useQuery({
    queryKey: ["apartment-details", apartmentId],
    enabled: Number.isFinite(apartmentId),
    queryFn: () =>
      apartmentDetailsService.getApartmentDetailsFromCacheAndReservations(
        queryClient,
        apartmentId
      ),
    staleTime: 1000 * 60 * 10,
  });

  if (!Number.isFinite(apartmentId)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Label text="Invalid apartmentId" color={Colors.textPrimary} />
      </View>
    );
  }

  if (isLoading && !apartment) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <Label text={t("apartmentDetails.loading.error")} color={Colors.textPrimary} />
        <TouchableOpacity
          onPress={() => refetch()}
          style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: Colors.textSecondary, fontWeight: "600" }}>
            {t("apartmentDetails.loading.retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!apartment) return null;

  const servicesProps = {
    wifi: apartment.services.some((s) => s.name === "WiFi"),
    parking: apartment.services.some((s) => s.name === "Parking"),
    klima: apartment.services.some((s) => s.name === "AC"),
    tv: apartment.services.some((s) => s.name === "TV"),
    kafa: apartment.services.some((s) => s.name === "Kitchen"),
    vesmasina: apartment.services.some((s) => s.name === "Washing Machine"),
    fen: apartment.services.some((s) => s.name === "Hair Dryer"),
    balkon: apartment.services.some((s) => s.name === "Balcony"),
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: apartment.title,
          headerRight: () => (
            <Pressable
              onPress={(e) => openOptionsMenu(e)}
              onLongPress={(e) => openOptionsMenu(e)}
              hitSlop={12}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Icon name={"EllipsisVertical"} color={Colors.iconMenu} />
            </Pressable>
          ),
        }}
      />

      <ApartmentDetailsTemplate
        basicInfo={
          <LandingApartmentInfo
            imageUrl={{ uri: apartment.heroImageUrl }}
            bedrooms={apartment.bedrooms}
            beds={apartment.beds}
            maxGuests={apartment.maxGuests}
            {...servicesProps}
          />
        }
        gallery={<Gallery style={[{ width: "100%" }]} images={apartment.galleryImages} />}
        calendar={
          <View>
            <Label
              text={t("apartmentDetails.calendar.availability")}
              color={Colors.textPrimary}
              size="xl"
              className="font-bold mb-4"
            />
            <ReservationsCalendar reservations={apartment.availability} />
          </View>
        }
      />

      {/* same dialogs as in apartments list screen */}
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
}
