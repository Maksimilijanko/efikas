import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


export const notificationsService = {
	getPlatform: () => {
		if (Platform.OS === 'ios') {
			return 'ios';
		} else if (Platform.OS === 'android') {
			return 'android';
		}
	},

	getPushToken: async () => {
		return (await Notifications.getExpoPushTokenAsync()).data;
	},

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

	
}