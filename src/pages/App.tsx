import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import {
  DefaultTheme as NavLightTheme,
  DarkTheme as NavDarkTheme,
  type Theme as NavTheme,
} from '@react-navigation/native';

import RoutesProvider from '../routes';

type CombinedTheme = (typeof MD3LightTheme) & NavTheme;

const makeTheme = (isDark: boolean): CombinedTheme => {
  const paper = isDark ? MD3DarkTheme : MD3LightTheme;
  const nav = isDark ? NavDarkTheme : NavLightTheme;

  return {
    ...nav,
    ...paper,
    colors: {
      ...nav.colors,
      ...paper.colors,
      primary: paper.colors.primary,
      background: paper.colors.background,
      text: paper.colors.onSurface,
      card: paper.colors.elevation.level2,
      border: paper.colors.outlineVariant,
      notification: paper.colors.error,
    },
  } as CombinedTheme;
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = makeTheme(isDarkMode);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <GestureHandlerRootView style={styles.container}>
        <PaperProvider theme={theme}>
          <RoutesProvider theme={theme} />
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

export default App;
