import { ColorsApp } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  intro: { backgroundColor: ColorsApp.primaryLight, padding: 20, gap: 14 },
  introIcon: { backgroundColor: ColorsApp.white },
  card: { gap: 14 },
  copy: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 8 },
  academic: { backgroundColor: ColorsApp.infoBackground },
});
