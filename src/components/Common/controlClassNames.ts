import {
  colorClassNames,
  radiusClassNames,
  shadowClassNames,
  transitionClassNames,
} from '@/styles/designTokens';

export const controlFocusClassName = `${transitionClassNames.color} ${colorClassNames.accentBorderHover}`;

export const interactiveFocusClassName = transitionClassNames.color;

export const fieldControlClassName = `${radiusClassNames.control} border ${shadowClassNames.control} ${controlFocusClassName}`;

export const outlinedControlClassName = `${radiusClassNames.control} border ${shadowClassNames.control} ${colorClassNames.accentHoverText} ${controlFocusClassName}`;

export const iconControlClassName = `${radiusClassNames.control} ${interactiveFocusClassName}`;

export const compactIconControlClassName = `inline-flex h-6 w-6 items-center justify-center ${iconControlClassName}`;

export const roundIconControlClassName = `${radiusClassNames.round} ${interactiveFocusClassName}`;

export const pillControlClassName = `border ${transitionClassNames.color} ${colorClassNames.accentBorderHover} ${colorClassNames.accentHoverText}`;

export const textLinkClassName = `${colorClassNames.textLink} underline underline-offset-2`;

export const darkTextLinkClassName = `${colorClassNames.darkTextLink} underline underline-offset-2`;

export const getTextLinkClassName = (theme?: string) => {
  return theme === 'dark' ? darkTextLinkClassName : textLinkClassName;
};

export const accentIconClassName = colorClassNames.accentText;

export const primaryButtonClassName = `${interactiveFocusClassName} inline-flex w-full justify-center ${radiusClassNames.control} ${colorClassNames.primaryButton} px-3 py-2 text-sm font-semibold ${shadowClassNames.control} disabled:cursor-wait disabled:opacity-70`;
