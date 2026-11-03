import { ColorsApp } from '@/constants/theme';
import { ROUTES } from '@/navigation/routes';
import { styles as shared } from '@/styles/aboutSpecies';
import { styles } from '@/styles/howToCollaborate';
import { styles as home } from '@/styles/init';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState, type ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof SymbolView>['name'];
const steps: { title: string; text: string; icon: IconName }[] = [
  { title: 'Detecta un posible avistamiento', text: 'Observa un posible individuo adulto o un nido, siempre desde una posición segura', icon: { ios: 'binoculars.fill', android: 'visibility', web: 'visibility' } },
  { title: 'Inicia la comunicación', text: 'Pulsa el botón “Comunicar avistamiento” para comenzar', icon: { ios: 'iphone', android: 'smartphone', web: 'smartphone' } },
  { title: 'Permite obtener tu ubicación', text: 'Cuando la aplicación lo solicite, permite acceder a la ubicación del dispositivo', icon: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' } },
  { title: 'Realiza una fotografía', text: 'Fotografía el insecto o el nido sin acercarte peligrosamente', icon: { ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' } },
  { title: 'Revisa la imagen', text: 'Comprueba que la fotografía se ve correctamente y acéptala', icon: { ios: 'checkmark.rectangle', android: 'fact_check', web: 'fact_check' } },
  { title: 'Selecciona el tipo', text: 'Indica si has observado un individuo adulto o un nido', icon: { ios: 'list.bullet', android: 'format_list_bulleted', web: 'format_list_bulleted' } },
  { title: 'Añade observaciones (opcional)', text: 'Si lo deseas, puedes añadir información que consideres útil', icon: { ios: 'square.and.pencil', android: 'edit_note', web: 'edit_note' } },
  { title: 'Envía la información', text: 'Pulsa el botón de envío para completar la comunicación del posible avistamiento', icon: { ios: 'paperplane.fill', android: 'send', web: 'send' } },
];

function Icon({ name, color = ColorsApp.primary }: { name: IconName; color?: string }) {
  return <SymbolView name={name} size={26} tintColor={color} accessible={false} />;
}

type Props = { onReportPress: () => void; isBusy?: boolean; reportLabel?: string };

export default function HowToCollaborateScreen({ onReportPress, isBusy = false, reportLabel = 'Comunicar avistamiento' }: Props) {
  const { fontScale } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);
  const rows = contentWidth >= 320 * fontScale;

  return (
    <View style={shared.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={shared.headerSafe}>
        <View style={shared.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Volver al inicio"
            disabled={isBusy} accessibilityState={{ disabled: isBusy }}
            onPress={() => router.dismissTo(ROUTES.home)}
            style={({ pressed }) => [shared.backButton, pressed && shared.pressed]}>
            <Icon color={ColorsApp.white} name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }} />
          </Pressable>
          <Text accessibilityRole="header" style={shared.headerTitle}>Cómo colaborar</Text>
          <View style={shared.headerSpacer} />
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={shared.main}>
        <ScrollView style={shared.main} contentContainerStyle={shared.scrollContent}>
          <View style={shared.content} onLayout={({ nativeEvent }) => setContentWidth(nativeEvent.layout.width)}>
            <View style={[shared.section, styles.intro, rows && shared.row]}>
              <View style={styles.participationIcon}>
                <Icon name={{ ios: 'person.2.fill', android: 'groups', web: 'groups' }} />
              </View>
              <View style={styles.copy}>
                <Text accessibilityRole="header" style={shared.heading}>Tu colaboración es importante</Text>
                <Text style={shared.body}>Puedes comunicar un posible avistamiento sin necesidad de crear una cuenta</Text>
              </View>
            </View>
            <View style={styles.guideHeading}>
              <Text accessibilityRole="header" style={shared.heading}>Sigue estos pasos</Text>
              <Text style={shared.body}>Comunicar un avistamiento es muy sencillo</Text>
            </View>
            {steps.map((step, index) => (
              <View key={step.title} style={[shared.section, rows && shared.row]}>
                <View style={[styles.stepMarkers, rows && styles.verticalMarkers]}>
                  <View style={styles.numberCircle}>
                    <Text accessibilityLabel={`Paso ${index + 1} de 8`} style={styles.number}>{index + 1}</Text>
                  </View>
                </View>
                <View style={styles.copy}>
                  <Text accessibilityRole="header" style={shared.cardTitle}>{step.title}</Text>
                  <Text style={shared.body}>{step.text}</Text>
                </View>
              </View>
            ))}
            <View style={[shared.section, styles.warning, rows && shared.row]}>
              <Icon color="#805500" name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }} />
              <View style={styles.copy}>
                <Text accessibilityRole="header" style={shared.cardTitle}>Tu seguridad es lo primero</Text>
                <Text style={shared.body}>No te acerques ni manipules nidos. Mantén siempre una distancia segura y nunca te pongas en peligro para conseguir una fotografía</Text>
              </View>
            </View>
            <View style={[shared.section, styles.information, rows && shared.row]}>
              <Icon name={{ ios: 'info.circle.fill', android: 'info', web: 'info' }} />
              <View style={styles.copy}>
                <Text accessibilityRole="header" style={shared.cardTitle}>Información importante</Text>
                <Text style={shared.body}>Comunicar un avistamiento no significa que la especie haya sido identificada científicamente. La información proporcionada deberá verificarse antes de considerarse una identificación confirmada</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={reportLabel}
              accessibilityState={{ disabled: isBusy, busy: isBusy }} disabled={isBusy}
              onPress={onReportPress}
              style={({ pressed }) => [home.primaryButton, styles.reportButton, (pressed || isBusy) && shared.pressed]}>
              {isBusy ? <ActivityIndicator color={ColorsApp.white} /> : <Icon color={ColorsApp.white} name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }} />}
              <Text style={home.primaryButtonText}>{reportLabel}</Text>
              <Icon color={ColorsApp.white} name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
