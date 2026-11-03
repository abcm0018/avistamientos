import { AppNotice } from '@/components/AppNotice';
import { ColorsApp } from '@/constants/theme';
import { useSighting } from '@/hooks/useSighting';
import { useSubmitSighting } from '@/hooks/useSubmitSighting';
import { ROUTES } from '@/navigation/routes';
import { styles } from '@/styles/sighting';
import type { SightingType } from '@/types/sighting';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SightingScreen = () => {
    const {
        draft,
        saveDraft,
        submissionConfirmed,
        submissionResult,
        saveSubmissionResult,
    } = useSighting();

    const { isSubmitting, handleSubmit } = useSubmitSighting();

    const [notice, setNotice] = useState<{
        title: string;
        message: string;
    } | null>(null);

    const isLocked = isSubmitting || submissionConfirmed || submissionResult !== null;

    const canSubmit =
        !isLocked &&
        draft?.photoAccepted === true &&
        (
            draft.sightingType === 'adult' ||
            draft.sightingType === 'nest'
        );
    // Bloquea el retroceso mientras se procesa el envío.
    usePreventRemove(isSubmitting, () => {});

    useEffect(() => {
        if (submissionResult && !isSubmitting) {
            router.replace(ROUTES.submissionResult);
        }
    }, [submissionResult, isSubmitting]);

    function handleTypeChange(sightingType: SightingType) {
        if (draft === null || isLocked) {
            return;
        }

        saveDraft({
            ...draft,
            sightingType,
        });
    }

    function handleObservationsChange(observations: string) {
        if (draft === null || isLocked) {
            return;
        }

        saveDraft({
            ...draft,
            observations,
        });
    }

    function handleBack() {
        if (isLocked) {
            return;
        }

        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(ROUTES.home);
        }
    }

    async function handleSendPress() {
        if (!canSubmit) {
            return;
        }

        setNotice(null);

        const result = await handleSubmit();

        if (result === null) {
            return;
        }

        const shouldStayOnForm = 
            result.status === 'error' &&
            (
                result.reason === 'validation' ||
                result.reason === 'preparation' ||
                result.reason === 'configuration' 
            );

            if (shouldStayOnForm) {
                setNotice({
                    title: 'No se pudo completar el envío',
                    message: result.message,
                });
                return;
            }

            saveSubmissionResult(result);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Pressable
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        accessibilityState={{ disabled: isLocked }}
                        disabled={isLocked}
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
                        Datos del avistamiento
                    </Text>
                </View>

                {draft === null && (
                    <Text style={styles.message}>
                        {submissionConfirmed
                            ? 'Recepción confirmada. Abriendo la confirmación…'
                            : 'No hay un avistamiento en preparación. Vuelve al inicio para comenzar.'}
                    </Text>
                )}

                {draft !== null && (
                    <>
                        <Text style={styles.label}>
                            Tipo de avistamiento
                        </Text>

                        <View style={styles.typeOptions}>
                            <Pressable
                                style={[
                                    styles.typeCard,
                                    draft.sightingType === 'adult' &&
                                        styles.typeCardSelected,
                                ]}
                                accessibilityRole="radio"
                                accessibilityLabel="Individuo adulto"
                                accessibilityState={{
                                    checked: draft.sightingType === 'adult',
                                    disabled: isLocked,
                                }}
                                disabled={isLocked}
                                onPress={() => handleTypeChange('adult')}
                            >
                                <Image
                                    source={require('../../assets/images/avispa-icono.png')}
                                    style={styles.typeIcon}
                                    contentFit="contain"
                                    tintColor={ColorsApp.primary}
                                    accessible={false}
                                />

                                <Text style={styles.typeCardText}>
                                    Individuo
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.typeCard,
                                    draft.sightingType === 'nest' &&
                                        styles.typeCardSelected,
                                ]}
                                accessibilityRole="radio"
                                accessibilityLabel="Nido"
                                accessibilityState={{
                                    checked: draft.sightingType === 'nest',
                                    disabled: isLocked,
                                }}
                                disabled={isLocked}
                                onPress={() => handleTypeChange('nest')}
                            >
                                <Image
                                    source={require('../../assets/images/nido-icono.png')}
                                    style={styles.typeIcon}
                                    contentFit="contain"
                                    tintColor={ColorsApp.primary}
                                    accessible={false}
                                />

                                <Text style={styles.typeCardText}>
                                    Nido
                                </Text>
                            </Pressable>
                        </View>

                        <Text style={styles.label}>
                            Observaciones (opcional)
                        </Text>

                        <TextInput
                            style={styles.observationsInput}
                            value={draft.observations ?? ''}
                            onChangeText={handleObservationsChange}
                            placeholder="Añade cualquier detalle que pueda ser de ayuda..."
                            placeholderTextColor="#757575"
                            accessibilityLabel="Observaciones opcionales"
                            editable={!isLocked}
                            multiline
                            textAlignVertical="top"
                            underlineColorAndroid="transparent"
                        />

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
                                Al enviar el avistamiento, se incluirán
                                automáticamente la fotografía, la ubicación
                                y la fecha.
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <Pressable
                                style={[
                                    styles.submitButton,
                                    !canSubmit && styles.disabledButton
                                    && { backgroundColor: '#757575' },
                                ]}
                                accessibilityRole="button"
                                accessibilityState={{
                                    disabled: !canSubmit,
                                    busy: isSubmitting,
                                }}
                                disabled={!canSubmit}
                                onPress={handleSendPress}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator
                                        color={ColorsApp.white}
                                    />
                                ) : (
                                    <SymbolView
                                        name={{
                                            ios: 'paperplane',
                                            android: 'send',
                                            web: 'send',
                                        }}
                                        size={24}
                                        tintColor={ColorsApp.white}
                                        accessible={false}
                                    />
                                )}

                                <Text style={styles.submitButtonText}>
                                    {isSubmitting
                                        ? 'Enviando…'
                                        : 'Enviar avistamiento'}
                                </Text>
                            </Pressable>
                        </View>
                    </>
                )}
            </ScrollView>

            <AppNotice
                visible={notice !== null}
                title={notice?.title ?? ''}
                message={notice?.message ?? ''}
                variant="error"
                onClose={() => setNotice(null)}
            />
        </SafeAreaView>
    );
};