// Keep embedded JSON within its script element, including CMS-provided strings.
export const serializeJsonLd = (value: object) => JSON.stringify(value).replace(/</g, '\\u003c');
