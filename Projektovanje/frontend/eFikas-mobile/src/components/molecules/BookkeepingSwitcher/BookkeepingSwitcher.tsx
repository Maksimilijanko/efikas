import { useState } from "react";
import { SegmentedControl } from "../../atoms/SegmentedControl/SegmentedControl";
import { HStack } from "../../ui/hstack";
import { BookkeepingMode } from "@/src/types/types";


interface Props {
  onModeChange: (mode: BookkeepingMode) => void;
  initialMode?: BookkeepingMode;
}

export default function BookkeepingSwitcher({ onModeChange, initialMode = 'yearly' }: Props ) {
  const [authMode, setAuthMode] = useState<BookkeepingMode>(initialMode);

  const handleSegmentChange = (option: string) => {
    const newMode = option === 'Godišnja' ? 'yearly' : 'custom';
    setAuthMode(newMode);
    onModeChange(newMode);
  };

  const selectedOption = authMode === 'yearly' ? 'Godišnja' : 'Prilagođena';

  return (
    <HStack className="w-full justify-center items-center">
      <SegmentedControl
        options={['Godišnja', 'Prilagođena']}
        selectedOption={selectedOption}
        onOptionPress={handleSegmentChange}
      />
    </HStack>
  );
};