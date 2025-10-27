import FontAwesome6 from "@expo/vector-icons/FontAwesome";
import { StyleProp, TextStyle } from "react-native";

type FontAwesome6Name = React.ComponentProps<typeof FontAwesome6>["name"];
interface Props {
    name: FontAwesome6Name;
    color?: string;
    size?: number;
    style?: StyleProp<TextStyle>;
}

// Link ka ikonicama: https://icons.expo.fyi/Index
// TODO: Istraziti Gluestack boje!!
function Icon({ name, color = 'rgb(49 118 191)', size = 25, style }: Props) {
    return(
        <FontAwesome6 color={color} name={name} size={size} style={style} className="text-[rgb(var(--color-primary-500))]" />
    );
}

export default Icon;