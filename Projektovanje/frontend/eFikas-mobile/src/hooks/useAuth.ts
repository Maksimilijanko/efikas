import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/services/authService';
import { secureStoreService } from '../services/secureStoreService';
import { toastService } from '../services/toastService';
import { LoginRequest, RegisterRequest } from '../types/types';
import { SECURE_STORE_KEYS } from '../util/secureStoreKeys';
import { notificationsService } from '../services/notificationsService';
import { notificationsApiService } from '../api/services/notificationsApiService';

export const useAuth = () => {
    const { t } = useTranslation();

    const loginMutation = useMutation({
        mutationFn: (loginRequest: LoginRequest) => authService.login(loginRequest),
        onSuccess: (response) => {
            if (response.status === 200) {
                toastService.success(
                    t('auth.login.toastMessages.successTitle'),
                    t('auth.login.toastMessages.successMsg')
                );

                secureStoreService.setItemAsync(
                    SECURE_STORE_KEYS.authenticationResponseKey,
                    JSON.stringify(response.data)
                );

                router.replace('/(tabs)');
            } else {
                throw new Error(`Login failed with status: ${response.status}`);
            }
        },
        onError: (error: Error) => {
            
            toastService.error(
                t('auth.login.toastMessages.errorTitle'),
                t('auth.login.toastMessages.errorMsg')
            );
            
            // If it's an Axios error
            if ((error as any).isAxiosError) {
                console.log("Axios error details:", {
                    status: (error as any).response?.status,
                    statusText: (error as any).response?.statusText,
                    data: (error as any).response?.data,
                    headers: (error as any).response?.headers,
                });
            }
        },
    });

    const registerMutation = useMutation({
        mutationFn: (registerRequest: RegisterRequest) =>
            authService.register(registerRequest),
        onSuccess: (response) => {
			try {
				if (response.status === 200) {
					console.log("User succesfully logged in.");
					toastService.success(
						t('auth.register.toastMessages.successTitle'),
						t('auth.register.toastMessages.successMsg')
					);
				} else {
					throw new Error(`Registration failed with status: ${response.status}`);
				}
			} catch(err) {
				console.error("Error in login: ", err.message);
			}
            
        },
        onError: (error: Error) => {
            toastService.error(
                t('auth.register.toastMessages.errorTitle'),
                t('auth.register.toastMessages.errorMsg')
            );
            console.log("Registration error: ", error.message);
        },
    });

    const logout = async () => {
        try {
            await secureStoreService.deleteItemAsync(
                SECURE_STORE_KEYS.authenticationResponseKey
            );
            toastService.success(
                t('auth.logout.toastMessages.successTitle'),
                t('auth.logout.toastMessages.successMsg')
            );
            router.replace('/(auth)');
            
        } catch (error) {
            console.error("Greška prilikom odjave:", error);
            toastService.error(
                t('auth.logout.toastMessages.errorTitle'),
                t('auth.logout.toastMessages.errorMsg')
            );
        }
    };

    return {
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
    };
}