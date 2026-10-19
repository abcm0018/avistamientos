import { obtainLocation } from '@/services/location';
import { LocationResult } from '@/types/location';
import { useRef, useState } from 'react';

export function useLocationRequest(){
    const [ isLoading, setIsLoading ] = useState(false);
    const requestInProgress = useRef(false);

    async function requestLocation(): Promise<LocationResult | null> {
        if(requestInProgress.current){
            return null;
        }

    requestInProgress.current = true;
    setIsLoading(true);

    try {
      return await obtainLocation();
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }

  return { isLoading, requestLocation };
}
