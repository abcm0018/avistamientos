import { SightingDraft, SightingType } from "./sighting";

export type SightingMetaData = {
    latitude: number,
    longitude: number,
    accuracy?: number,
    locatedAt: string,
    captureReturnedAt: string,
    sightingType: SightingType,
    observations?: string,
};

// Datos preparados por la aplicación
export type SightingSubmission = {
  photo: SightingDraft['photo'];
  metadata: SightingMetaData;
  idempotencyKey: string;
}

export type SightingApiResponse =
  | {
    status: 'accepted',
    message: string,
  }
  | {
    status: 'rejected',
    message: string,
  }

export type SightingSubmissionError =
    | 'configuration'
    | 'validation'
    | 'preparation'
    | 'network'
    | 'timeout'
    | 'server'
    | 'invalid-response'
    | 'idempotency-conflict';


// Resultado que utilizará el hook de envío y las pantallas
export type SightingSubmissionResult =
    | {
        status: 'accepted';
        message: string;
    }
    | {
        status: 'rejected';
        message: string;
    }
    | {
        status: 'error';
        reason: SightingSubmissionError;
        message: string;
    };