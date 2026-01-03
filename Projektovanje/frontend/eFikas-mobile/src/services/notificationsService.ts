import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Constants from 'expo-constants';
import { API_URLS } from '../util/apiConstants';
import axiosInstance from '../api/axiosInstance';
import { PushNotificationTokenRequest } from '../types/types';


export const notificationsService = {
	registerPushTokenAsync: async () => {
        if (!Device.isDevice) throw new Error('Must use physical device');

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') throw new Error('Permission not granted');

        const token: string = (await Notifications.getDevicePushTokenAsync()).data;
		const payload: PushNotificationTokenRequest = {
            token: token,
            userId: 1
        }


		const response = await axiosInstance.post(API_URLS.notifications.pushToken, payload);

        if (response.status !== 200) throw new Error('Failed to save token on server');

        return response.data;
    }
}