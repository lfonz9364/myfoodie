/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const lightTheme = {
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F4F6",
  text: "#111827",
  textSecondary: "#374151",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",
  primary: "#F97316",
  primarySoft: "#FFF7ED",
  primaryText: "#C2410C",
  darkSurface: "#111827",
  darkSurfaceText: "#FFFFFF",
  darkSurfaceMutedText: "#D1D5DB",
  accent: "#F59E0B",
  success: "#10B981",
  shadow: "#000000",
};

export const darkTheme = {
  background: "#030712",
  surface: "#111827",
  surfaceMuted: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  textMuted: "#9CA3AF",
  border: "#374151",
  borderStrong: "#4B5563",
  primary: "#F97316",
  primarySoft: "#7C2D12",
  primaryText: "#FED7AA",
  darkSurface: "#111827",
  darkSurfaceText: "#FFFFFF",
  darkSurfaceMutedText: "#D1D5DB",
  accent: "#F59E0B",
  success: "#34D399",
  shadow: "#000000",
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export type AppColors = typeof lightTheme;