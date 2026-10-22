import { obtainLocation } from '@/services/location';
import type { LocationResult } from '@/types/location';
import { useCallback, useRef, useState } from 'react';

export function useLocationRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const requestInProgress = useRef(false);

    const requestLocation = useCallback(
        async (
            options: { requestPermission?: boolean } = {}
        ): Promise<LocationResult | null> => {
            if (requestInProgress.current) {
                return null;
            }

            requestInProgress.current = true;
            setIsLoading(true);

            try {
                return await obtainLocation(options);
            } finally {
                requestInProgress.current = false;
                setIsLoading(false);
            }
        },
        []
    );

    return { isLoading, requestLocation };
}