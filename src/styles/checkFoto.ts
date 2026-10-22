import { StyleSheet } from 'react-native';

import { ColorsApp } from '@/constants/theme';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: ColorsApp.white,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
        marginBottom: 32,
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        marginRight: 48,
        fontSize: 20,
        fontWeight: '700',
        color: ColorsApp.text,
        textAlign: 'center',
    },
    photoFrame: {
        width: '100%',
        aspectRatio: 0.85,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: ColorsApp.background,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        lineHeight: 24,
        color: ColorsApp.text,
        textAlign: 'center',
    },
    discardButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 52,
        height: 52,
        borderTopLeftRadius: 14,
        backgroundColor: ColorsApp.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        marginTop: 32,
        gap: 12,
    },
    repeatButton: {
        minHeight: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        borderColor: ColorsApp.primary,
        borderRadius: 18,
        backgroundColor: ColorsApp.white,
    },
    repeatButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: ColorsApp.text,
    },
    acceptButton: {
        minHeight: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 18,
        backgroundColor: ColorsApp.primary,
    },
    acceptButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: ColorsApp.white,
    },
    disabledButton: {
        opacity: 0.5,
    },
});