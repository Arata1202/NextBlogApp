import {
  colorClassNames,
  getThemeVariantClassName,
  radiusClassNames,
  shadowClassNames,
  themeVariantClassNames,
  transitionClassNames,
} from '@/styles/uiClassNames';

export const controlFocusClassName = `${transitionClassNames.color} ${colorClassNames.accentBorderHover}`;

export const interactiveFocusClassName = transitionClassNames.color;

export const fieldControlClassName = `${radiusClassNames.control} border ${shadowClassNames.control} ${controlFocusClassName}`;

export const outlinedControlClassName = `${radiusClassNames.control} border ${shadowClassNames.control} ${colorClassNames.accentHoverText} ${controlFocusClassName}`;

export const iconControlClassName = `${radiusClassNames.control} ${interactiveFocusClassName}`;

export const compactIconControlClassName = `inline-flex h-6 w-6 items-center justify-center ${iconControlClassName}`;

export const roundIconControlClassName = `${radiusClassNames.round} ${interactiveFocusClassName}`;

export const pillControlClassName = `${radiusClassNames.round} border ${transitionClassNames.color} ${colorClassNames.accentBorderHover} ${colorClassNames.accentHoverText}`;

export const textLinkClassName = `${colorClassNames.textLink} underline underline-offset-2`;

export const darkTextLinkClassName = `${colorClassNames.darkTextLink} underline underline-offset-2`;

export const getTextLinkClassName = (theme?: string) => {
  return getThemeVariantClassName(theme, {
    light: textLinkClassName,
    dark: darkTextLinkClassName,
  });
};

export const getMutedTextClassName = (theme?: string) =>
  getThemeVariantClassName(theme, themeVariantClassNames.mutedText);
