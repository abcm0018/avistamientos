import type { LocationResult } from '@/types/location';
import * as Location from 'expo-location';

const MAX_PHOTO_LOCATION_AGE_MS = 15 * 60 * 1000;
const MAX_PHOTO_LOCATION_ACCURACY_METERS = 100;

export function isValidPhotoLocation(
    location: Location.LocationObject,
    now = Date.now()
): boolean {
    const { latitude, longitude, accuracy } = location.coords;
    const age = now - location.timestamp;

    return (
        Number.isFinite(latitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        Number.isFinite(longitude) &&
        longitude >= -180 &&
        longitude <= 180 &&
        Number.isFinite(age) &&
        age >= 0 &&
        age <= MAX_PHOTO_LOCATION_AGE_MS &&
        accuracy !== null &&
        Number.isFinite(accuracy) &&
        accuracy >= 0 &&
        accuracy <= MAX_PHOTO_LOCATION_ACCURACY_METERS
    );
}

export async function obtainLocation(
    {
        requestPermission = true,
        forPhoto = false,
    }: {
        requestPermission?: boolean;
        forPhoto?: boolean;
    } = {}
): Promise<LocationResult> {
    try{
        const servicesEnabled = await Location.hasServicesEnabledAsync();

        if(!servicesEnabled){
            return{
                ok: false,
                reason: 'services-disabled',
            };            
        }

        let permission = await Location.getForegroundPermissionsAsync();

        console.log('Estado inicial del permiso:', {
            status: permission.status,
            granted: permission.granted,
            canAskAgain: permission.canAskAgain,
        });

        if(requestPermission && !permission.granted && permission.canAskAgain){
            permission = await Location.requestForegroundPermissionsAsync();
        }

        if(!permission.granted){
            return{
                ok: false,
                reason: 'permission-denied',
                canAskAgain: permission.canAskAgain,
            };
        }

        const location = await Location.getCurrentPositionAsync(
            forPhoto
                ?{
                    accuracy:Location.Accuracy.High,
                    mayShowUserSettingsDialog: false,
                } : undefined
        );

        const { latitude, longitude } = location.coords;

        const validCoordinates =
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180;
        
        if(!validCoordinates || (forPhoto && !isValidPhotoLocation(location))){
            return{
                ok:false,
                reason:'invalid-coordinates',
            };
        }

        return{
            ok: true,
            location,
        };
    } catch{
        return{
            ok: false,
            reason: 'unavailable',
        }
    }
}