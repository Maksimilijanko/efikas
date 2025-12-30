import { useState } from "react";
import { SegmentedControl } from "../../atoms/SegmentedControl/SegmentedControl";
import { HStack } from "../../ui/hstack";
import { BookkeepingMode } from "@/src/types/types";


interface Props {
  onModeChange: (mode: BookkeepingMode) => void;
  mode?: BookkeepingMode;
  initialMode?: BookkeepingMode;
}

export default function BookkeepingSwitcher({ onModeChange, initialMode = 'yearly', mode }: Props ) {
  const [bookkeepingMode, setBookkeepingMode] = useState<BookkeepingMode>(initialMode);

  const handleSegmentChange = (option: string) => {
    const newMode = option === 'Godišnja' ? 'yearly' : 'custom';
    setBookkeepingMode(newMode);
    onModeChange(newMode);
  };

  const selectedOption = bookkeepingMode === 'yearly' ? 'Godišnja' : 'Prilagođena';

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