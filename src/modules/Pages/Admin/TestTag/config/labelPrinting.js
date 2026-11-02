export const LABEL_PRINTING = {
    // site wide toggle
    enabled: true,
    UQL: {
        // department specific settings, this could be added to account response
        enabled: true,
        defaultPrinter: 'zebra',
    },
};

export const PRINTER_TEMPLATE_SYSTEM_VARIABLES = ['{*USERID*}', '{*ASSETID*}', '{*TESTDATE*}', '{*DUEDATE*}'];

export const COOKIE_PRINTER_PREFERENCE = 'TNT_LABEL_PRINTER_PREFERENCE';
