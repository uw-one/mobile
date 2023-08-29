import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { HomeNavigator } from "@/navigators";
import { darkThemes } from "@/themes";
import { toNavigationTheme } from "@/utils";

export default function App() {
  const theme = { ...MD3DarkTheme, ...darkThemes.defaultTheme };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={toNavigationTheme(theme)}>
        <HomeNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </PaperProvider>
  );
}
