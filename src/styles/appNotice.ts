import { ColorsApp } from '@/constants/theme';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.38)',
    },
    scroll: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        padding: 24,
        borderRadius: 24,
        backgroundColor: ColorsApp.white,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    warningCircle: {
        backgroundColor: '#FFF3D6',
    },
    errorCircle: {
        backgroundColor: '#FDECEC',
    },
    title: {
        fontFamily: Platform.select({
            android: 'sans-serif',
            ios: 'System',
            default: 'sans-serif',
        }),
        fontSize: 21,
        lineHeight: 28,
        fontWeight: '700',
        color: ColorsApp.text,
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontFamily: Platform.select({
            android: 'sans-serif',
            ios: 'System',
            default: 'sans-serif',
        }),
        fontSize: 16,
        lineHeight: 24,
        color: ColorsApp.text,
        textAlign: 'center',
        marginBottom: 24,
    },
    primaryButton: {
        minHeight: 52,
        padding: 14,
        borderRadius: 14,
        backgroundColor: ColorsApp.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        fontFamily: Platform.select({
            android: 'sans-serif',
            ios: 'System',
            default: 'sans-serif',
        }),
        fontSize: 16,
        fontWeight: '600',
        color: ColorsApp.white,
        textAlign: 'center',
    },
    secondaryButton: {
        minHeight: 48,
        marginTop: 8,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontFamily: Platform.select({
            android: 'sans-serif',
            ios: 'System',
            default: 'sans-serif',
        }),
        fontSize: 16,
        color: ColorsApp.primary,
        textAlign: 'center',
    },
});