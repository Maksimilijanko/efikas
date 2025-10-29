import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { ReactNode } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome";
import { Icon } from "../Icon/Icon";


interface Props {
    size?: "sm" | "md" | "lg";
    placement?: "top left" | "top right" | "bottom left" | "bottom right" | "top center" | "bottom center";
    label?: string;
    icon?: any;
    onClick: () => void;
}

function FloatButton({
    size = "md",
    placement = "bottom right",
    label,
    icon = () => <Icon size={20} name="Plus" color="white" />,
    onClick
}: Props) {

    return(
        <Fab size={size} placement={placement} onPress={onClick} >
            <FabIcon as={icon}></FabIcon>
            {label && <FabLabel>{label}</FabLabel>}
        </Fab>
    );
}

export default FloatButton;