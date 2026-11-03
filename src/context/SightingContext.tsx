import { randomUUID } from 'expo-crypto';
import type { LocationObject } from 'expo-location';

import type { ReactNode } from 'react';
import { createContext, useCallback, useRef, useState } from 'react';

import type {
    SightingContextValue,
    SightingDraft,
} from '@/types/sighting';
import { SightingSubmissionResult } from '@/types/sightingApi';

export const SightingContext =
    createContext<SightingContextValue | undefined>(undefined);

export function SightingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [submissionConfirmed, setSubmissionConfirmed] = useState(false);
    const [draft, setDraft] = useState<SightingDraft | null>(null);
    const [pendingLocation, setPendingLocation] =
        useState<LocationObject | null>(null);
    
    const [submissionResult, setSubmissionResult] =
        useState<SightingSubmissionResult | null>(null);

    const submissionIdentity = useRef<{
        fingerprint: string;
        key: string;
    } | null>(null);

    const confirmSubmission = useCallback(() => {
        setSubmissionConfirmed(true);
        setDraft(null);
        setPendingLocation(null);
        submissionIdentity.current = null;
    }, []);

    const saveSubmissionResult = useCallback(
        (result: SightingSubmissionResult) => {
            setSubmissionResult(result);

            if (result.status === 'accepted') {
                confirmSubmission();
            }
        },
        [confirmSubmission]
    );

    const clearSubmissionResult = useCallback(() => {
        setSubmissionResult(null);
    }, []);

    const getSubmissionKey = useCallback(
        (fingerprint: string): string => {
            if (
                submissionIdentity.current?.fingerprint !== fingerprint
            ) {
                submissionIdentity.current = {
                    fingerprint,
                    key: randomUUID(),
                };
            }

            return submissionIdentity.current.key;
        },
        []
    );

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
        submissionIdentity.current = null;
        setSubmissionConfirmed(false);
        setSubmissionResult(null);
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
                getSubmissionKey,
                submissionConfirmed,
                confirmSubmission,
                submissionResult,
                clearSubmissionResult,
                saveSubmissionResult,
            }}
        >
            {children}
        </SightingContext>
    );
}