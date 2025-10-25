import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

interface Props {
    label: string;
}

function LabelSeparator({ label }: Props) {
    return(
        <HStack space="md" className="w-100 items-center content-center ">
            <Divider className="flex-1 bg-gray-400 ml-2" />
            <Text className="mr-2 ml-2">{label}</Text>
            <Divider className="flex-1 bg-gray-400 mr-2" />
        </HStack>
    );
}

export default LabelSeparator;