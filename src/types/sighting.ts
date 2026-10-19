import type { ImagePickerAsset } from "expo-image-picker";
import type { LocationObject } from "expo-location";

export type SightingDraft = {
    location: LocationObject;
    photo: ImagePickerAsset;
}

export type SightingContextValue = {
    draft: SightingDraft | null;
    saveDraft: (draft: SightingDraft) => void;
    clearDraft: () => void;
}