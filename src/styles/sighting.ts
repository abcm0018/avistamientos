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
        marginBottom: 36,
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
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: ColorsApp.text,
        textAlign: 'center',
    },
    label: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorsApp.text,
    marginBottom: 16,
    },
    typeOptions: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 36,
    },
    typeCard: {
        flex: 1,
        minHeight: 120,
        padding: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
        borderRadius: 16,
        gap:12,
        backgroundColor: ColorsApp.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeCardSelected: {
        borderColor: ColorsApp.primary,
        backgroundColor: ColorsApp.primaryLight,
    },
    typeCardText: {
        lineHeight: 24,
        fontSize: 17,
        color: ColorsApp.text,
        textAlign: 'center',
    },
    typeIcon: {
        width: 48,
        height: 48,
    },
    observationsInput: {
        minHeight: 120,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        fontSize: 16,
        lineHeight: 24,
        color: ColorsApp.text,
        backgroundColor: ColorsApp.white,
    },
    notice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 32,
        padding: 16,
        borderRadius: 14,
        backgroundColor: ColorsApp.infoBackground,
    },
    noticeText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 21,
        color: ColorsApp.text,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 32,
    },
    submitButton: {
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
    submitButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: ColorsApp.white,
    },
    disabledButton: {
        opacity: 0.5,
    },
});