import React, { useState } from 'react';
import { View, Alert } from 'react-native';
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

export default function AddApartmentScreen() {
    
    const [apartmentName, setApartmentName] = useState("");
    const [address, setAddress] = useState("");
    const [noBeds, setNoBeds] = useState("");
    const [noBedrooms, setNoBedrooms] = useState("");
    const [capacity, setCapacity] = useState("");
    const [overnightPrice, setOvernightPrice] = useState("");
    const [dayPrice, setDayPrice] = useState("");
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

    
    const validateForm = (): boolean => {
        if (!apartmentName.trim()) return Alert.alert("Greška", "Unesite naziv apartmana"), false;
        if (!address.trim()) return Alert.alert("Greška", "Unesite adresu"), false;
        if (!noBeds.trim() || isNaN(Number(noBeds))) return Alert.alert("Greška", "Broj kreveta nije ispravan"), false;
        if (!noBedrooms.trim() || isNaN(Number(noBedrooms))) return Alert.alert("Greška", "Broj soba nije ispravan"), false;
        if (!capacity.trim() || isNaN(Number(capacity))) return Alert.alert("Greška", "Kapacitet nije ispravan"), false;
        if (!overnightPrice.trim() || isNaN(Number(overnightPrice))) return Alert.alert("Greška", "Cijena noćenja nije ispravna"), false;
        if (!dayPrice.trim() || isNaN(Number(dayPrice))) return Alert.alert("Greška", "Dnevna cijena nije ispravna"), false;

        return true;
    };

    const handleSaveApartment = () => {
        if (!validateForm()) return;

        const payload: CreateApartmentPayload = {
            name: apartmentName,
            address,
            noBeds: Number(noBeds),
            noBedrooms: Number(noBedrooms),
            capacity: Number(capacity),
            overnightPrice: Number(overnightPrice),
            dayPrice: Number(dayPrice),
            images: selectedImages,
            inventory: inventoryData,
        };

        mutation.mutate(payload, {
            onSuccess: (response) => {
                Alert.alert("Uspjeh", response.message || "Apartman dodat");
                resetForm();
            },
            onError: () => {
                Alert.alert("Greška", "Došlo je do greške");
            },
        });
    };

    const resetForm = () => {
        setApartmentName("");
        setAddress("");
        setNoBeds("");
        setNoBedrooms("");
        setCapacity("");
        setOvernightPrice("");
        setDayPrice("");
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
                    label="Naziv"
                    value={apartmentName}
                    onChangeText={setApartmentName}
                />
            }
            addressEdit={
                <LabeledTextField
                    label="Adresa"
                    value={address}
                    onChangeText={setAddress}
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
                    label="Broj kreveta"
                    value={noBeds}
                    onChangeText={setNoBeds}
                    inputProps={{ keyboardType: "numeric" }}
                />
            }
            noBedroomsEdit={
                <LabeledTextField
                    label="Broj soba"
                    value={noBedrooms}
                    onChangeText={setNoBedrooms}
                    inputProps={{ keyboardType: "numeric" }}
                />
            }
            apartmentCapacityEdit={
                <LabeledTextField
                    label="Kapacitet"
                    value={capacity}
                    onChangeText={setCapacity}
                    inputProps={{ keyboardType: "numeric" }}
                />
            }
            priceSection={
                <View style={{ marginTop: 20 }}>
                    <Label text="Cijena" />
                    <View style={{ padding: 16 }}>
                        <PriceInputRow
                            label="Boravak sa noćenjem"
                            value={overnightPrice}
                            onChangeText={setOvernightPrice}
                        />
                        <PriceInputRow
                            label="Dnevni boravak"
                            value={dayPrice}
                            onChangeText={setDayPrice}
                        />
                    </View>
                </View>
            }
            inventoryLink={
                <SectionHeader
                    title="Inventar"
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
                    title={mutation.isPending ? "Čuvanje..." : "Sačuvaj"}
                    onPress={handleSaveApartment}
                />
            }
        />
    );
}
