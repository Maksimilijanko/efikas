import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Directory, File, Paths } from "expo-file-system";
import { fetch } from "expo/fetch";

import AddApartmentTemplate from "../../templates/AddApartmentTemplate/AddApartmentTemplate";
import LabeledTextField from "../../molecules/LabeledTextField/LabeledTextField";
import ImagePicker from "../../organisms/ImagePicker/ImagePicker";
import { SectionHeader } from "../../molecules/SectionHeader/SectionHeader";
import { PriceInputRow } from "../../organisms/ApartmentPriceInput/ApartmentPriceInput";
import { Label } from "../../atoms/Label/Label";
import { BasicButton } from "../../atoms/BasicButton/BasicButton";
import InventoryDialog from "../../organisms/Dialogs/InventoryDialog/InventoryDialog";

import type {
  ApartmentInventory,
  ApartmentResponse,
  CreateApartmentPayload,
} from "@/src/types/types";
import { toastService } from "@/src/services/toastService";
import { useUpdateApartment } from "@/src/hooks/useUpdateApartment";

interface FormState {
  apartmentName: string;
  address: string;
  noBeds: string;
  noBedrooms: string;
  capacity: string;
  overnightPrice: string;
  dayPrice: string;
}

const INITIAL_FORM_STATE: FormState = {
  apartmentName: "",
  address: "",
  noBeds: "",
  noBedrooms: "",
  capacity: "",
  overnightPrice: "",
  dayPrice: "",
};

const EMPTY_INVENTORY: ApartmentInventory = {
  parking: false,
  tv: false,
  wifi: false,
  fen: false,
  klima: false,
  vesMasina: false,
  kafa: false,
  balkon: false,
};

const getFileExtFromUrl = (url: string) => {
  const clean = url.split("?")[0];
  const last = clean.split(".").pop();
  if (!last) return "jpg";
  const ext = last.toLowerCase();
  return ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
};

const downloadPicturesToLocal = async (urls: string[], apartmentId: number) => {
  const results: string[] = [];
  // folder in cache: <cache>/apartment-images/
  const dir = new Directory(Paths.cache, "apartment-images");
  try {
    dir.create();
  } catch {
  }

  for (let i = 0; i < urls.length; i++) {
    const rawUrl = urls[i];
    if (!rawUrl) continue;

    const url = rawUrl;
    const ext = getFileExtFromUrl(url);
    const file = new File(Paths.cache, `apartment-images/apt_${apartmentId}_${i}.${ext}`);

    try {
      try {
        if (file.exists) {
          results.push(file.uri);
          continue;
        }
      } catch {
      }

      console.log(`⬇️ downloading [${i}]`, url);

      const res = await fetch(url);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.log(`❌ download failed [${i}] status:`, res.status);
        console.log("URL:", url);
        console.log("BODY:", text.slice(0, 300));
        continue;
      }

      const bytes = await res.bytes();
      file.write(bytes);


      console.log(`✅ saved [${i}] ->`, file.uri);
      results.push(file.uri);
    } catch (e: any) {
      console.log(`❌ download failed [${i}]`, e?.message ?? e);
    }
  }

  console.log("📦 local URIs:", results);
  return results;
};

export default function EditApartmentScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const params = useLocalSearchParams<{ apartmentId?: string }>();
  const apartmentId = params.apartmentId ? Number(params.apartmentId) : NaN;

  const mutation = useUpdateApartment(apartmentId);

  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const [inventoryData, setInventoryData] =
    useState<ApartmentInventory>(EMPTY_INVENTORY);

  const apartmentFromCache = useMemo(() => {
    const apartments =
      queryClient.getQueryData<ApartmentResponse[]>(["apartments"]) ?? [];
    return apartments.find((a) => a.apartmentId === apartmentId) ?? null;
  }, [queryClient, apartmentId]);

  useEffect(() => {
    if (!apartmentFromCache) return;

    setForm({
      apartmentName: apartmentFromCache.name ?? "",
      address: apartmentFromCache.address ?? "",
      noBeds: String(apartmentFromCache.numberOfBeds ?? ""),
      noBedrooms: String(apartmentFromCache.numberOfRooms ?? ""),
      capacity: String(apartmentFromCache.capacity ?? ""),
      overnightPrice: String(apartmentFromCache.pricePerNight ?? ""),
      dayPrice: String(apartmentFromCache.pricePerDay ?? ""),
    });

    setInventoryData({
      ...EMPTY_INVENTORY,
      ...(apartmentFromCache.traits ?? {}),
    });

    const urls = apartmentFromCache.pictures ?? [];
    console.log("🖼️ S3 pictures:", urls);

    if (!urls.length || !Number.isFinite(apartmentId)) return;

    let cancelled = false;

    (async () => {
      const localUris = await downloadPicturesToLocal(urls, apartmentId);
      if (!cancelled) {
        setSelectedImages((prev) => (prev.length ? prev : localUris));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apartmentFromCache, apartmentId]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.apartmentName.trim()) {
      toastService.error(
        t("addApartment.validation.errorTitle"),
        t("addApartment.validation.nameError")
      );
      return false;
    }
    if (!form.address.trim()) {
      toastService.error(
        t("addApartment.validation.errorTitle"),
        t("addApartment.validation.addressError")
      );
      return false;
    }
    const nums: Array<[keyof FormState, string]> = [
      ["noBeds", t("addApartment.validation.bedsError")],
      ["noBedrooms", t("addApartment.validation.bedroomsError")],
      ["capacity", t("addApartment.validation.capacityError")],
      ["overnightPrice", t("addApartment.validation.overnightPriceError")],
      ["dayPrice", t("addApartment.validation.dayPriceError")],
    ];
    for (const [field, msg] of nums) {
      if (!String(form[field]).trim() || isNaN(Number(form[field]))) {
        toastService.error(t("addApartment.validation.errorTitle"), msg);
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!Number.isFinite(apartmentId)) {
      toastService.error("Greška", "Neispravan apartmentId.");
      return;
    }
    if (!apartmentFromCache) {
      toastService.error(
        "Greška",
        "Apartman nije pronađen u cache-u. Vrati se na listu."
      );
      return;
    }
    if (!validateForm()) return;

    if (!selectedImages.length) {
      toastService.error(
        t("addApartment.validation.errorTitle"),
        "Dodaj bar jednu sliku."
      );
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

    mutation.mutate(payload, {
      onSuccess: (response: any) => {
        toastService.success(
          t("addApartment.messages.successTitle"),
          response?.message || "Apartman je uspješno izmijenjen."
        );
        router.back();
      },
      onError: () => {
        toastService.error(
          t("addApartment.messages.errorTitle"),
          "Došlo je do greške prilikom izmjene apartmana."
        );
      },
    });
  };

  if (!apartmentFromCache) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Label text="Apartman nije učitan. Vrati se na listu." />
      </View>
    );
  }

  return (
    <AddApartmentTemplate
      nameEdit={
        <LabeledTextField
          label={t("addApartment.fields.name")}
          value={form.apartmentName}
          onChangeText={(v) => updateField("apartmentName", v)}
        />
      }
      addressEdit={
        <LabeledTextField
          label={t("addApartment.fields.address")}
          value={form.address}
          onChangeText={(v) => updateField("address", v)}
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
          label={t("addApartment.fields.noBeds")}
          value={form.noBeds}
          onChangeText={(v) => updateField("noBeds", v)}
          inputProps={{ keyboardType: "numeric" }}
        />
      }
      noBedroomsEdit={
        <LabeledTextField
          label={t("addApartment.fields.noBedrooms")}
          value={form.noBedrooms}
          onChangeText={(v) => updateField("noBedrooms", v)}
          inputProps={{ keyboardType: "numeric" }}
        />
      }
      apartmentCapacityEdit={
        <LabeledTextField
          label={t("addApartment.fields.capacity")}
          value={form.capacity}
          onChangeText={(v) => updateField("capacity", v)}
          inputProps={{ keyboardType: "numeric" }}
        />
      }
      priceSection={
        <View style={{ marginTop: 20 }}>
          <Label text={t("addApartment.fields.price")} />
          <View style={{ padding: 16 }}>
            <PriceInputRow
              label={t("addApartment.fields.overnightPrice")}
              value={form.overnightPrice}
              onChangeText={(v) => updateField("overnightPrice", v)}
            />
            <PriceInputRow
              label={t("addApartment.fields.dayPrice")}
              value={form.dayPrice}
              onChangeText={(v) => updateField("dayPrice", v)}
            />
          </View>
        </View>
      }
      inventoryLink={
        <SectionHeader
          title={t("addApartment.fields.inventory")}
          onPress={() => setInventoryModalVisible(true)}
        />
      }
      inventoryModal={
        <InventoryDialog
          visible={inventoryModalVisible}
          onClose={() => setInventoryModalVisible(false)}
          onSave={(data) => setInventoryData(data)}
          initialValues={inventoryData}
        />
      }
      saveButton={
        <BasicButton
          title={mutation.isPending ? "Čuvam..." : "Sačuvaj izmjene"}
          onPress={handleSave}
        />
      }
    />
  );
}
