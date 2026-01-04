import { useMutation } from "@tanstack/react-query";
import { notificationsApiService } from "../api/services/notificationsApiService";

export const useRegisterNotifications = () => {
    return useMutation({
        mutationFn: () => notificationsApiService.registerPushTokenAsync(),
        onSuccess: () => {
            console.info("Push notifications registered successfully!");
        },
        onError: (error) => {
            console.error("Notification setup failed: ", error.message);
        }
    });
};