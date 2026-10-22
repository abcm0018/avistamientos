import type { LocationObject } from 'expo-location';

export type LocationProblem =
  | 'permission-denied'
  | 'services-disabled'
  | 'invalid-coordinates'
  | 'unavailable';

export type LocationResult =
  | {
      ok: true;
      location: LocationObject;
    }
  | {
      ok: false;
      reason: LocationProblem;
      canAskAgain?: boolean;
    };

