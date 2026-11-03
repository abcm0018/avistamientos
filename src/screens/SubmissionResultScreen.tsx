import { ColorsApp } from '@/constants/theme';
import { useSighting } from '@/hooks/useSighting';
import { ROUTES } from '@/navigation/routes';
import { styles } from '@/styles/submissionResult';
import {
    Redirect,
    router,
    Stack,
    useFocusEffect,
} from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback } from 'react';
import {
    BackHandler,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubmissionResultScreen() {
    const {
        draft,
        submissionResult,
        clearSubmissionResult,
        clearDraft,
    } = useSighting();

    const isAccepted = submissionResult?.status === 'accepted';
    const canReturnToForm = !isAccepted && draft !== null;

    const handleContinue = useCallback(() => {
        if (canReturnToForm) {
            // Conserva el borrador y activa la redirección a P05.
            clearSubmissionResult();
            return;
        }

        router.dismissTo(ROUTES.home);
        clearDraft();
    }, [canReturnToForm, clearSubmissionResult, clearDraft]);

    useFocusEffect(
        useCallback(() => {
            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    handleContinue();
                    return true;
                }
            );

            return () => subscription.remove();
        }, [handleContinue])
    );

    if (submissionResult === null) {
        return (
            <Redirect
                href={
                    draft !== null
                        ? ROUTES.sighting
                        : ROUTES.home
                }
            />
        );
    }

    const title =
        submissionResult.status === 'accepted'
            ? 'Avistamiento recibido'
            : submissionResult.status === 'rejected'
                ? 'Avistamiento no aceptado'
                : 'No se pudo confirmar el envío';

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ gestureEnabled: false }} />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.body}>
                    <View
                        style={[
                            styles.iconCircle,
                            !isAccepted && {
                                backgroundColor: '#FDECEA',
                            },
                        ]}
                    >
                        <SymbolView
                            name={
                                isAccepted
                                    ? {
                                        ios: 'checkmark.circle.fill',
                                        android: 'check_circle',
                                        web: 'check_circle',
                                    }
                                    : {
                                        ios: 'exclamationmark.triangle.fill',
                                        android: 'warning',
                                        web: 'warning',
                                    }
                            }
                            size={72}
                            tintColor={
                                isAccepted
                                    ? ColorsApp.primary
                                    : '#B3261E'
                            }
                            accessible={false}
                        />
                    </View>

                    <Text
                        style={styles.title}
                        accessibilityRole="header"
                    >
                        {title}
                    </Text>

                    <Text style={styles.message}>
                        {submissionResult.message}
                    </Text>

                    {(isAccepted || canReturnToForm) && (
                        <View style={styles.notice}>
                            <Text style={styles.noticeText}>
                                {isAccepted
                                    ? 'La recepción no implica que el avistamiento haya sido validado científicamente.'
                                    : 'Conservamos la fotografía y los datos mientras sigas en esta sesión. Puedes volver al formulario para revisarlos o intentar el envío de nuevo.'}
                            </Text>
                        </View>
                    )}
                </View>

                <Pressable
                    style={styles.button}
                    accessibilityRole="button"
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>
                        {canReturnToForm
                            ? 'Volver al formulario'
                            : 'Volver al inicio'}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}