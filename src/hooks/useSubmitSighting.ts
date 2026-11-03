import { useSighting } from '@/hooks/useSighting';
import { prepareSightingFormData } from '@/services/prepareSightingFormData';
import { prepareSightingMetadata } from '@/services/prepareSightingMetaData';
import { validateSightingDraft } from '@/services/sightingValidation';
import { submitSighting } from '@/services/submitSighting';
import type {
    SightingSubmission,
    SightingSubmissionResult,
} from '@/types/sightingApi';
import { useRef, useState } from 'react';

export function useSubmitSighting() {
    const { draft, getSubmissionKey } = useSighting();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submissionInProgress = useRef(false);

    // Evita repetir un envío ya confirmado mientras seguimos en P05.
    const acceptedResult = useRef<
        Extract<SightingSubmissionResult, { status: 'accepted' }> | null
    >(null);

    async function handleSubmit():
        Promise<SightingSubmissionResult | null> {
        if (submissionInProgress.current) {
            return null;
        }

        if (acceptedResult.current) {
            return acceptedResult.current;
        }

        submissionInProgress.current = true;
        setIsSubmitting(true);

        try {
            const validation = validateSightingDraft(draft);

            if (!validation.ok) {
                return {
                    status: 'error',
                    reason: 'validation',
                    message: validation.message,
                };
            }

            const metadata =
                prepareSightingMetadata(validation.draft);

            const fingerprint = JSON.stringify({
                photoUri: validation.draft.photo.uri,
                metadata,
            });

            const submission: SightingSubmission = {
                photo: validation.draft.photo,
                metadata,
                idempotencyKey: getSubmissionKey(fingerprint),
            };

            const prepared =
                prepareSightingFormData(submission);

            if (!prepared.ok) {
                return {
                    status: 'error',
                    reason: 'preparation',
                    message: prepared.message,
                };
            }

            const result = await submitSighting(
                prepared.formData,
                submission.idempotencyKey
            );

            if (result.status === 'accepted') {
                acceptedResult.current = result;
            }

            return result;
        } catch {
            return {
                status: 'error',
                reason: 'preparation',
                message:
                    'Se ha producido un error inesperado al procesar el envío. Conservamos el borrador; no podemos confirmar su recepción.',
            };
        } finally {
            submissionInProgress.current = false;
            setIsSubmitting(false);
        }
    }

    return {
        isSubmitting,
        handleSubmit,
    };
}