import { ToggleItem } from "@/src/components/molecules/ToggleItem/ToggleItem";
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import { Colors } from '@/src/styles/style';
import { notificationsApiService } from '@/src/api/services/notificationsApiService';
import { useTheme } from "@/src/providers/ThemeProvider";
import { notificationsService } from '@/src/services/notificationsService';
import { toastService } from '@/src/services/toastService';
import { useTranslation } from "react-i18next";
import debounce from 'lodash.debounce';

const NotificationsScreen: React.FC = () => {
	const { t } = useTranslation();
	const { Colors } = useTheme();

	const styles = getStyles(Colors);

	// Debouncing da se ne salje na svaki klik novi zahtjev, postoji grace period od 400ms
	const handleToggle = debounce(async (value: boolean) => {
		console.log(`Obavještenja su ${value ? 'uključena' : 'isključena'}`);
		try {
			const pushToken = await notificationsService.getPushToken();

			await notificationsApiService.toggleNotifications({
				pushToken,
				enabled: value
			});

			toastService.success(
				t('notifications.notificationToggleSuccessTitle'),
				t('notifications.notificationToggleSuccessMessage')
			);
		} catch (err) {
			console.log("Error during toggling notifiations: ", err.message);
			toastService.error(
				t('notifications.notificationToggleErrorTitle'),
				t('notifications.notificationToggleErrorMessage')
			);
		}
	}, 400);

	return (
		<ScrollView
			style={styles.background}
			contentContainerStyle={styles.contentContainer}
		>

			<ToggleItem
				title={t('notifications.title')}
				leftIconName="Bell"
				initialValue={true}
				onValueChange={handleToggle}
			/>

			<View style={styles.dividerStyle} />

			<Text style={styles.descriptionText}>
				{t('notifications.description')}
			</Text>

		</ScrollView>
	);
};

const getStyles = (Colors: any) =>
	StyleSheet.create({
		background: {
			flex: 1,
			backgroundColor: Colors.screenBackground,
		},
		contentContainer: {
			paddingTop: 10,
		},
		dividerStyle: {
			height: 1,
			backgroundColor: Colors.borderColor,
			marginHorizontal: 16,
			marginBottom: 8,
		},
		descriptionText: {
			fontSize: 12,
			color: Colors.textSecondary,
			lineHeight: 18,
			paddingHorizontal: 16,
			paddingBottom: 20,
		},
	});

export default NotificationsScreen;