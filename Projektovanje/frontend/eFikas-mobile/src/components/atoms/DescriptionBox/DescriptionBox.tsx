import { Textarea, TextareaInput } from "@/components/ui/textarea";

interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isInvalid?: boolean;
    isDisabled?: boolean;
    isHovered?: boolean;
    isFocused?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    placeholder?: string;
}

function DescriptionBox({
    size = 'md',
    isInvalid,
    isDisabled,
    isHovered,
    isFocused,
    isRequired,
    isReadOnly,
    placeholder
}: Props) {
    return (
        <Textarea size={size}>
            <TextareaInput placeholder={placeholder} />
        </Textarea>
    );
}

export default DescriptionBox;