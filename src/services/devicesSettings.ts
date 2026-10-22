import { Linking, Platform } from 'react-native';

export async function openDeviceSettings(
    target: 'location' | 'application'
): Promise<boolean> {
    try {
        if (Platform.OS === 'android' && target === 'location') {
            await Linking.sendIntent(
                'android.settings.LOCATION_SOURCE_SETTINGS'
            );

            return true;
        }

        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            await Linking.openSettings();
            return true;
        }

        return false;
    } catch {
        return false;
    }
}