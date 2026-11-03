import { ColorsApp } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: ColorsApp.white,
    },
    content: {
        flexGrow: 1,
        padding: 24,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        gap: 24,
    },
    iconCircle: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: ColorsApp.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '700',
        color: ColorsApp.text,
        textAlign: 'center',
    },
    message: {
        fontSize: 18,
        lineHeight: 26,
        color: ColorsApp.text,
        textAlign: 'center',
    },
    notice: {
        padding: 16,
        borderRadius: 14,
        backgroundColor: ColorsApp.infoBackground,
    },
    noticeText: {
        fontSize: 16,
        lineHeight: 23,
        color: ColorsApp.text,
        textAlign: 'center',
    },
    button: {
        minHeight: 56,
        padding: 16,
        borderRadius: 16,
        backgroundColor: ColorsApp.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: ColorsApp.white,
    },
});