import * as ImagePicker from 'expo-image-picker';

import type { CameraPermissionResult, CameraResult } from '@/types/camera';

export async function checkCameraPermission():
    Promise<CameraPermissionResult> {
    try {
        const permission =
            await ImagePicker.getCameraPermissionsAsync();

        if (permission.granted) {
            return { status: 'granted' };
        }

        return {
            status: 'permission-denied',
            canAskAgain: permission.canAskAgain,
        };
    } catch (error) {
        console.warn(
            'Error al consultar el permiso de cámara:',
            error
        );

        return { status: 'error' };
    }
}

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

        const captureReturnedAt = new Date().toISOString();

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
            captureReturnedAt,
        };
    } catch (error) {
        console.warn('Error al abrir o utilizar la cámara:', error);

        return {
            status: 'error',
        };
    }
}