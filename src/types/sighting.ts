import type { ImagePickerAsset } from "expo-image-picker";
import type { LocationObject } from "expo-location";

export type SightingType = 'adult' | 'nest';

export type SightingDraft = {
    location: LocationObject;
    photo: ImagePickerAsset;
    captureReturnedAt: string,
    photoAccepted: boolean,
    sightingType?: SightingType;
    observations?: string;
}

export type SightingContextValue = {
    draft: SightingDraft | null;
    saveDraft: (draft: SightingDraft) => void;
    clearDraft: () => void;
}

export type ValidatedSightingDraft = SightingDraft & {
  photoAccepted: true;
  sightingType: SightingType;
}

export type SightingValidationResult = 
  | {
      ok: true;
      draft: ValidatedSightingDraft;
    }
  | {
      ok: false;
      message: string;
    };
