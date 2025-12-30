import { Button, ButtonText } from "@/src/components/ui/button";

interface BasicButtonProps {
  title?: string;
  onPress: () => void;
  className?: string; 
  textClassName?: string;
}

export const BasicButton = ({
  title = "BasicButton",
  onPress,
  className,
  textClassName,
}: BasicButtonProps) => {
  return (
    <Button
      action="primary"
      variant="solid"
      size="lg"
      onPress={onPress}
      className={`w-[190px] h-[46px] rounded-[32px] justify-center items-center self-center bg-[rgb(var(--color-primary-500))] ${className ?? ""}`}
    >
      <ButtonText className={`text-white font-semibold ${textClassName ?? ""}`}>
        {title}
      </ButtonText>
    </Button>
  );
};
