import { Text } from "@/components/ui/text";

interface LabelProps {
  text: string;
  color?: string;
  required?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  align?: "left" | "center" | "right";
  className?: string;
}

export const Label = ({
  text,
  color,
  required = false,
  size = "md",
  align = "left",
  className = "",
}: LabelProps) => {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  return (
    <Text
      size={size}
      className={`font-medium ${alignClass} ${className}`}
      style={{ color }}
      accessibilityLabel={`${text}${required ? " (required)" : ""}`}
    >
      {text}
      {required && (
        <Text size={size} style={{ color }}>
          {" "}
        </Text>
      )}
    </Text>
  );
};