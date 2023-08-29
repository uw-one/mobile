import { Theme as NavigationTheme } from "@react-navigation/native";
import { MD3Theme as PaperTheme } from "react-native-paper";

export function toNavigationTheme(paperTheme: PaperTheme): NavigationTheme {
  return {
    dark: true,
    colors: {
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.elevation.level2,
      text: paperTheme.colors.inverseSurface,
      border: paperTheme.colors.outline,
      notification: "#f50056",
    },
  };
}
