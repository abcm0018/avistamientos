import { ColorsApp } from '@/constants/theme';
import { Platform, StyleSheet } from 'react-native';

// Match the explicit sans-serif typography already used by AppNotice.
const academicFont = Platform.select({ android: 'sans-serif', ios: 'System', default: 'sans-serif' });

export const styles = StyleSheet.create({
  intro: { backgroundColor: ColorsApp.primaryLight, padding: 20, gap: 14 },
  introIcon: { backgroundColor: ColorsApp.white },
  card: { gap: 14 },
  copy: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 8 },
  academic: { backgroundColor: ColorsApp.infoBackground, gap: 10 },
  // Preserve the official PNG's proportions and built-in clear space.
  academicLogo: { maxWidth: '100%', aspectRatio: 2010 / 1608, alignSelf: 'center' },
  academicHeading: { gap: 2 },
  academicTitle: { flexShrink: 1 },
  academicSubtitle: { fontFamily: academicFont, fontSize: 14, lineHeight: 20, color: ColorsApp.text },
  academicField: { gap: 2 },
  academicLabel: { fontFamily: academicFont, fontSize: 15, lineHeight: 21, fontWeight: '700', color: ColorsApp.primary },
  academicValue: { fontFamily: academicFont, fontSize: 16, lineHeight: 22, color: ColorsApp.text },
});
