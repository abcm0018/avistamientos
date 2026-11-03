export function getApiBaseUrl(): string{
    const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

    if(!baseUrl){
        throw new Error(
            'Falta configurar EXPO_PUBLIC_API_URL.'
        )
    }
    return baseUrl;
}