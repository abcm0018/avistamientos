import { ColorsApp } from '@/constants/theme';
import { ROUTES } from '@/navigation/routes';
import { styles } from '@/styles/aboutProject';
import { styles as shared } from '@/styles/aboutSpecies';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof SymbolView>['name'];
type ProjectSection = { title: string; text: string; icon: IconName; note?: string; academic?: boolean };

const sections: ProjectSection[] = [
  {
    title: 'Nuestro objetivo',
    text: 'Facilitar la recopilación de posibles avistamientos de insectos invasores para disponer de información que pueda resultar útil en el estudio de su presencia y distribución',
    icon: { ios: 'target', android: 'adjust', web: 'adjust' },
  },
  {
    title: 'El valor de tu colaboración',
    text: 'La participación ciudadana puede ampliar la información disponible sobre estas especies. Cada observación comunicada puede aportar datos de interés para su seguimiento, una vez revisada y verificada',
    icon: { ios: 'person.2.fill', android: 'groups', web: 'groups' },
  },
  {
    title: 'Información para la investigación',
    text: 'Las observaciones acompañadas de fotografías e información sobre su localización pueden ayudar a estudiar la distribución de estas especies y a comprender mejor su presencia en el entorno',
    icon: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  },
  {
    title: 'Tecnología e investigación',
    text: 'El proyecto contempla incorporar herramientas de inteligencia artificial para apoyar la clasificación de imágenes y mecanismos de revisión científica para verificar las identificaciones',
    note: 'Estas funcionalidades forman parte del desarrollo previsto del proyecto',
    icon: { ios: 'cpu', android: 'memory', web: 'memory' },
  },
];

export default function AboutProjectScreen() {
  const { fontScale } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);
  // Stack icons above the text on narrow screens or with enlarged system fonts.
  const rows = contentWidth >= 320 * fontScale;

  return (
    <View style={shared.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={shared.headerSafe}>
        <View style={shared.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Volver al inicio"
            onPress={() => router.dismissTo(ROUTES.home)}
            style={({ pressed }) => [shared.backButton, pressed && shared.pressed]}>
            <SymbolView name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
              size={26} tintColor={ColorsApp.white} accessible={false} />
          </Pressable>
          <Text accessibilityRole="header" style={shared.headerTitle}>Sobre el proyecto</Text>
          <View style={shared.headerSpacer} />
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={shared.main}>
        <ScrollView style={shared.main} contentContainerStyle={shared.scrollContent}>
          <View style={shared.content} onLayout={({ nativeEvent }) => setContentWidth(nativeEvent.layout.width)}>
            <View style={[shared.section, styles.intro]}>
              <View style={[shared.iconCircle, styles.introIcon]}>
                <SymbolView name={{ ios: 'leaf.fill', android: 'eco', web: 'eco' }}
                  size={28} tintColor={ColorsApp.primary} accessible={false} />
              </View>
              <Text accessibilityRole="header" style={shared.heading}>Ciencia y participación ciudadana</Text>
              <Text style={shared.body}>Una iniciativa tecnológica para facilitar el conocimiento y seguimiento de la avispa oriental y otras especies de insectos invasores mediante la colaboración ciudadana</Text>
            </View>
            {sections.map((section) => (
              <View key={section.title} style={[shared.section, styles.card, section.academic && styles.academic, rows && shared.row]}>
                <View style={shared.iconCircle}>
                  <SymbolView name={section.icon} size={28} tintColor={ColorsApp.primary} accessible={false} />
                </View>
                <View style={styles.copy}>
                  <Text accessibilityRole="header" style={shared.cardTitle}>{section.title}</Text>
                  <Text style={shared.body}>{section.text}</Text>
                  {section.note && <Text style={shared.note}>{section.note}</Text>}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
