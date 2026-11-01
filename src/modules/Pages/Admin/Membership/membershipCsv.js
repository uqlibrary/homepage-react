/**
 * The CSV export of the applications matching the current search and filter.
 *
 * The columns and their order are the ones the Library's downstream processes already expect, so they are
 * pinned by test rather than derived from the card.
 */
export const CSV_HEADERS = ['Name', 'Email', 'Type', 'Expiry', 'Barcode'];

// A field opening with one of these is read as a formula by Excel, Numbers and Sheets. Every value here was
// typed in by an applicant, so any of them could carry one.
const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

export const fullName = membership =>
    [membership?.title, membership?.first_name, membership?.sn].filter(Boolean).join(' ');

/**
 * Quote a value for CSV, and defuse it as a spreadsheet formula.
 *
 * Prefixing with a single quote is what stops a cell reading `=cmd|'/c calc'!A1` from being executed on open;
 * the quote is a spreadsheet convention for "this is text" and is not shown in the cell.
 */
export const escapeCsvValue = value => {
    const text = value === null || value === undefined ? '' : String(value);
    const defused = FORMULA_PREFIXES.some(prefix => text.startsWith(prefix)) ? `'${text}` : text;
    return `"${defused.replace(/"/g, '""')}"`;
};

export const membershipToCsvRow = (membership, typeTitles = {}) => [
    fullName(membership),
    membership?.mail,
    typeTitles[membership?.type] ?? membership?.type,
    membership?.expires_on,
    membership?.barcode,
];

export const buildCsv = (memberships = [], typeTitles = {}) =>
    [CSV_HEADERS, ...memberships.map(membership => membershipToCsvRow(membership, typeTitles))]
        .map(row => row.map(escapeCsvValue).join(','))
        .join('\r\n');

/**
 * Hand a built CSV to the browser as a download.
 *
 * Kept behind its own export so the page can be tested without a real object URL: jsdom implements neither
 * URL.createObjectURL nor navigation.
 */
export const downloadCsv = (filename, csv) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};
