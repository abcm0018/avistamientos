import { ColorsApp } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorsApp.white,
  },
  content:{
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom:24,
  },
  backButton: {
    width: 18,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: ColorsApp.text,
    textAlign: 'center',
    marginBottom: 28,
  },
  illustration: {
    aspectRatio: 1.15,
    backgroundColor: ColorsApp.background,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: ColorsApp.text,
    textAlign: 'center',
    marginVertical: 24,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: ColorsApp.primaryLight,
  },
  noticeText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: ColorsApp.text,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  button:{
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: ColorsApp.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText:{
    fontSize: 16,
    fontWeight: '600',
    color: ColorsApp.white, 
  },
});
