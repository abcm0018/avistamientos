import type { LocationResult } from '@/types/location';
import * as Location from 'expo-location';

export async function obtainLocation(
    { requestPermission = true }: { requestPermission?: boolean } = {}
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

        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;

        const validCoordinates =
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180;
        
        if(!validCoordinates){
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