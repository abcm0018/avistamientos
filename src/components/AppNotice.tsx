import { styles } from '@/styles/appNotice';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef } from 'react';
import {
    AccessibilityInfo,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppNoticeProps = {
    visible: boolean;
    title: string;
    message: string;
    variant?: 'warning' | 'error';
    onClose: () => void;
    primaryAction?: {
        label: string;
        onPress: () => void;
    };
};

export function AppNotice({
    visible,
    title,
    message,
    variant = 'warning',
    onClose,
    primaryAction,
}: AppNoticeProps) {
    const pendingAction = useRef<(() => void) | null>(null);

    const runPendingAction = useCallback(() => {
        const action = pendingAction.current;
        pendingAction.current = null;
        action?.();
    }, []);

    function handlePrimaryPress() {
        if (pendingAction.current !== null) {
            return;
        }

        if (!primaryAction) {
            onClose();
            return;
        }

        pendingAction.current = primaryAction.onPress;
        onClose();
    }

    useEffect(() => {
        if (visible || Platform.OS === 'ios') {
            return;
        }

        const frame = requestAnimationFrame(runPendingAction);

        return () => cancelAnimationFrame(frame);
    }, [visible, runPendingAction]);


    const isWarning = variant === 'warning';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            onDismiss={
                Platform.OS === 'ios'
                    ? runPendingAction
                    : undefined
            }
            onShow={() => {
                AccessibilityInfo.announceForAccessibility(
                    `${title}. ${message}`
                );
            }}
        >
            <SafeAreaView style={styles.backdrop}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                >
                    <View
                        style={styles.card}
                        accessibilityViewIsModal
                        onAccessibilityEscape={onClose}
                    >
                        <View
                            style={[
                                styles.iconCircle,
                                isWarning
                                    ? styles.warningCircle
                                    : styles.errorCircle,
                            ]}
                        >
                            <SymbolView
                                name={{
                                    ios: 'exclamationmark.triangle.fill',
                                    android: 'warning',
                                    web: 'warning',
                                }}
                                size={30}
                                tintColor={
                                    isWarning ? '#805500' : '#B3261E'
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
                            {message}
                        </Text>

                        <Pressable
                            style={styles.primaryButton}
                            accessibilityRole="button"
                            onPress={handlePrimaryPress}
                        >
                            <Text style={styles.primaryButtonText}>
                                {primaryAction?.label ?? 'Entendido'}
                            </Text>
                        </Pressable>

                        {primaryAction && (
                            <Pressable
                                style={styles.secondaryButton}
                                accessibilityRole="button"
                                accessibilityLabel="Cerrar aviso"
                                onPress={onClose}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    Ahora no
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}