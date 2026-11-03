import { SightingDraft, SightingValidationResult } from "@/types/sighting";

export function validateSightingDraft(
    draft: SightingDraft | null
): SightingValidationResult {
    if( draft === null ){
        return{
            ok: false,
            message: 'No hay un avistamiento en preparación.'
        };
    }

    if(!draft.photo?.uri?.trim()){
        return{
            ok: false,
            message: 'Debes capturar una fotografía.'
        };
    }

    if(draft.photoAccepted !== true){
        return{
            ok: false,
            message: 'Debes aceptar la fotografía antes de enviar.'
        }
    }

    const {latitude, longitude, accuracy} = draft.location.coords;

    const validCoordinates = 
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;

    if(!validCoordinates){
        return{
            ok: false,
            message: 'La ubicación del avistamiento no es válida.'
        };
    }

    if(accuracy !== null && (!Number.isFinite(accuracy) || accuracy < 0)){
        return{
            ok: false,
            message: 'La precisión recibida de la ubicación no es válida.'
        };
    }

    const sightingType = draft.sightingType;

    if(sightingType !== 'adult' && sightingType !== 'nest'){
        return{
            ok: false,
            message: 'Selecciona Individuo o Nido'
        }
    }

    const locationTime = new Date(draft.location.timestamp).getTime();
    const cameraReturnTime = Date.parse(draft.captureReturnedAt);

    if(!Number.isFinite(locationTime) || !Number.isFinite(cameraReturnTime)){
        return{
            ok: false,
            message: 'Las referencias temporales del borrador no son válidas.'
        };
    }

    return{
        ok: true,
        draft: {
            ...draft,
            photoAccepted: true,
            sightingType,
        },
    };
};