import type { ImagePickerAsset } from 'expo-image-picker';

export type CameraPermissionResult =
    | {
        status: 'granted';
    }
    | {
        status: 'permission-denied';
        canAskAgain: boolean;
    }
    | {
        status: 'error';
    };

export type CameraResult =
    | {
        status: 'captured';
        photo: ImagePickerAsset;
        captureReturnedAt: string,
    }
    | {
        status: 'cancelled';
    }
    | {
        status: 'permission-denied';
        canAskAgain: boolean;
    }
    | {
        status: 'error';
    };