export const controlFocusClassName = 'transition-colors duration-150 hover:border-blue-600';

export const interactiveFocusClassName = 'transition-colors duration-150';

export const fieldControlClassName = `rounded-md border shadow-xs ${controlFocusClassName}`;

export const outlinedControlClassName = `rounded-md border shadow-xs hover:text-blue-600 ${controlFocusClassName}`;

export const iconControlClassName = `rounded-md ${interactiveFocusClassName}`;

export const compactIconControlClassName = `inline-flex h-6 w-6 items-center justify-center ${iconControlClassName}`;

export const roundIconControlClassName = `rounded-full ${interactiveFocusClassName}`;

export const pillControlClassName =
  'border transition-colors duration-150 hover:border-blue-600 hover:text-blue-600';

export const textLinkClassName = 'text-blue-700 underline underline-offset-2 hover:text-blue-800';

export const darkTextLinkClassName =
  'text-blue-300 underline underline-offset-2 hover:text-blue-200';

export const getTextLinkClassName = (theme?: string) => {
  return theme === 'dark' ? darkTextLinkClassName : textLinkClassName;
};

export const accentIconClassName = 'text-blue-600';

export const primaryButtonClassName = `${interactiveFocusClassName} inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70`;
