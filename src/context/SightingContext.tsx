import type { LocationObject } from 'expo-location';
import type { ReactNode } from 'react';
import { createContext, useCallback, useState } from 'react';

import type {
    SightingContextValue,
    SightingDraft,
} from '@/types/sighting';

export const SightingContext =
    createContext<SightingContextValue | undefined>(undefined);

export function SightingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [draft, setDraft] = useState<SightingDraft | null>(null);

    const [pendingLocation, setPendingLocation] =
        useState<LocationObject | null>(null);

    const savePendingLocation = useCallback(
        (location: LocationObject) => {
            setPendingLocation(location);
        },
        []
    );

    const clearPendingLocation = useCallback(() => {
        setPendingLocation(null);
    }, []);

    const saveDraft = useCallback((newDraft: SightingDraft) => {
        setDraft(newDraft);
        setPendingLocation(null);
    }, []);

    const clearDraft = useCallback(() => {
        setDraft(null);
        setPendingLocation(null);
    }, []);

    return (
        <SightingContext
            value={{
                draft,
                pendingLocation,
                saveDraft,
                clearDraft,
                savePendingLocation,
                clearPendingLocation,
            }}
        >
            {children}
        </SightingContext>
    );
}