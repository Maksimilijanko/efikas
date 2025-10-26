import FontAwesome6 from "@expo/vector-icons/FontAwesome";

interface Props {
    name: string;
    color?: string;
    size?: number;
}

// Link ka ikonicama: https://icons.expo.fyi/Index
function Icon({ name, color = "white", size = 25 }: Props) {
    return(
        <FontAwesome6 color={color} name={name} size={size} />
    );
}

export default Icon;