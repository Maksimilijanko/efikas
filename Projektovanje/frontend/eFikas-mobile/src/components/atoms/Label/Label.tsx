import { Text } from "@/components/ui/text";

interface LabelProps {
  text: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  align?: "left" | "center" | "right";
  className?: string;
}

export const Label = ({
  text,
  required = false,
  error = false,
  disabled = false,
  size = "md",
  align = "left",
  className = "",
}: LabelProps) => {
  const textColor = error
    ? "text-[rgb(var(--color-error-600))]"
    : disabled
    ? "text-[rgb(var(--color-secondary-400))]"
    : "text-[rgb(var(--color-secondary-900))]";

  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  return (
    <Text
      size={size} 
      className={`font-medium ${textColor} ${alignClass} ${className}`}
      accessibilityLabel={`${text}${required ? " (required)" : ""}`}
    >
      {text}
      {required && (
        <Text size={size} className="text-[rgb(var(--color-secondary-900))]">
          {" "}
        </Text>
      )}
    </Text>
  );
};
