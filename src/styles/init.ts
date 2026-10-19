import { ColorsApp } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsApp.primary,
  },

  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 32,
  },

  header: {
    alignItems: 'center',
  },

  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ColorsApp.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  logoText: {
    fontSize: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: ColorsApp.white,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    color: ColorsApp.white,
    textAlign: 'center',
    lineHeight: 24,
  },

  actions: {
    gap: 10,
    paddingTop: 18,
    paddingHorizontal: 36,
    paddingBottom: 24,
    marginHorizontal: -24,
    marginBottom: -32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  primaryButton: {
    backgroundColor: ColorsApp.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: ColorsApp.white,
  },

  primaryButtonText: {
    flex:1,
    color: ColorsApp.white,
    fontSize: 16,
    fontWeight: '600',
  },

  safeArea: {
    flex: 1,
  },

  secondaryButton: {
    backgroundColor: ColorsApp.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },

  secondaryButtonText: {
    color: ColorsApp.text,
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },

  logoImage: {
    width: 28,
    height: 28,
  },

  actionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ColorsApp.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionIconImage: {
    width: 20,
    height: 20,
  },
});