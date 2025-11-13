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


/**
 * A customizable multi-select dropdown built on top of the
 * `react-native-input-select` library, styled according to the app’s theme.
 *
 * This component allows users to select one or multiple options from a list,
 * with built-in search functionality, custom icons, and flexible display
 * configuration for labels and values.
 *
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label displayed above the dropdown input.
 * @param {string} props.placeholder - Text shown when no option is selected.
 * @param {string} props.textInputPlaceholder - Placeholder text for the search input field.
 * @param {TFlatList | TSectionList} props.options - The list of available options; supports flat or sectioned structures.
 * @param {string} [props.optionLabel] - The key used to display the label for each option.
 * @param {string} [props.optionValue] - The key used to identify the value of each option.
 * @param {TSelectedItem | TSelectedItem[]} props.selectedValue - The currently selected item(s).
 * @param {(selectedItems: TSelectedItem | TSelectedItem[]) => void} props.setSelectedValue - Callback fired when selection changes.
 * @returns {JSX.Element} A styled, searchable, multi-select dropdown component.
 *
 * @example
 * ```tsx
 * const [selectedItems, setSelectedItems] = useState<TSelectedItem[]>([]);
 *
 * <Dropdown
 *   label="Select categories"
 *   placeholder="Choose one or more"
 *   textInputPlaceholder="Search options..."
 *   options={[
 *     { label: "Design", value: "design" },
 *     { label: "Development", value: "dev" },
 *     { label: "Marketing", value: "marketing" },
 *   ]}
 *   selectedValue={selectedItems}
 *   setSelectedValue={setSelectedItems}
 * />
 * ```
 */
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

