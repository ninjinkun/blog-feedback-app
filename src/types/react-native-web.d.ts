import { TextProperties } from 'react-native'
declare module 'react-native' {
    interface TextProperties {
      accessibilityRole?: string;
      href?: string;
    }
}