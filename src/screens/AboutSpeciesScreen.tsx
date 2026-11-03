import { ColorsApp } from '@/constants/theme';
import { ROUTES } from '@/navigation/routes';
import { styles } from '@/styles/aboutSpecies';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState, type ComponentProps, type PropsWithChildren } from 'react';
import { Linking, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const oriental = require('../../assets/images/species/vespa-orientalis.jpg');
const traits = [
  { title: 'Cuerpo rojizo', text: 'Presenta una coloración predominantemente rojiza', image: require('../../assets/images/species/orientalis-body.jpg'), alt: 'Detalle del tórax rojizo de Vespa orientalis' },
  { title: 'Frente amarilla', text: 'Destaca una mancha amarilla en la parte frontal de la cabeza', image: require('../../assets/images/species/orientalis-face.jpg'), alt: 'Detalle de las marcas amarillas de la cara de Vespa orientalis' },
  { title: 'Banda amarilla', text: 'Presenta una banda amarilla característica en el abdomen', image: require('../../assets/images/species/orientalis-band.jpg'), alt: 'Detalle de la banda amarilla del abdomen de Vespa orientalis' },
];
const species = [
  { name: 'Avispa oriental', scientific: 'Vespa orientalis', image: oriental, text: 'Cuerpo predominantemente rojizo, con marcas amarillas en la cara y el abdomen' },
  { name: 'Avispa asiática', scientific: 'Vespa velutina', image: require('../../assets/images/species/vespa-velutina.jpg'), text: 'Tórax mucho más oscuro y una banda anaranjada destacada hacia el extremo del abdomen' },
];
const sources = [
  { label: 'MITECO · Memoria técnica de Vespa orientalis (PDF)', url: 'https://www.miteco.gob.es/content/dam/miteco/es/biodiversidad/temas/conservacion-de-especies/MTJ-Vespa-orientalis.pdf' },
  { label: 'Junta de Andalucía · Especies exóticas invasoras', url: 'https://www.juntadeandalucia.es/medioambiente/portal/servicios/servicio-informacion-atencion-ciudadania/preguntas-frecuentes/especies-exoticas-invasoras' },
  { label: 'BOE · Orden TED/452/2025', url: 'https://www.boe.es/eli/es/o/2025/05/05/ted452' },
  { label: 'Vespa orientalis · Charles J. Sharp · Original en Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Oriental_hornet_(Vespa_orientalis).jpg' },
  { label: 'Vespa velutina · Eastolany · Original en Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Asian_Hornet.jpg' },
  { label: 'Licencia de ambas fotografías y sus recortes · CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
];

type IconName = ComponentProps<typeof SymbolView>['name'];
function Icon({ name, white = false }: { name: IconName; white?: boolean }) {
  return <SymbolView name={name} size={26} tintColor={white ? ColorsApp.white : ColorsApp.primary} accessible={false} />;
}
function Section({ title, intro, children }: PropsWithChildren<{ title: string; intro: string }>) {
  return <View style={styles.section}>
    <Text accessibilityRole="header" style={styles.heading}>{title}</Text>
    <Text style={styles.body}>{intro}</Text>
    {children}
  </View>;
}

export default function AboutSpeciesScreen() {
  const { fontScale } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [linkError, setLinkError] = useState(false);
  // Measure the safe content width, including on landscape devices with a notch.
  const traitColumns = contentWidth >= 600 * fontScale;
  const comparisonColumns = contentWidth >= 360 * fontScale;
  const compactRows = contentWidth >= 280 * fontScale;

  async function openSource(url: string) {
    setLinkError(false);
    try { await Linking.openURL(url); }
    catch { setLinkError(true); }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerSafe}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Volver al inicio"
            onPress={() => router.dismissTo(ROUTES.home)}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Icon white name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.headerTitle}>¿Qué es?</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.main}>
        <ScrollView style={styles.main} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content} onLayout={({ nativeEvent }) => setContentWidth(nativeEvent.layout.width)}>
            <View style={styles.hero}>
              <Image source={oriental} style={styles.heroImage} contentFit="contain" accessible accessibilityLabel="Fotografía de Vespa orientalis, con cuerpo rojizo y marcas amarillas" />
              <View style={styles.heroText}>
                <Text accessibilityRole="header" style={styles.heading}>Conoce la avispa oriental</Text>
                <Text style={styles.scientific}>Vespa orientalis</Text>
                <Text style={styles.body}>La avispa oriental es un avispón social que destaca por su cuerpo rojizo y sus características marcas amarillas en la cara y el abdomen.</Text>
              </View>
            </View>
            <Section title="¿Cómo reconocerla?" intro="Algunas características pueden ayudarte a identificarla">
              <View style={[styles.cards, traitColumns && styles.row]}>
                {traits.map((trait) => <View key={trait.title} style={[styles.trait, traitColumns ? styles.column : compactRows && styles.row]}>
                  <Image source={trait.image} contentFit="contain" style={styles.detailImage} accessible accessibilityLabel={trait.alt} />
                  <View style={styles.flexText}>
                    <Text style={styles.cardTitle}>{trait.title}</Text>
                    <Text style={styles.body}>{trait.text}.</Text>
                  </View>
                </View>)}
              </View>
            </Section>
            <Section title="No la confundas" intro="Puede parecerse a otras especies. Fíjate en estas diferencias principales">
              <View style={[styles.cards, comparisonColumns && styles.row]}>
                {species.map((item) => <View key={item.scientific} style={[styles.speciesCard, comparisonColumns && styles.column]}>
                  <Image source={item.image} style={styles.comparisonImage} contentFit="contain" accessible accessibilityLabel={`Fotografía de ${item.scientific}`} />
                  <View style={styles.speciesText}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.scientific}>{item.scientific}</Text>
                    <Text style={styles.body}>{item.text}.</Text>
                  </View>
                </View>)}
              </View>
              <Text style={styles.note}>Estas diferencias son orientativas y no constituyen una identificación científica definitiva.</Text>
            </Section>
            <Section title="Presencia y nidos" intro="Información básica sobre su presencia en nuestro entorno y sus nidos">
              <View style={[styles.infoCard, compactRows && styles.row]}>
                <View style={styles.iconCircle}><Icon name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} /></View>
                <View style={styles.flexText}>
                  <Text style={styles.cardTitle}>Presencia en Andalucía</Text>
                  <Text style={styles.body}>La avispa oriental está presente en Andalucía. Su seguimiento es importante por sus posibles efectos sobre la biodiversidad y la apicultura.</Text>
                </View>
              </View>
              <View style={[styles.infoCard, compactRows && styles.row]}>
                <View style={styles.iconCircle}><Icon name={{ ios: 'house', android: 'home', web: 'home' }} /></View>
                <View style={styles.flexText}>
                  <Text style={styles.cardTitle}>¿Dónde construye sus nidos?</Text>
                  <Text style={styles.body}>Puede construir sus nidos en el suelo, en huecos de paredes y en otras cavidades naturales o de edificios.</Text>
                </View>
              </View>
            </Section>
            <View style={[styles.safety, compactRows && styles.row]}>
              <View style={styles.iconCircle}><Icon name={{ ios: 'checkmark.shield.fill', android: 'verified_user', web: 'verified_user' }} /></View>
              <View style={styles.flexText}>
                <Text accessibilityRole="header" style={styles.heading}>Observa con seguridad</Text>
                <Text style={styles.body}>No te acerques ni intentes manipular o retirar un nido. Mantén una distancia segura y nunca te pongas en peligro para conseguir una fotografía.</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: creditsOpen }} onPress={() => setCreditsOpen(!creditsOpen)} style={({ pressed }) => [styles.creditsButton, pressed && styles.pressed]}>
                <Icon name={{ ios: 'doc.text', android: 'description', web: 'description' }} />
                <Text style={styles.creditsLabel}>Fuentes y créditos fotográficos</Text>
                <Icon name={creditsOpen ? { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' } : { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }} />
              </Pressable>
              {creditsOpen && <View style={styles.cards}>
                <Text style={styles.note}>Vespa orientalis fue incorporada al Catálogo Español de Especies Exóticas Invasoras mediante la Orden TED/452/2025. Las referencias normativas anteriores pueden estar desactualizadas.</Text>
                <Text style={styles.note}>Fotografías reales: Charles J. Sharp (Vespa orientalis) y Eastolany (Vespa velutina), ambas CC BY-SA 4.0. Copias reducidas a 960 píxeles; los tres detalles son recortes de la fotografía de Charles J. Sharp. Las copias y los recortes mantienen la licencia CC BY-SA 4.0. La imagen original de Sharp combina varias tomas mediante apilamiento de enfoque, según su autor.</Text>
                {sources.map((source) => <Pressable key={source.url} accessibilityRole="link" accessibilityHint="Abre una fuente externa; requiere conexión a Internet" onPress={() => void openSource(source.url)} style={({ pressed }) => [styles.sourceLink, pressed && styles.pressed]}>
                  <Text style={styles.linkText}>{source.label}</Text>
                </Pressable>)}
                {linkError && <Text accessibilityRole="alert" style={styles.body}>No se ha podido abrir el enlace. Comprueba tu conexión y vuelve a intentarlo.</Text>}
              </View>}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
