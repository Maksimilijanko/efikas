import { useState } from 'react';
import { View } from 'react-native';
import AddApartmentTemplate from '../../templates/AddApartmentTemplate/AddApartmentTemplate';
import LabeledTextField from '../../molecules/LabeledTextField/LabeledTextField';
import ImagePicker from '../../organisms/ImagePicker/ImagePicker';
import { SectionHeader } from '../../molecules/SectionHeader/SectionHeader';
import { PriceInputRow } from '../../organisms/ApartmentPriceInput/ApartmentPriceInput';
import { Label } from '../../atoms/Label/Label';
import { BasicButton } from '../../atoms/BasicButton/BasicButton';
import InventoryDialog from '../../organisms/Dialogs/InventoryDialog/InventoryDialog';
import { ApartmentInventory, CreateApartmentPayload } from '@/src/types/types';
import { useAddApartment } from '@/src/hooks/useAddApartment';
import { toastService } from '@/src/services/toastService';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

interface FormState {
  apartmentName: string;
  address: string;
  noBeds: string;
  noBedrooms: string;
  capacity: string;
  overnightPrice: string;
  dayPrice: string;
}

interface Validator {
  field: keyof FormState;
  messageKey: string;
  isNumber?: boolean;
}

const VALIDATORS: Validator[] = [
  { field: "apartmentName", messageKey: "addApartment.validation.nameError" },
  { field: "address", messageKey: "addApartment.validation.addressError" },
  { field: "noBeds", messageKey: "addApartment.validation.bedsError", isNumber: true },
  { field: "noBedrooms", messageKey: "addApartment.validation.bedroomsError", isNumber: true },
  { field: "capacity", messageKey: "addApartment.validation.capacityError", isNumber: true },
  { field: "overnightPrice", messageKey: "addApartment.validation.overnightPriceError", isNumber: true },
  { field: "dayPrice", messageKey: "addApartment.validation.dayPriceError", isNumber: true },
];

const INITIAL_FORM_STATE: FormState = {
  apartmentName: "",
  address: "",
  noBeds: "",
  noBedrooms: "",
  capacity: "",
  overnightPrice: "",
  dayPrice: "",
};

export default function AddApartmentScreen() {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);

  const [inventoryData, setInventoryData] = useState<ApartmentInventory>({
    parking: false,
    tv: false,
    wifi: false,
    fen: false,
    klima: false,
    vesMasina: false,
    kafa: false,
    balkon: false,
  });

  const mutation = useAddApartment();

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    for (const v of VALIDATORS) {
      const value = form[v.field];

      if (!String(value).trim()) {
        toastService.error(t('addApartment.validation.errorTitle'), t(v.messageKey));
        return false;
      }

      if (v.isNumber && isNaN(Number(value))) {
        toastService.error(t('addApartment.validation.errorTitle'), t(v.messageKey));
        return false;
      }
    }

    return true;
  };

  const handleSaveApartment = () => {
    if (!validateForm()) return;

    if (!selectedImages.length) {
      toastService.error(t('addApartment.validation.errorTitle'), "Dodaj bar jednu sliku.");
      return;
    }

    const payload: CreateApartmentPayload = {
      apartment: {
        name: form.apartmentName.trim(),
        address: form.address.trim(),
        numberOfBeds: Number(form.noBeds),
        numberOfRooms: Number(form.noBedrooms),
        capacity: Number(form.capacity),
        pricePerNight: Number(form.overnightPrice),
        pricePerDay: Number(form.dayPrice),
        traits: inventoryData,
      },
      pictures: selectedImages.map((uri, index) => ({
        uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      })),
    };

    //console.log("Submitting apartment...");

    mutation.mutate(payload, {
      onSuccess: (response) => {
        toastService.success(
          t('addApartment.messages.successTitle'),
          response.message || t('addApartment.messages.successMessage')
        );
        router.back();
      },
      onError: () => {
        toastService.error(t('addApartment.messages.errorTitle'), t('addApartment.messages.errorMessage'));
      }
    });
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setSelectedImages([]);
    setInventoryData({
      parking: false,
      tv: false,
      wifi: false,
      fen: false,
      klima: false,
      vesMasina: false,
      kafa: false,
      balkon: false,
    });
  };

  return (
    <AddApartmentTemplate
      nameEdit={
        <LabeledTextField
          label={t('addApartment.fields.name')}
          value={form.apartmentName}
          onChangeText={(value) => updateField("apartmentName", value)}
        />
      }
      addressEdit={
        <LabeledTextField
          label={t('addApartment.fields.address')}
          value={form.address}
          onChangeText={(value) => updateField("address", value)}
        />
      }
      imagePicker={
        <ImagePicker
          selectedImages={selectedImages}
          onImagesSelected={setSelectedImages}
        />
      }
      noBedsEdit={
        <LabeledTextField
          label={t('addApartment.fields.noBeds')}
          value={form.noBeds}
          onChangeText={(value) => updateField("noBeds", value)}
          inputProps={{ keyboardType: "numeric" }}
        />
      }
      noBedroomsEdit={
        <LabeledTextField
          label={t('addApartment.fields.noBedrooms')}
          value={form.noBedrooms}
          onChangeText={(value) => updateField("noBedrooms", value)}
          inputProps={{ keyboardType: "numeric" }}
        />
      }
      apartmentCapacityEdit={
        <LabeledTextField
          label={t('addApartment.fields.capacity')}
          value={form.capacity}
          onChangeText={(value) => updateField("capacity", value)}
          inputProps={{ keyboardType: "numeric" }}
        />
      }
      priceSection={
        <View style={{ marginTop: 20 }}>
          <Label text={t('addApartment.fields.price')} />
          <View style={{ padding: 16 }}>
            <PriceInputRow
              label={t('addApartment.fields.overnightPrice')}
              value={form.overnightPrice}
              onChangeText={(value) => updateField("overnightPrice", value)}
            />
            <PriceInputRow
              label={t('addApartment.fields.dayPrice')}
              value={form.dayPrice}
              onChangeText={(value) => updateField("dayPrice", value)}
            />
          </View>
        </View>
      }
      inventoryLink={
        <SectionHeader
          title={t('addApartment.fields.inventory')}
          onPress={() => setInventoryModalVisible(true)}
        />
      }
      inventoryModal={
        <InventoryDialog
          visible={inventoryModalVisible}
          onClose={() => setInventoryModalVisible(false)}
          onSave={(data) => setInventoryData(data)}
        />
      }
      saveButton={
        <BasicButton
          title={mutation.isPending ? t('addApartment.buttons.saving') : t('addApartment.buttons.save')}
          onPress={handleSaveApartment}
        />
      }
    />
  );
}