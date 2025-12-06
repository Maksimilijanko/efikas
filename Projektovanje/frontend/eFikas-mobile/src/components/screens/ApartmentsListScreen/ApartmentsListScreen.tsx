import React, { useEffect, useState } from "react";
import ApartmentsListTemplate from "../../templates/ApartmentsListTemplate/ApartmentsListTemplate";
import ApartmentCard from "../../organisms/ApartmentCard/ApartmentCard";
import FloatButton from "../../atoms/FloatButton/FloatButton";
import { Icon } from "../../atoms/Icon/Icon";
import { Apartment, apartmentsListService } from "@/src/services/apartmentsListService";


const ApartmentsListScreen: React.FC = () => {
  const [apartmentsData, setApartmentsData] = useState<Apartment[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await apartmentsListService.getApartments();
      setApartmentsData(data);
    };

    load();
  }, []);

  // MAP TO ORGANISMS
  const apartments = apartmentsData.map((item) => (
    <ApartmentCard
      key={item.id}
      title={item.title}
      subtitle={item.subtitle}
      imageUrl={item.imageUrl}
      status={item.status}
      statusUntil={item.statusUntil}
      nextGuestsDate={item.nextGuestsDate}
      onPress={() => {
        console.log("Pressed apartment ID:", item.id);
      }}
      style={{}}
    />
  ));

  return (
    <ApartmentsListTemplate
      apartments={apartments}
      floatingActionButton={
        <FloatButton
          size="lg"
          icon={() => <Icon name="HousePlus" size={22} color="white" />}
          onClick={() => {
            console.log("Floating button pressed");
          }}
        />
      }
    />
  );
};

export default ApartmentsListScreen;
