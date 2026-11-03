import { useLocationRequest } from '@/hooks/useLocationRequest';
import { useSighting } from '@/hooks/useSighting';
import { ROUTES } from '@/navigation/routes';
import { capturePhoto } from '@/services/camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';

// Shared entry action: opening an informational screen never starts this flow.
export function useReportSighting() {
    const { isLoading, requestLocation } = useLocationRequest();
    const [ isCameraActive, setIsCameraActive ] = useState(false);
    const { saveDraft, clearDraft, savePendingLocation, clearPendingLocation } = useSighting();
    const reportInProgress = useRef(false);

    const isBusy = isLoading || isCameraActive;

    async function handleReportPress() {
        if (reportInProgress.current) {
            return;
        }

        reportInProgress.current = true;
        clearDraft();

        try {
            const locationResult = await requestLocation();

            if (locationResult === null) {
                return;
            }

            if (!locationResult.ok) {
                router.push({
                    pathname: ROUTES.location,
                    params: {
                        reason: locationResult.reason,
                        ...(typeof locationResult.canAskAgain === 'boolean'
                        ? { canAskAgain: String(locationResult.canAskAgain) }
                        : {}),
                    },
                });

                return;
            }

            savePendingLocation(locationResult.location);
            setIsCameraActive(true);

            const cameraResult = await capturePhoto();

            switch (cameraResult.status) {
                case 'captured':
                    saveDraft({
                        location: locationResult.location,
                        photo: cameraResult.photo,
                        captureReturnedAt: cameraResult.captureReturnedAt,
                        photoAccepted: false,
                    });

                    router.push(ROUTES.photoReview);
                    break;

                case 'cancelled':
                    clearPendingLocation();
                    break;

                case 'permission-denied':

                case 'error':
                    router.push({
                        pathname: ROUTES.camera,
                        params:{
                            mode: 'initial',
                            reason: cameraResult.status,
                            ...(cameraResult.status === 'permission-denied'
                                ? { 
                                    canAskAgain: String(cameraResult.canAskAgain),
                                }
                                : {}),
                        },
                    })
                    break;
            }
        } finally {
            setIsCameraActive(false);
            reportInProgress.current = false;
        }
    }

    return { isLoading, isCameraActive, isBusy, handleReportPress };
}
