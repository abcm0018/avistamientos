import { ColorsApp } from '@/constants/theme';
import { useSighting } from '@/hooks/useSighting';
import { ROUTES } from '@/navigation/routes';
import { styles } from '@/styles/sighting';
import { SightingType } from '@/types/sighting';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SightingScreen = () => {
    const { draft, saveDraft } = useSighting();

    function handleTypeChange(sightingType: SightingType){
        if(draft === null){
            return;
        }

        saveDraft({
            ...draft,
            sightingType,
        });
    }

    function handleObservationsChange(observations:string){
        if(draft === null){
            return;
        }

        saveDraft({
            ...draft,
            observations,
        });      
    }

    function handleBack(){
        if(router.canGoBack()){
            router.back();
        }else{
            router.replace(ROUTES.home);
        }
    }

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Pressable
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Volver"
                        onPress={handleBack}
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

                <Text style={styles.title}>Datos del avistamiento</Text>
            </View>
            {draft === null && (
                <Text style={styles.message}>
                    No hay un avistamiento en preparación.
                    Vuelve al inicio para comenzar.
                </Text>
            )}
            {draft !== null && (
                <>
                    <Text style={styles.label}>
                        Tipo de avistamiento
                    </Text>

                    <View style={styles.typeOptions}>
                        <Pressable
                            style={[
                                styles.typeCard,
                                draft.sightingType === 'adult' &&
                                    styles.typeCardSelected,
                            ]}
                            accessibilityRole="radio"
                            accessibilityState={{
                                checked: draft.sightingType === 'adult',
                            }}
                            accessibilityLabel='Individuo adulto'
                            onPress={() => handleTypeChange('adult')}
                        >
                            <Image
                                source={require('../../assets/images/avispa-icono.png')}
                                style={styles.typeIcon}
                                contentFit="contain"
                                tintColor={ColorsApp.primary}
                                accessible={false}
                            />
                            <Text style={styles.typeCardText}>
                                Individuo 
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.typeCard,
                                draft.sightingType === 'nest' &&
                                    styles.typeCardSelected,
                            ]}
                            accessibilityRole="radio"
                            accessibilityState={{
                                checked: draft.sightingType === 'nest',
                            }}
                            onPress={() => handleTypeChange('nest')}
                        >
                            <Image
                                source={require('../../assets/images/nido-icono.png')}
                                style={styles.typeIcon}
                                contentFit="contain"
                                tintColor={ColorsApp.primary}
                                accessible={false}
                            />
                            <Text style={styles.typeCardText}>
                                Nido
                            </Text>
                        </Pressable>
                    </View>

                    <Text style={styles.label}>
                        Observaciones (opcional)
                    </Text>

                    <TextInput
                        style={styles.observationsInput}
                        value={draft.observations ?? ''}
                        onChangeText={handleObservationsChange}
                        placeholder="Añade cualquier detalle que pueda ser de ayuda..."
                        placeholderTextColor="#757575"
                        accessibilityLabel="Observaciones opcionales"
                        multiline
                        textAlignVertical="top"
                        underlineColorAndroid="transparent"
                    />
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
                            Al enviar el avistamiento, se incluirán automáticamente
                            la fotografía, la ubicación y la fecha.                       
                        </Text>
                    </View>
                    <View style={styles.footer}>
                        <Pressable
                            style={[styles.submitButton, styles.disabledButton]}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: true }}
                            disabled
                        >
                            <SymbolView
                                name={{
                                    ios: 'paperplane',
                                    android: 'send',
                                    web: 'send',
                                }}
                                size={24}
                                tintColor={ColorsApp.white}
                                accessible={false}
                            />
                            <Text style={styles.submitButtonText}>
                                Enviar avistamiento
                            </Text>
                        </Pressable>                    
                    </View>
                </>
            )}
        </ScrollView>
    </SafeAreaView>
  )
}
