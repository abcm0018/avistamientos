import type { LocationProblem } from "@/types/location";

export const LOCATION_PROBLEM_MESSAGES: Record<LocationProblem, string> ={
    'permission-denied' : 'No tenemos permiso para acceder a tu ubicación.',
    'services-disabled' : 'La ubicación del dispositivo está desactivada.',
    'invalid-coordinates' : 'No hemos obtenido unas coordenadas válidas.',
    unavailable: 'No hemos podido obtener tu ubicación. Puedes volver a intentarlo',
};

export const LOCATION_PROBLEM_TITLES: Record<LocationProblem, string> = {
    'permission-denied': 'Permiso de ubicación necesario',
    'services-disabled': 'Activa la ubicación',
    'invalid-coordinates': 'Ubicación no válida',
    unavailable: 'No pudimos obtener tu ubicación',
};