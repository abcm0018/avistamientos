import { ColorsApp } from '@/constants/theme';
import { styles } from '@/styles/aboutProject';
import { styles as shared } from '@/styles/aboutSpecies';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ExternalLink } from './external-link';

type AcademicLinkProps = {
  name: string;
  href: ComponentProps<typeof ExternalLink>['href'];
};

export function AcademicLink({ name, href }: AcademicLinkProps) {
  return (
    <ExternalLink href={href} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={name}
        accessibilityHint="Abre la página institucional en el navegador"
      >
        {({ pressed }) => (
          <View
            style={[
              styles.academicLink,
              pressed && shared.pressed,
            ]}
          >
            <Text style={[styles.academicValue, styles.academicLinkText]}>
              {name}
            </Text>
            <SymbolView
              name={{
                ios: 'arrow.up.right.square',
                android: 'open_in_new',
                web: 'open_in_new',
              }}
              size={14}
              tintColor={ColorsApp.text}
              style={styles.academicLinkIcon}
              accessible={false}
            />
          </View>
        )}
      </Pressable>
    </ExternalLink>
  );
}