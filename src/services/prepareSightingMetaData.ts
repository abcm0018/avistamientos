import { ValidatedSightingDraft } from "@/types/sighting";
import { SightingMetaData } from "@/types/sightingApi";

export function prepareSightingMetadata(
    draft: ValidatedSightingDraft
): SightingMetaData {
    const {latitude, longitude, accuracy} = draft.location.coords;

    const metadata: SightingMetaData = {
        latitude,
        longitude,
        locatedAt: new Date(draft.location.timestamp).toISOString(),
        captureReturnedAt: draft.captureReturnedAt,
        sightingType: draft.sightingType,
    };

    if(accuracy !== null){
        metadata.accuracy = accuracy;
    }

    const observations = draft.observations?.trim();

    if(observations){
        metadata.observations = observations;
    }
    
    return metadata;
}