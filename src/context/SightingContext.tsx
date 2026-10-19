import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

import type {
    SightingContextValue,
    SightingDraft,
} from '@/types/sighting';

export const SightingContext =
    createContext<SightingContextValue | undefined>(undefined);

export function SightingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [draft, setDraft] = useState<SightingDraft | null>(null);

    function saveDraft(newDraft: SightingDraft) {
        setDraft(newDraft);
    }

    function clearDraft() {
        setDraft(null);
    }

    return (
        <SightingContext value={{ draft, saveDraft, clearDraft }}>
            {children}
        </SightingContext>
    );
}