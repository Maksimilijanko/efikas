import React from "react";
import ApartmentsListTemplate from "../../templates/ApartmentsListTemplate/ApartmentsListTemplate";
import ApartmentCard from "../../organisms/ApartmentCard/ApartmentCard";
import FloatButton from "../../atoms/FloatButton/FloatButton";
import { Icon } from "../../atoms/Icon/Icon";
import { useApartmentsList } from "@/src/hooks/useApartmentsList";
import { router } from "expo-router";


const ApartmentsListScreen: React.FC = () => {
  const { data, isLoading, error } = useApartmentsList();

  if (isLoading) {
    return <ApartmentsListTemplate apartments={[]} />;
  }

  if (error) {
    return <ApartmentsListTemplate apartments={[]} />;
  }

  const apartments = data?.map((item) => (
    <ApartmentCard
      key={item.id}
      name={item.name}
      address={item.address}
      imageUrl={item.imageUrl}
      status={item.status}
      statusUntil={item.statusUntil}
      nextGuestsDate={item.nextGuestsDate}
      onPress={() => console.log("Pressed apartment ID:", item.id)}
      style={{}}
    />
  )) ?? [];

  return (
    <ApartmentsListTemplate
      apartments={apartments}
      floatingActionButton={
        <FloatButton
          size="lg"
          icon={() => <Icon name="HousePlus" size={22} color="white" />}
          onClick={() => router.push('/addApartment')}
        />
      }
    />
  );
};

export default ApartmentsListScreen;
