import { BaseToast, ErrorToast } from "react-native-toast-message";
import { useTheme } from "@/src/providers/ThemeProvider";

export const ToastConfig = {
  success: (props: any) => {
    const { Colors } = useTheme();

    return (
      <BaseToast
        {...props}
        style={{
          backgroundColor: Colors.toastBackground,
          borderLeftColor: Colors.success,
        }}
        text1Style={{
          color: Colors.textPrimary,
          fontSize: 12,
          fontWeight: "600",
        }}
        text2Style={{
          color: Colors.textSecondary,
          fontSize: 10,
        }}
      />
    );
  },

  error: (props: any) => {
    const { Colors } = useTheme();

    return (
      <ErrorToast
        {...props}
        style={{
          backgroundColor: Colors.toastBackground,
          borderLeftColor: Colors.error,
        }}
        text1Style={{
          color: Colors.textPrimary,
        }}
        text2Style={{
          color: Colors.textSecondary,
        }}
      />
    );
  },

  info: (props: any) => {
    const { Colors } = useTheme();

    return (
      <BaseToast
        {...props}
        style={{
          backgroundColor: Colors.toastBackground,
          borderLeftColor: Colors.info,
        }}
        text1Style={{
          color: Colors.textPrimary,
        }}
        text2Style={{
          color: Colors.textSecondary,
        }}
      />
    );
  },
};
