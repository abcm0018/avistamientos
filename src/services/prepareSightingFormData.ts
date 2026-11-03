import { PrepareSightingFormDataResult } from '@/types/prepareSightingFormData';
import type { SightingSubmission } from '@/types/sightingApi';
import { File } from 'expo-file-system';

export function prepareSightingFormData(
    submission: SightingSubmission
): PrepareSightingFormDataResult {
    try {
        // ImagePicker proporciona "file" en web.
        // En Android e iOS utilizamos el archivo de la URI.
        const photoFile =
            submission.photo.file ??
            new File(submission.photo.uri);

        if (photoFile.size <= 0) {
            return {
                ok: false,
                message:
                    'La fotografía está vacía o ya no está disponible. Vuelve a tomarla.',
            };
        }

        const mimeType = photoFile.type.toLowerCase();

        if (
            mimeType !== 'image/jpeg' &&
            mimeType !== 'image/png'
        ) {
            return {
                ok: false,
                message:
                    'La fotografía debe estar en formato JPEG o PNG. No se ha enviado el avistamiento.',
            };
        }

        const formData = new FormData();

        formData.append('photo', photoFile);
        formData.append(
            'metadata',
            JSON.stringify(submission.metadata)
        );

        return {
            ok: true,
            formData,
        };
    } catch {
        return {
            ok: false,
            message:
                'No hemos podido preparar la fotografía para enviarla. Conservamos el borrador.',
        };
    }
}