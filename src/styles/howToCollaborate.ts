import { ColorsApp } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  intro: { backgroundColor: ColorsApp.primaryLight, gap: 16 },
  participationIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: ColorsApp.white, alignItems: 'center', justifyContent: 'center' },
  copy: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 6 },
  guideHeading: { paddingHorizontal: 8, paddingTop: 8, gap: 4 },
  stepMarkers: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  verticalMarkers: { flexDirection: 'column', width: 44 },
  numberCircle: { minWidth: 44, minHeight: 44, padding: 6, borderRadius: 24, backgroundColor: ColorsApp.primary, alignItems: 'center', justifyContent: 'center' },
  number: { color: ColorsApp.white, fontSize: 22, fontWeight: '700' },
  warning: { backgroundColor: '#FFF3D6', borderColor: '#FFF3D6' },
  information: { backgroundColor: ColorsApp.infoBackground, borderColor: ColorsApp.infoBackground },
  reportButton: { minHeight: 56 },
});
