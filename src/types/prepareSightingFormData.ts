export type PrepareSightingFormDataResult =
    | {
        ok: true;
        formData: FormData;
    }
    | {
        ok: false;
        message: string;
    };
