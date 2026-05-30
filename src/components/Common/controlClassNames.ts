export const controlFocusClassName =
  'transition-colors duration-150 hover:border-blue-600 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

export const interactiveFocusClassName =
  'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

export const fieldControlClassName = `rounded-md border shadow-sm ${controlFocusClassName}`;

export const outlinedControlClassName = `rounded-md border shadow-sm hover:text-blue-600 ${controlFocusClassName}`;

export const iconControlClassName = `rounded-md ${interactiveFocusClassName}`;

export const roundIconControlClassName = `rounded-full focus-visible:rounded-full ${interactiveFocusClassName}`;

export const pillControlClassName =
  'border transition-colors duration-150 hover:border-blue-600 hover:text-blue-600 focus-visible:rounded-full focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600';
