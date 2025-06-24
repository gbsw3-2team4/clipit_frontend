// src/styles/syntaxThemes.ts

import {
  oneDark,
  vscDarkPlus,
  dracula,
  atomDark,
  okaidia,
  a11yDark,
  materialDark,
  materialLight,
  materialOceanic,
  nord,
  shadesOfPurple,
  synthwave84,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// Prism 테마 객체
export const syntaxStyles = {
  oneDark,
  vscDarkPlus,
  dracula,
  atomDark,
  okaidia,
  a11yDark,
  materialDark,
  materialLight,
  materialOceanic,
  nord,
  shadesOfPurple,
  synthwave84,
} as const;

// 타입 정의
export type ThemeKey = keyof typeof syntaxStyles;

// UI 용 레이블 맵 (선택적)
export const themeLabels: Record<ThemeKey, string> = {
  oneDark: "One Dark",
  vscDarkPlus: "VS Dark+",
  dracula: "Dracula",
  atomDark: "Atom Dark",
  okaidia: "Okaidia",
  a11yDark: "A11Y Dark",
  materialDark: "Material Dark",
  materialLight: "Material Light",
  materialOceanic: "Material Oceanic",
  nord: "Nord",
  shadesOfPurple: "Shades of Purple",
  synthwave84: "Synthwave '84",
};
