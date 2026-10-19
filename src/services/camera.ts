import * as ImagePicker from 'expo-image-picker';

import type { CameraResult } from '@/types/camera';

export async function capturePhoto(): Promise<CameraResult> {
    try {
        let permission = await ImagePicker.getCameraPermissionsAsync();

        if (!permission.granted && permission.canAskAgain) {
            permission = await ImagePicker.requestCameraPermissionsAsync();
        }

        if (!permission.granted) {
            return {
                status: 'permission-denied',
                canAskAgain: permission.canAskAgain,
            };
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (result.canceled) {
            return {
                status: 'cancelled',
            };
        }

        const photo = result.assets[0];

        if (!photo?.uri) {
            return {
                status: 'error',
            };
        }

        return {
            status: 'captured',
            photo,
        };
    } catch (error) {
        console.warn('Error al abrir o utilizar la cámara:', error);

        return {
            status: 'error',
        };
    }
}