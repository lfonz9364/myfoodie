import { Platform } from "react-native";

export const lightTheme = {
  // base
  background: "#F0FDF4",
  surface: "#FFFFFF",
  surfaceMuted: "#DCFCE7",

  // text
  text: "#14532D",
  textSecondary: "#166534",
  textMuted: "#4D7C0F",

  // borders
  border: "#BBF7D0",
  borderStrong: "#86EFAC",

  // primary brand (green)
  primary: "#16A34A",
  primarySoft: "#DCFCE7",
  primaryText: "#166534",

  // semantic colors
  success: "#16A34A",
  warning: "#EAB308",
  error: "#DC2626",

  // dark surfaces / hero areas
  darkSurface: "#166534",
  darkSurfaceText: "#FFFFFF",
  darkSurfaceMutedText: "#D1FAE5",

  // accent
  accent: "#FFC72C",

  // shadow
  shadow: "#000000",
};

export const darkTheme = {
  background: "#052E16",
  surface: "#14532D",
  surfaceMuted: "#166534",

  text: "#F0FDF4",
  textSecondary: "#DCFCE7",
  textMuted: "#86EFAC",

  border: "#166534",
  borderStrong: "#22C55E",

  primary: "#22C55E",
  primarySoft: "#166534",
  primaryText: "#DCFCE7",

  success: "#22C55E",
  warning: "#FFC72C",
  error: "#EF4444",

  darkSurface: "#14532D",
  darkSurfaceText: "#FFFFFF",
  darkSurfaceMutedText: "#D1FAE5",

  accent: "#FFC72C",

  shadow: "#000000",
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
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
