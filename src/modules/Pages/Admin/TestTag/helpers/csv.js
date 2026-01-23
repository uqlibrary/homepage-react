import _ from 'lodash';
import FileSaver from 'file-saver';

/**
 * @param {*} value
 * @returns {*}
 */
export const sanitizeValue = value => {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'string') return value;

    // remove non-printable chars
    let string = value.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
    // standardize breaks
    string = string.replace(/\r\n|\r/g, '\n');
    // prevent CSV injection
    if (/^[=+\-@]/.test(string)) string = `'${string}`;
    // escape double quotes
    string = string.replace(/"/g, '""');
    // wrap value with quotes if required
    if (/[",\n]/.test(string)) string = `"${string}"`;

    return string;
};

/**
 * @param {string} locationField
 * @param {(obj: Object) => *} transformer
 * @returns {(obj: Object, attribute: string) => *}
 */
export const locationTransformer = (locationField, transformer) => (obj, attribute) =>
    attribute === locationField ? transformer(obj) : undefined;

/**
 * @param {Object} obj
 * @param {string[]} selectedAttributes
 * @param {(obj: Object, attribute: string) => *} [transformer=null]
 * @returns {Array<*>}
 */
export const objectToArray = (obj, selectedAttributes, transformer = null) =>
    selectedAttributes.map(attribute => (transformer && transformer(obj, attribute)) || obj[attribute]);

/**
 * @param {Object[]} columns
 * @param {string} columns[].headerName
 * @param {string} columns[].field
 * @param {Object[]} data
 * @param {(obj: Object, attribute: string) => *} [itemTransformer=null]
 * @returns {{ headers: string[], data: Array<Array<*>> }}
 */
export const dataTableDataToRows = (columns, data, itemTransformer = null) => {
    const headers = _.map(columns, 'headerName');
    const fields = _.map(columns, 'field');

    return {
        headers,
        data: data.map(item => objectToArray(item, fields, itemTransformer)),
    };
};

/**
 * @param {Array<Array<string|number|null|undefined>>} data
 * @returns {string}
 */
export const rowsToCSVString = data => data.map(row => row.map(value => sanitizeValue(value)).join(',')).join('\n');

/**
 * @param {string} csv
 * @param {string} filename
 * @returns {*}
 */
export const downloadCSVFile = (csv, filename) =>
    FileSaver.saveAs(new Blob([csv], { type: 'text/csv' }), `${filename.replace(/\.csv$/, '')}.csv`);
