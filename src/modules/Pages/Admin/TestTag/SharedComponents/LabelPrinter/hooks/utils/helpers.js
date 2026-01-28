export const normalisePlaceholderKey = key => key.toUpperCase();
export const normalisePrinterNameKey = key => {
    const lowerKey = key.toLowerCase();
    if (isFinite(lowerKey[0])) return `$${lowerKey}`;
    return lowerKey;
};
