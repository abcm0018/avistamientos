import { ColorsApp } from '@/constants/theme';
import { useSighting } from '@/hooks/useSighting';
import { ROUTES } from '@/navigation/routes';
import { capturePhoto } from '@/services/camera';
import { styles } from '@/styles/checkFoto';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PhotoReviewScreen = () => {
    const { draft, saveDraft, clearDraft } = useSighting();
    const [hasImageError, setHasImageError] = useState(false);
    const [isRetaking, setIsRetaking] = useState(false);
    const retakeInProgress = useRef(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const canAccept =
    draft !== null &&
    isImageLoaded &&
    !hasImageError &&
    !isRetaking;

    function handleAccept(){
        if(!canAccept || draft === null){
            return;
        }

        saveDraft({
            ...draft,
            photoAccepted: true,
        })
        router.push(ROUTES.sighting);
    }

    function handleBack(){
        if(router.canGoBack()){
            router.back();
        } else{
            router.replace(ROUTES.home);
        }
    }
    async function handleRetake(){
        if (draft === null || retakeInProgress.current){
            return;
        }

        retakeInProgress.current = true;
        setIsRetaking(true);

        try{
            const result = await capturePhoto();

            switch (result.status){
                case 'captured':
                    setIsImageLoaded(false);
                    setHasImageError(false);

                    saveDraft({
                        ...draft,
                        photo: result.photo,
                        captureReturnedAt: result.captureReturnedAt,
                        photoAccepted: false,
                    });
                    break;
                case 'cancelled':
                    break;
                case 'permission-denied':
                case 'error':
                    router.replace({
                        pathname: ROUTES.camera,
                        params:{
                            mode: 'retake',
                            reason: result.status,
                            ...(result.status === 'permission-denied'
                                ? { 
                                    canAskAgain: String(result.canAskAgain),
                                }
                                : {}),
                        },
                    });
                    break;
            };
        } finally {
            retakeInProgress.current = false;
            setIsRetaking(false);
        }
    }

    function handleDiscard() {
        Alert.alert(
            'Descartar avistamiento',
            'Se descartarán la fotografía y la ubicación de este borrador.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Descartar',
                    style: 'destructive',
                    onPress: () => {
                        clearDraft();
                        router.replace(ROUTES.home);
                    },
                },
            ]
        );
    }
  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    accessibilityRole='button'
                    accessibilityLabel='Volver'
                    onPress={handleBack}
                >
                    <SymbolView
                            name={{
                                ios: 'chevron.left',
                                android: 'chevron_left',
                                web: 'chevron_left',
                            }}
                            size={24}
                            tintColor={ColorsApp.text}
                            accessible={false}
                        />
                </Pressable>
                <Text style={styles.title}>Revisar fotografía</Text>
            </View>
            {draft === null ? (
                <Text style={styles.message}>
                    No hay una fotografía para revisar. 
                    Vuelve al inicio para comunicar un avistamiento.
                </Text>
                ):(
                    <>
                        <View style={styles.photoFrame}>
                        
                            <Image
                                source={{ uri: draft.photo.uri }}
                                key={draft.photo.uri}
                                style={styles.photo}
                                contentFit="contain"
                                accessible
                                accessibilityLabel="Fotografía capturada del avistamiento"
                                onLoad={() => {
                                    setIsImageLoaded(true);
                                    setHasImageError(false);
                                }}
                                onError={() => {
                                    setIsImageLoaded(false);
                                    setHasImageError(true);
                                }}
                            />
                            <Pressable
                                style={styles.discardButton}
                                accessibilityRole="button"
                                accessibilityLabel="Descartar avistamiento"
                                disabled={isRetaking}
                                onPress={handleDiscard}
                            >
                                <SymbolView
                                    name={{
                                        ios: 'trash',
                                        android: 'delete',
                                        web: 'delete',
                                    }}
                                    size={26}
                                    tintColor="#C62828"
                                    accessible={false}
                                />
                            </Pressable>
                        </View>
                            {hasImageError && (
                                <Text style={styles.message} accessibilityRole='alert'>
                                    No se ha podido cargar la fotografía.
                                </Text>
                            )}
                            <View style={styles.actions}>
                                <Pressable
                                    style={[
                                        styles.acceptButton,
                                        !canAccept && styles.disabledButton,
                                    ]}
                                    accessibilityRole="button"
                                    disabled={!canAccept}
                                    accessibilityState={{ disabled: !canAccept }}
                                    onPress={handleAccept}
                                >
                                    <SymbolView
                                        name={{
                                            ios: 'checkmark',
                                            android: 'check',
                                            web: 'check',
                                        }}
                                        size={26}
                                        tintColor={ColorsApp.white}
                                        accessible={false}
                                    />

                                    <Text style={styles.acceptButtonText}>
                                        Aceptar fotografía
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={styles.repeatButton}
                                    accessibilityRole="button"
                                    disabled={isRetaking}
                                    accessibilityState={{
                                        disabled: isRetaking,
                                        busy: isRetaking,
                                    }}
                                    onPress={handleRetake}
                                >
                                    {isRetaking ? (
                                        <ActivityIndicator color={ColorsApp.primary} />
                                    ) : (
                                        <SymbolView
                                            name={{
                                                ios: 'arrow.clockwise',
                                                android: 'refresh',
                                                web: 'refresh',
                                            }}
                                            size={26}
                                            tintColor={ColorsApp.text}
                                            accessible={false}
                                        />
                                    )}

                                    <Text style={styles.repeatButtonText}>
                                        {isRetaking ? 'Cámara en curso…' : 'Repetir fotografía'}
                                    </Text>
                                </Pressable>
                        </View>
                    </>
                )}
        </ScrollView>
    </SafeAreaView>
  )
}
