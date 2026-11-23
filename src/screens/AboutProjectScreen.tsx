import { AcademicLink } from '@/components/AcademicLink';

import { ColorsApp } from '@/constants/theme';
import { ROUTES } from '@/navigation/routes';
import { styles } from '@/styles/aboutProject';
import { styles as shared } from '@/styles/aboutSpecies';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof SymbolView>['name'];
type ProjectSection = { title: string; text: string; icon: IconName; note?: string };

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
    icon: { ios: 'cpu', android: 'memory', web: 'memory' },
  },
];

export default function AboutProjectScreen() {
  const { fontScale } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);
  // Stack icons above the text on narrow screens or with enlarged system fonts.
  const rows = contentWidth >= 320 * fontScale;
  // Account for the card's padding and border on both sides.
  const academicLogoWidth = Math.min(200, Math.max(0, contentWidth - 34));

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
              <View key={section.title} style={[shared.section, styles.card, rows && shared.row]}>
                <View style={shared.iconCircle}>
                  <SymbolView name={section.icon} size={28} tintColor={ColorsApp.primary} accessible={false} />
                </View>
                <View style={styles.copy}>
                  <Text accessibilityRole="header" style={shared.cardTitle}>{section.title}</Text>
                  <Text style={shared.body}>{section.text}</Text>
                </View>
              </View>
            ))}
            <View style={[shared.section, styles.academic]}>
              {/* Official horizontal positive PNG, unchanged, from the UJA brand resources:
                  https://www.ujaen.es/gobierno/viccom/marca-universidad-de-jaen
                  Archive: 1. Marca Universidad de Jaén_0.zip; horizontal / principal / positivo.
                  Logo usage conditions remain pending confirmation before public distribution. */}
              <Image
                source={require('../../assets/images/uja-logo-horizontal.png')}
                style={[styles.academicLogo, {
                  width: academicLogoWidth,
                  // Reclaim transparent PNG margins without cropping the image.
                  marginVertical: -academicLogoWidth * 0.15,
                }]}
                contentFit="contain"
                accessible
                accessibilityLabel="Universidad de Jaén"
              />
              <View style={styles.academicHeading}>
                <Text accessibilityRole="header" style={[shared.cardTitle, styles.academicTitle]}>Créditos académicos</Text>
                <Text style={styles.academicSubtitle}>Trabajo Fin de Máster</Text>
              </View>
              <View style={styles.academicField}>
                <Text style={styles.academicLabel}>Titulación</Text>
                <AcademicLink
                  name="Máster Universitario en Ingeniería de Telecomunicación"
                  href="https://www.ujaen.es/estudios/oferta-academica/en/masters-programs/masters-degree-science-telecommunication-engineering"
                />
              </View>
              <View style={styles.academicField}>
                <Text style={styles.academicLabel}>Título oficial del TFM</Text>
                <Text style={styles.academicValue}>Web Application for Citizen-Assisted Tracking and AI-Driven Identification of Invasive Insect Species.</Text>
              </View>
              <View style={styles.academicField}>
                <Text style={styles.academicLabel}>Autora</Text>
                <Text style={styles.academicValue}>Ana Belén Cabello Martínez</Text>
              </View>
              <View style={styles.academicField}>
                <Text style={styles.academicLabel}>Tutores</Text>
                <AcademicLink name= "Juan Carlos Cuevas Martínez" href="https://www.ujaen.es/departamentos/ingtel/contactos/cuevas-martinez-juan-carlos" />
                <AcademicLink name= "José Manuel Pérez Lorenzo" href="https://investigacion.ujaen.es/investigadores/191168/detalle" />
              </View>
              <View style={styles.academicField}>
                <Text style={styles.academicLabel}>Colaboración en el proyecto</Text>
                <AcademicLink
                  name="Antonio José Ortiz Hernández"
                  href="https://www.ujaen.es/investigacion-y-transferencia/contactos/antonio-jose-ortiz-hernandez-0"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
