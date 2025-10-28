import { Button, ButtonText } from "@/components/ui/button";

interface LoginButtonProps {
  title?: string;
  onPress: () => void;
  className?: string; 
  textClassName?: string;
}

export const LoginButton = ({
  title = "Login",
  onPress,
  className,
  textClassName,
}: LoginButtonProps) => {
  return (
    <Button
      action="primary"
      variant="solid"
      size="lg"
      onPress={onPress}
      className={`w-[346px] h-[46px] rounded-[10px] justify-center items-center self-center bg-[rgb(var(--color-primary-500))] ${className ?? ""}`}
    >
      <ButtonText className={`text-white font-semibold ${textClassName ?? ""}`}>
        {title}
      </ButtonText>
    </Button>
  );
};
