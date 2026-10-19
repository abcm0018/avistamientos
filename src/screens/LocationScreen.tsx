import { router } from "expo-router";

import { ColorsApp } from "@/constants/theme";
import { styles } from "@/styles/location";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function LocationScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
            <Pressable 
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Volver al inicio"
                onPress={() => router.back()}
            >
                <SymbolView 
                    name={{
                        ios: 'chevron.left',
                        android: 'chevron_left',
                        web: 'chevron_left',
                    }}
                    size={24}
                    tintColor={ColorsApp.text}
                    accessible={false}
                />
            </Pressable>

            <Text style={styles.title}>Ubicación</Text>

            <View style={styles.illustration}>
                <SymbolView 
                    name={{
                        ios: 'mappin.circle.fill',
                        android: 'location_on',
                        web: 'location_on',
                    }}
                    size={64}
                    tintColor={ColorsApp.primary}
                    accessible={false}
                />
            </View>

            <Text style={styles.message}>
                Para poder comunicar un avistamiento, necesitamos acceder a tu ubicación.
            </Text>

            <View style={styles.notice}>
                <SymbolView 
                    name={{
                        ios: 'info.circle',
                        android: 'info',
                        web: 'info',
                    }}
                    size={24}
                    tintColor={ColorsApp.primary}
                    accessible={false}
                />
                <Text style={styles.noticeText}>
                    La ubicación se obtiene automáticamente desde tu dispositivo.
                </Text>
            </View>

            <View style={styles.footer}>
                <Pressable
                    style={styles.button}
                    accessibilityRole="button"
                    accessibilityState={{disabled: true}}
                    disabled
                >
                    <Text style={styles.buttonText}>Obtener mi ubicación</Text>
                </Pressable>

            </View>

        </ScrollView>
    </SafeAreaView>
  );
}