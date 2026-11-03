import { AppNotice } from '@/components/AppNotice';
import { LOCATION_PROBLEM_MESSAGES } from '@/constants/location';
import { ColorsApp } from '@/constants/theme';
import { useSighting } from '@/hooks/useSighting';
import { ROUTES } from '@/navigation/routes';
import {
    capturePhoto,
    checkCameraPermission,
} from '@/services/camera';
import { openDeviceSettings } from '@/services/devicesSettings';
import { isValidPhotoLocation, obtainLocation } from '@/services/location';
import { styles } from '@/styles/location';
import type { CameraPermissionResult } from '@/types/camera';
import {
    router,
    Stack,
    useFocusEffect,
    useLocalSearchParams,
} from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    AppState,
    BackHandler,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraScreen() {
    const params = useLocalSearchParams<{
        reason?: string;
        canAskAgain?: string;
        mode?: string;
    }>();

    const isRetake = params.mode === 'retake';

    const {
        draft,
        pendingLocation,
        saveDraft,
        clearPendingLocation,
    } = useSighting();

    const [permission, setPermission] =
        useState<CameraPermissionResult>(() =>
            params.reason === 'permission-denied'
                ? {
                    status: 'permission-denied',
                    canAskAgain: params.canAskAgain === 'true',
                }
                : { status: 'error' }
        );

    const [isBusy, setIsBusy] = useState(false);
    const [settingsFailed, setSettingsFailed] = useState(false);
    const [locationProblem, setLocationProblem] =
    useState<string | null>(null);    
    const [noticeVisible, setNoticeVisible] = useState(true);

    const focused = useRef(false);
    const operationInProgress = useRef(false);
    const waitingForSettings = useRef(false);
    const leftForSettings = useRef(false);

    const location = isRetake
        ? draft?.location
        : pendingLocation;

    const hasLocation = location != null;

    const permissionBlocked =
        permission.status === 'permission-denied' &&
        !permission.canAskAgain;

    const leaveScreen = useCallback(() => {
        clearPendingLocation();

        router.replace(
            isRetake ? ROUTES.photoReview : ROUTES.home
        );
    }, [clearPendingLocation, isRetake]);

    const handleCapture = useCallback(async () => {
        if (
            operationInProgress.current ||
            !focused.current ||
            AppState.currentState !== 'active' ||
            !location
        ) {
            return;
        }

        operationInProgress.current = true;
        waitingForSettings.current = false;
        leftForSettings.current = false;
        setIsBusy(true);
        setLocationProblem(null);

        try {
            // Obtenemos una posición actual aunque la anterior sea reciente.
            const locationResult = await obtainLocation({
                requestPermission: false,
                forPhoto: true,
            });

            if (!focused.current) {
                return;
            }

            if (!locationResult.ok) {
                setLocationProblem(
                    locationResult.reason === 'invalid-coordinates'
                        ? 'No hemos obtenido una ubicación reciente y suficientemente precisa. Comprueba que tienes activada la ubicación precisa y vuelve a intentarlo.'
                        : LOCATION_PROBLEM_MESSAGES[locationResult.reason]
                );
                setNoticeVisible(true);
                return;
            }

            // La ubicación puede tardar: comprobamos de nuevo el estado.
            if (AppState.currentState !== 'active') {
                return;
            }

            const captureLocation = locationResult.location;
            const result = await capturePhoto();

            if (!focused.current) {
                return;
            }

            switch (result.status) {
                case 'captured':
                    // Evitamos guardar una posición que haya caducado
                    // durante una sesión de cámara prolongada.
                    if (!isValidPhotoLocation(captureLocation)) {
                        setLocationProblem(
                            'La ubicación ha caducado durante la captura. Reintenta para obtener una ubicación actual y repetir la fotografía.'
                        );
                        setNoticeVisible(true);
                        return;
                    }

                    saveDraft({
                        ...(isRetake && draft ? draft : {}),
                        location: captureLocation,
                        photo: result.photo,
                        captureReturnedAt: result.captureReturnedAt,
                        photoAccepted: false,
                    });

                    router.replace(ROUTES.photoReview);
                    break;

                case 'cancelled':
                    leaveScreen();
                    break;

                case 'permission-denied':
                case 'error':
                    setPermission(result);
                    setNoticeVisible(true);
                    break;
            }
        } finally {
            operationInProgress.current = false;

            if (focused.current) {
                setIsBusy(false);
            }
        }
    }, [location, isRetake, draft, saveDraft, leaveScreen]);

    const checkAfterSettings = useCallback(async () => {
        if (
            !focused.current ||
            operationInProgress.current ||
            !waitingForSettings.current ||
            !leftForSettings.current ||
            AppState.currentState !== 'active'
        ) {
            return;
        }

        // Consumimos este regreso antes de consultar el permiso.
        waitingForSettings.current = false;
        leftForSettings.current = false;
        operationInProgress.current = true;
        setIsBusy(true);

        let shouldCapture = false;

        try {
            const result = await checkCameraPermission();

            if (!focused.current) {
                return;
            }

            setPermission(result);
            setSettingsFailed(false);

            if (result.status === 'granted') {
                shouldCapture = true;
            } else {
                setNoticeVisible(true);
            }
        } finally {
            operationInProgress.current = false;

            if (focused.current) {
                setIsBusy(false);
            }
        }

        if (shouldCapture && focused.current) {
            await handleCapture();
        }
    }, [handleCapture]);

    useFocusEffect(
        useCallback(() => {
            focused.current = true;

            const appStateSubscription =
                AppState.addEventListener(
                    'change',
                    (nextState) => {
                        if (!waitingForSettings.current) {
                            return;
                        }

                        if (nextState !== 'active') {
                            leftForSettings.current = true;
                            return;
                        }

                        void checkAfterSettings();
                    }
                );

            const backSubscription =
                BackHandler.addEventListener(
                    'hardwareBackPress',
                    () => {
                        if (!operationInProgress.current) {
                            leaveScreen();
                        }

                        return true;
                    }
                );

            return () => {
                focused.current = false;
                waitingForSettings.current = false;
                leftForSettings.current = false;
                appStateSubscription.remove();
                backSubscription.remove();
            };
        }, [checkAfterSettings, leaveScreen])
    );

    function handleBack() {
        if (!operationInProgress.current) {
            leaveScreen();
        }
    }
    
    async function handleOpenSettings() {
        if (operationInProgress.current || !focused.current) {
            return;
        }

        operationInProgress.current = true;
        waitingForSettings.current = true;
        leftForSettings.current = false;

        setIsBusy(true);
        setSettingsFailed(false);

        try {
            const opened =
                await openDeviceSettings('application');

            if (!opened) {
                waitingForSettings.current = false;
                leftForSettings.current = false;

                if (focused.current) {
                    setSettingsFailed(true);
                    setNoticeVisible(true);
                }
            }
        } finally {
            operationInProgress.current = false;

            if (focused.current) {
                setIsBusy(false);
                void checkAfterSettings();
            }
        }
    }

    function handlePrimaryPress() {
        if (operationInProgress.current) {
            return;
        }

        if (!hasLocation) {
            handleBack();
        } else if (locationProblem) {
            void handleCapture();
        } else if (permissionBlocked) {
            setSettingsFailed(false);
            setNoticeVisible(true);
        } else {
            void handleCapture();
        }
    }

    function handleNoticeAction(){
        if(hasLocation && !locationProblem && permissionBlocked){
            void handleOpenSettings();
            return;
        }
        handlePrimaryPress();
    }

    const actionLabel = !hasLocation
        ? 'Volver'
        : locationProblem
            ? 'Reintentar'
            : permissionBlocked
                ? 'Abrir ajustes de la app'
                : permission.status === 'permission-denied'
                    ? 'Solicitar permiso'
                    : permission.status === 'granted'
                        ? 'Abrir cámara'
                        : 'Reintentar';

    const message = !hasLocation
        ? 'No hay una ubicación disponible para continuar este intento.'
        : locationProblem
            ? locationProblem
            : permissionBlocked
                ? 'Permite el acceso a la cámara en los ajustes de esta aplicación y vuelve aquí para continuar.'
                : permission.status === 'permission-denied'
                    ? 'Necesitamos tu permiso para abrir la cámara.'
                    : permission.status === 'granted'
                        ? 'El acceso a la cámara está permitido. Ya puedes continuar.'
                        : 'No hemos podido abrir o utilizar la cámara. Puedes volver a intentarlo.';

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen
                options={{ gestureEnabled: false }}
            />

            <ScrollView
                contentContainerStyle={styles.content}
            >
                <Pressable
                    style={[
                        styles.backButton,
                        { width: 48 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                        isRetake
                            ? 'Volver a la fotografía'
                            : 'Volver al inicio'
                    }
                    accessibilityState={{ disabled: isBusy }}
                    disabled={isBusy}
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

                <Text
                    style={styles.title}
                    accessibilityRole="header"
                >
                    Cámara
                </Text>

                <View style={styles.illustration}>
                    <SymbolView
                        name={{
                            ios: 'camera.fill',
                            android: 'photo_camera',
                            web: 'photo_camera',
                        }}
                        size={112}
                        tintColor={ColorsApp.primary}
                        accessible={false}
                    />
                </View>

                <Text style={styles.message}>
                    {'Para comunicar un avistamiento, '}
                    <Text style={styles.messageEmphasis}>
                        necesitamos acceder a tu cámara
                    </Text>
                    {' y tomar una fotografía.'}
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
                        <Text style={styles.noticeText}>
    Conservaremos temporalmente la ubicación mientras habilitas el acceso a la cámara
                        </Text>
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Pressable
                        style={styles.button}
                        accessibilityRole="button"
                        accessibilityLabel={actionLabel}
                        accessibilityState={{
                            disabled: isBusy,
                            busy: isBusy,
                        }}
                        disabled={isBusy}
                        onPress={handlePrimaryPress}
                    >
                        {isBusy ? (
                            <ActivityIndicator
                                color={ColorsApp.white}
                            />
                        ) : (
                            <Text style={styles.buttonText}>
                                {actionLabel}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>

            <AppNotice
                visible={noticeVisible}
                title={
                    settingsFailed
                        ? 'No se pudieron abrir los ajustes'
                        : !hasLocation
                            ? 'No podemos continuar'
                            : locationProblem
                                ? 'No se pudo obtener una ubicación válida'
                                : permission.status === 'permission-denied'
                                    ? 'Permiso de cámara necesario'
                                    : 'No se pudo completar la captura'
                }
                message={
                    settingsFailed
                        ? 'Abre los ajustes del dispositivo, busca esta aplicación y permite el acceso a la cámara. Después vuelve a intentarlo.'
                        : message
                }
                onClose={() => setNoticeVisible(false)}
                primaryAction={
                    settingsFailed
                        ? undefined
                        : {
                            label: actionLabel,
                            onPress: handleNoticeAction,
                        }
                }
            />
        </SafeAreaView>
    );
}