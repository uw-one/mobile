import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { HomeNavigator } from "@/navigators";
import { darkThemes } from "@/themes";
import { toNavigationTheme } from "@/utils";

export default function App() {
  const queryClient = new QueryClient();
  const theme = { ...MD3DarkTheme, ...darkThemes.defaultTheme };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={toNavigationTheme(theme)}>
        <QueryClientProvider client={queryClient}>
          <HomeNavigator />
          <StatusBar style="light" />
        </QueryClientProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
