import { Colors } from "@/src/styles/style";
import { DropdownSelect } from 'react-native-input-select';
import { TFlatList, TSectionList, TSelectedItem } from "react-native-input-select/lib/typescript/src/types/index.types";
import { Icon } from "../Icon/Icon";
import { styles } from "./index.styles";

interface Props {
    label: string;
    placeholder: string;
    textInputPlaceholder: string;
    options: TFlatList | TSectionList;
    optionLabel?: string;
    optionValue?: string;
    selectedValue: TSelectedItem | TSelectedItem[];
    setSelectedValue: (selectedItems: TSelectedItem | TSelectedItem[]) => void
}

function Dropdown({
    label,
    placeholder,
    textInputPlaceholder,
    options,
    optionLabel,
    optionValue,
    selectedValue,
    setSelectedValue,
}: Props) {
    
    return (
        <DropdownSelect
            label={label}
            placeholder={placeholder}
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
            selectedValue={selectedValue}
            onValueChange={(itemValue: any) => {
                setTimeout(() => setSelectedValue(itemValue), 0);
            }}
            isMultiple
            isSearchable
            primaryColor={ Colors.primary }
            dropdownIcon={ <Icon name="ChevronDown" size={20} color={Colors.tertiary} /> }
            dropdownIconStyle={styles.dropdownIcon}
            selectedItemsControls={{
                showRemoveIcon: true,
                
            }}
            searchControls={{
                textInputProps: { 
                    placeholder: textInputPlaceholder,
                }
            }}
            dropdownContainerStyle={styles.dropdownContainer}
            dropdownStyle={styles.dropdown}
            placeholderStyle={styles.placeholder}
            labelStyle={styles.label}
        />
    );
}

export default Dropdown;

