import { ColorsApp } from '@/constants/theme';
import { styles } from '@/styles/init';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
 

import { ImageBackground, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InitScreen() {
    return (
        <ImageBackground 
             source={require('../../assets/images/avispa.png')}
             style={styles.container}
             resizeMode="contain">
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.overlay}>
                            <View style={styles.header}>
                                <View style={styles.logoPlaceholder}>
                                <Image
                                    source={require('../../assets/images/avispa.svg')}
                                    style={styles.logoImage}
                                    contentFit="contain"
                                    tintColor={ColorsApp.primary}
                                    accessible={false}
                                />
                                </View>
                                <Text style={styles.title}>Avispa Oriental</Text>
                                <Text style={styles.subtitle}>{'Ayuda a proteger \nnuestro entorno'}</Text>
                            </View>
                            <View style={styles.actions}>
                                <Pressable style={styles.primaryButton} accessibilityRole="button">
                                    <SymbolView
                                        name={{
                                            ios: 'camera.fill',
                                            android: 'photo_camera',
                                            web: 'photo_camera',
                                        }}
                                        size={24}
                                        tintColor={ColorsApp.white}
                                        accessible={false}
                                    />
                                    <Text style={styles.primaryButtonText}>Comunicar avistamiento</Text>
                                    <SymbolView
                                        name={{
                                            ios: 'chevron.right',
                                            android: 'chevron_right',
                                            web: 'chevron_right',
                                        }}
                                        size={20}
                                        tintColor={ColorsApp.white}
                                        accessible={false}
                                    />
                                </Pressable>
                                <Pressable style={styles.secondaryButton} accessibilityRole="button">
                                    <View style={styles.actionIconCircle}>
                                        <Image
                                            source={require('../../assets/images/avispa.svg')}
                                            style={styles.actionIconImage}
                                            contentFit="contain"
                                            tintColor={ColorsApp.white}
                                            accessible={false}
                                        />
                                    </View>
                                    <Text style={styles.secondaryButtonText}>¿Qué es?</Text>
                                </Pressable>
                                <Pressable style={styles.secondaryButton} accessibilityRole="button">
                                    <View style={styles.actionIconCircle}>
                                        <SymbolView
                                            name={{
                                                ios: 'person.2.fill',
                                                android: 'groups',
                                                web: 'groups',
                                            }}
                                            size={20}
                                            tintColor={ColorsApp.white}
                                            accessible={false}
                                        />
                                    </View>
                                    <Text style={styles.secondaryButtonText}>Cómo colaborar</Text>
                                </Pressable>
                                <Pressable style={styles.secondaryButton} accessibilityRole="button">
                                    <View style={styles.actionIconCircle}>
                                        <SymbolView
                                            name={{
                                                ios: 'info.circle.fill',
                                                android: 'info',
                                                web: 'info',
                                            }}
                                            size={20}
                                            tintColor={ColorsApp.white}
                                            accessible={false}
                                        />
                                    </View>
                                    <Text style={styles.secondaryButtonText}>Sobre el proyecto</Text>
                                </Pressable>
                            </View>
                    </View>
                </SafeAreaView>
        </ImageBackground>
    );
}
       