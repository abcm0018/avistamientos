import { SightingContext } from "@/context/SightingContext";
import { useContext } from "react";

export function useSighting(){
    const context = useContext(SightingContext);

    if (context === undefined) {
        throw new Error(
            'useSighting debe utilizarse dentro de SightingProvider.'
        );
    }
    
    return context;
}