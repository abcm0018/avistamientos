import { getApiBaseUrl } from '@/api/config';
import { ENDPOINTS } from '@/api/endpoints';
import type {
    SightingApiResponse,
    SightingSubmissionError,
    SightingSubmissionResult,
} from '@/types/sightingApi';
import { fetch } from 'expo/fetch';

const SUBMISSION_TIMEOUT_MS = 30_000;

function submissionError(
    reason: SightingSubmissionError,
    message: string
): SightingSubmissionResult {
    return {
        status: 'error',
        reason,
        message,
    };
}

function isSightingApiResponse(
    value: unknown
): value is SightingApiResponse {
    if (
        typeof value !== 'object' ||
        value === null ||
        !('status' in value) ||
        !('message' in value)
    ) {
        return false;
    }

    return (
        (value.status === 'accepted' ||
            value.status === 'rejected') &&
        typeof value.message === 'string' &&
        value.message.trim().length > 0
    );
}

export async function submitSighting(
    formData: FormData,
    idempotencyKey: string
): Promise<SightingSubmissionResult> {
    let endpoint: string;

    try {
        const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
        const url = new URL(`${baseUrl}${ENDPOINTS.sightings}`);

        if (
            !['https:', 'http:'].includes(url.protocol) ||
            url.username ||
            url.password ||
            url.search ||
            url.hash
        ) {
            throw new Error('Configuración de URL no válida.');
        }

        if (!idempotencyKey.trim()) {
            throw new Error('Falta la clave de idempotencia.');
        }

        endpoint = url.toString();
    } catch {
        return submissionError(
            'configuration',
            'El envío todavía no está configurado correctamente.'
        );
    }

    const controller = new AbortController();
    let timedOut = false;

    const timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, SUBMISSION_TIMEOUT_MS);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Idempotency-Key': idempotencyKey,
            },
            body: formData,
            signal: controller.signal,
        });

        if (response.status === 409) {
            return submissionError(
                'idempotency-conflict',
                'El identificador del envío ya se ha utilizado con otros datos. No se ha podido confirmar este envío.'
            );
        }

        if (response.status >= 500) {
            return submissionError(
                'server',
                'El servidor ha devuelto un error. Conservamos tu avistamiento, pero no podemos confirmar su recepción.'
            );
        }

        if (
            response.status !== 201 &&
            response.status !== 422
        ) {
            return submissionError(
                'invalid-response',
                'El servidor ha devuelto una respuesta inesperada. No podemos confirmar la recepción.'
            );
        }

        // La lectura del cuerpo también está cubierta por el timeout.
        const responseText = await response.text();
        let payload: unknown;

        try {
            payload = JSON.parse(responseText);
        } catch {
            return submissionError(
                'invalid-response',
                'No hemos podido interpretar la respuesta del servidor.'
            );
        }

        if (!isSightingApiResponse(payload)) {
            return submissionError(
                'invalid-response',
                'La respuesta del servidor no tiene el formato esperado.'
            );
        }

        if (
            response.status === 201 &&
            payload.status === 'accepted'
        ) {
            return {
                status: 'accepted',
                message: payload.message.trim(),
            };
        }

        if (
            response.status === 422 &&
            payload.status === 'rejected'
        ) {
            return {
                status: 'rejected',
                message: payload.message.trim(),
            };
        }

        return submissionError(
            'invalid-response',
            'El resultado recibido no coincide con el estado de la respuesta.'
        );
    } catch {
        if (timedOut) {
            return submissionError(
                'timeout',
                'Se ha agotado el tiempo de espera. No podemos confirmar si el servidor recibió el avistamiento.'
            );
        }

        return submissionError(
            'network',
            'Se ha producido un error de comunicación. Comprueba tu conexión; no podemos confirmar la recepción del avistamiento.'
        );
    } finally {
        clearTimeout(timeoutId);
    }
}