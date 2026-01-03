import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Constants from 'expo-constants';
import { API_URLS } from '../util/apiConstants';
import axiosInstance from '../api/axiosInstance';
import { PushNotificationTokenRequest } from '../types/types';
import { Platform } from 'react-native';

const getPlatform = () => {
	if (Platform.OS === 'ios') {
		return 'ios';
	} else if (Platform.OS === 'android') {
		return 'android';
	}
}

export const notificationsService = {
	configureNotifications: async() => {
		// Set up the channel for Android
		if (Platform.OS === 'android') {
			await Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			});
		}

		// Request permissions here too
		const { status } = await Notifications.getPermissionsAsync();
		if (status !== 'granted') {
			await Notifications.requestPermissionsAsync();
		}
	},

	registerPushTokenAsync: async () => {
        if (!Device.isDevice) throw new Error('Must use physical device');

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') throw new Error('Permission not granted');

        const token: string = (await Notifications.getExpoPushTokenAsync()).data;
		const payload: PushNotificationTokenRequest = {
            token: token,
			platform: getPlatform(),
            userId: 1
        }

		// TODO: create hook + register at beginning
		const response = await axiosInstance.post(API_URLS.notifications.pushToken, payload);

        if (response.status !== 200) throw new Error('Failed to save token on server');

        return response.data;
    }
}