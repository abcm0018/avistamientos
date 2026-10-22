import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { AppNotice } from "@/components/AppNotice";
import { LOCATION_PROBLEM_MESSAGES, LOCATION_PROBLEM_TITLES } from "@/constants/location";
import { ColorsApp } from "@/constants/theme";
import { useLocationRequest } from "@/hooks/useLocationRequest";
import { useSighting } from "@/hooks/useSighting";
import { ROUTES } from "@/navigation/routes";
import { capturePhoto } from "@/services/camera";
import { openDeviceSettings } from "@/services/devicesSettings";
import { styles } from "@/styles/location";
import type { LocationResult } from "@/types/location";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, AppState, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function LocationScreen() {
    const params = useLocalSearchParams<{
        reason?: string | string[];
        canAskAgain?: string | string[];
    }>();

    const { isLoading, requestLocation } = useLocationRequest();
    const { saveDraft } = useSighting();

    const [isCameraActive, setIsCameraActive] = useState(false);
    const requestInProgress = useRef(false);

    const [isOpeningSettings, setIsOpeningSettings] = useState(false);
    const [settingsOpenFailed, setSettingsOpenFailed] = useState(false);

    const openingSettings = useRef(false);
    const waitingForSettings = useRef(false);
    const leftForSettings = useRef(false);
    const cameraInProgress = useRef(false);
    const screenFocused = useRef(false);
    const cancelForegroundWait = useRef<(() => void) | null>(null);

    type LocationFailure = Extract<LocationResult, { ok: false }>;

    const [problem, setProblem] = useState<LocationFailure | null>(() => {
        const reason = params.reason;

        if (
            reason !== 'permission-denied' &&
            reason !== 'services-disabled' &&
            reason !== 'invalid-coordinates' &&
            reason !== 'unavailable'
        ) {
            return null;
        }

        return {
            ok: false,
            reason,
            canAskAgain:
                params.canAskAgain === 'true'
                    ? true
                    : params.canAskAgain === 'false'
                        ? false
                        : undefined,
        };
    });

    const [noticeVisible, setNoticeVisible] = useState(
        () => problem !== null
    );

    const isBusy = isLoading || isCameraActive || isOpeningSettings;

    const permissionBlocked =
        problem?.reason === 'permission-denied' &&
        problem.canAskAgain === false;

    const settingsActionLabel =
    problem?.reason === 'services-disabled' &&
    Platform.OS === 'android'
        ? 'Abrir ajustes de ubicación'
        : 'Abrir ajustes de la app';

    const manualInstructions =
        problem?.reason === 'services-disabled'
            ? Platform.OS === 'ios'
                ? 'Abre Ajustes > Privacidad y seguridad > Localización y activa la localización. Después vuelve a la aplicación.'
                : 'Abre los ajustes del dispositivo, busca Ubicación y actívala. Después vuelve a la aplicación.'
            : 'Abre los ajustes de esta aplicación y permite el acceso a la ubicación mientras la utilizas. Después vuelve a la aplicación.';

    const noticeMessage = settingsOpenFailed
        ? `No hemos podido abrir los ajustes. ${manualInstructions}`
        : problem?.reason === 'services-disabled'
            ? Platform.OS === 'ios'
                ? `${manualInstructions} El botón abre los ajustes de esta aplicación; no abre directamente el interruptor general.`
                : 'La ubicación del dispositivo está desactivada. Abre los ajustes, actívala y vuelve a la aplicación.'
            : permissionBlocked
                ? 'El permiso está bloqueado. Habilita el acceso a la ubicación en los ajustes de la aplicación.'
                : problem
                    ? LOCATION_PROBLEM_MESSAGES[problem.reason]
                    : '';

    useFocusEffect(
        useCallback(()=>{
            screenFocused.current = true;

            return(()=>{
                screenFocused.current=false;
                waitingForSettings.current=false;
                leftForSettings.current=false;
                cancelForegroundWait.current?.();
            })
        }, [])
    )

    function closeNotice() {
        setNoticeVisible(false);
    }

    async function handleOpenSettings() {
        if (isBusy || openingSettings.current) {
            return;
        }

        openingSettings.current = true;

        setSettingsOpenFailed(false);
        setIsOpeningSettings(true);

        waitingForSettings.current = true;
        leftForSettings.current = false;

        try {
            const opened = await openDeviceSettings(
                problem?.reason === 'services-disabled'
                    ? 'location'
                    : 'application'
            );

            if (!opened) {
                waitingForSettings.current = false;
                leftForSettings.current = false;

                setSettingsOpenFailed(true);
                setNoticeVisible(true);
            }
        } finally {
            openingSettings.current = false;
            setIsOpeningSettings(false);
        }
    }

    const waitForForeground = useCallback(async (): Promise<boolean> => {
        if (AppState.currentState === 'active') {
            return true;
        }

        if (AppState.currentState !== 'inactive') {
            return false;
        }

        return new Promise<boolean>((resolve) => {
            let finished = false;

            function finish(canContinue: boolean) {
                if (finished) {
                    return;
                }

                finished = true;
                subscription.remove();
                cancelForegroundWait.current = null;
                resolve(canContinue);
            }

            const subscription = AppState.addEventListener(
                'change',
                (nextState) => {
                    if (nextState === 'active') {
                        finish(true);
                    } else if (nextState === 'background') {
                        finish(false);
                    }
                }
            );

            cancelForegroundWait.current = () => finish(false);

            // Comprueba si el estado cambió al registrar el listener.
            const currentState = AppState.currentState;

            if (currentState === 'active') {
                finish(true);
            } else if (currentState !== 'inactive') {
                finish(false);
            }
        });
    }, []);

    const openCameraWithLocation = useCallback(
        async (
            location: Extract<LocationResult, { ok: true }>['location']
        ) => {
            if (
                cameraInProgress.current ||
                !screenFocused.current
            ) {
                return;
            }

            cameraInProgress.current = true;
            setIsCameraActive(true);

            try {
                const canContinue = await waitForForeground();

                if(!canContinue || !screenFocused.current){
                    return;
                }

                const cameraResult = await capturePhoto();

                if (!screenFocused.current) {
                    return;
                }

                switch (cameraResult.status) {
                    case 'captured':
                        saveDraft({
                            location,
                            photo: cameraResult.photo,
                            captureReturnedAt: cameraResult.captureReturnedAt,
                            photoAccepted: false,
                        });

                        router.replace(ROUTES.photoReview);
                        break;

                    case 'cancelled':
                        router.replace(ROUTES.home);
                        break;

                    case 'permission-denied':
                        router.replace(ROUTES.home);

                        Alert.alert(
                            'Permiso de cámara necesario',
                            cameraResult.canAskAgain
                                ? 'Permite el acceso a la cámara para tomar la fotografía. Puedes volver a intentarlo desde el inicio.'
                                : 'Habilita el permiso de cámara en los ajustes de la aplicación.'
                        );
                        break;

                    case 'error':
                        router.replace(ROUTES.home);

                        Alert.alert(
                            'No se pudo completar la captura',
                            'Puedes volver a intentarlo desde el inicio.'
                        );
                        break;
                }
            } finally {
                cameraInProgress.current = false;

                if (screenFocused.current) {
                    setIsCameraActive(false);
                }
            }
        },
        [saveDraft, waitForForeground]
    );

    useEffect(() => {
        let mounted = true;

        const subscription = AppState.addEventListener(
            'change',
            (nextState) => {
                if (
                    !screenFocused.current ||
                    !waitingForSettings.current
                ) {
                    return;
                }

                if (nextState !== 'active') {
                    leftForSettings.current = true;
                    return;
                }

                if (
                    !leftForSettings.current ||
                    requestInProgress.current
                ) {
                    return;
                }

                waitingForSettings.current = false;
                leftForSettings.current = false;
                requestInProgress.current = true;

                async function checkAfterSettings() {
                    try {
                        const result = await requestLocation({
                            requestPermission: false,
                        });

                        if (
                            !mounted ||
                            !screenFocused.current ||
                            result === null
                        ) {
                            return;
                        }

                        setSettingsOpenFailed(false);

                        if (!result.ok) {
                            setProblem(result);
                            setNoticeVisible(true);
                            return;
                        }

                        setProblem(null);
                        setNoticeVisible(false);

                        await openCameraWithLocation(result.location);
                    } finally {
                        requestInProgress.current = false;
                    }
                }

                void checkAfterSettings();
            }
        );

        return () => {
            mounted = false;
            subscription.remove();
        };
    }, [requestLocation, openCameraWithLocation]);


    async function handleRetry() {
        if (
            requestInProgress.current ||
            cameraInProgress.current ||
            openingSettings.current ||
            !screenFocused.current
        ) {
            return;
        }

        requestInProgress.current = true;
        waitingForSettings.current = false;
        leftForSettings.current = false;

        setSettingsOpenFailed(false);

        try {
            const canStart = await waitForForeground();

            if (!canStart || !screenFocused.current) {
                return;
            }

            const locationResult = await requestLocation();

            if (
                locationResult === null ||
                !screenFocused.current
            ) {
                return;
            }

            if (!locationResult.ok) {
                setProblem(locationResult);
                setNoticeVisible(true);
                return;
            }

            setProblem(null);
            setNoticeVisible(false);

            await openCameraWithLocation(locationResult.location);
        } finally {
            requestInProgress.current = false;
        }
    }

    function handleLocationButton() {
        if (isBusy || requestInProgress.current) {
            return;
        }

        waitingForSettings.current = false;
        leftForSettings.current = false;

        void handleRetry();
    }

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
            <Pressable 
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Volver al inicio"
                onPress={() => router.back()}
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

            <Text style={styles.title}>Ubicación</Text>

            <View style={styles.illustration}>
                <Image
                    source={require('../../assets/images/ubicacion.png')}
                    style={styles.illustrationImage}
                    contentFit="cover"
                    accessible={false}
                />
            </View>
            <Text style={styles.message}>
                {'Para poder comunicar un avistamiento, '}
                <Text style={styles.messageEmphasis}>
                    necesitamos acceder a tu ubicación.
                </Text>
            </Text>
            <View style={styles.notice}>
                <SymbolView 
                    name={{
                        ios: 'info.circle',
                        android: 'info',
                        web: 'info',
                    }}
                    size={24}
                    tintColor={ColorsApp.primary}
                    accessible={false}
                />
                <Text style={styles.noticeText}>
                    La ubicación se obtiene automáticamente desde tu dispositivo.
                </Text>
            </View>

            <View style={styles.footer}>
                <Pressable
                    style={styles.button}
                    accessibilityRole="button"
                    accessibilityState={{disabled: isBusy, busy: isBusy}}
                    disabled={isBusy}
                    onPress={handleLocationButton}
                >
                    {isBusy ? (
                        <ActivityIndicator color={ColorsApp.white} />
                    ) : (
                        <Text style={styles.buttonText}>
                            Comprobar ubicación
                        </Text>
                    )}
                </Pressable>

            </View>
        </ScrollView>
        <AppNotice
                visible={noticeVisible && problem !== null}
                title={
                    settingsOpenFailed
                        ? 'Abre los ajustes manualmente'
                        : problem
                            ? LOCATION_PROBLEM_TITLES[problem.reason]
                            : ''
                }
                message={noticeMessage}
                variant={
                    problem?.reason === 'invalid-coordinates' ||
                    problem?.reason === 'unavailable'
                        ? 'error'
                        : 'warning'
                }
                onClose={closeNotice}
                primaryAction={
                    isBusy
                        ? undefined
                        : problem?.reason === 'services-disabled' ||
                            permissionBlocked
                            
                            ? {
                                label: settingsActionLabel,
                                onPress: () => {
                                    void handleOpenSettings();
                                },
                            }
                            : {
                                label:
                                    problem?.reason === 'permission-denied'
                                        ? 'Solicitar permiso'
                                        : 'Reintentar',
                                onPress: () => {
                                    void handleRetry();
                                },
                            }
                }
        />
    </SafeAreaView>
  );
}