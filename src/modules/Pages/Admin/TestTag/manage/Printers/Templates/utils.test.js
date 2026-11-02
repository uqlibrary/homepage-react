import {
    randomId,
    getCleanVarName,
    getUserVariablePlaceholder,
    getSafeUserVariableNamePlaceholder,
    getSafeUserVariableValuePlaceholder,
    transformRow,
    emptyActionState,
    transformUpdateRequest,
    transformAddRequest,
    actionReducer,
    validateTemplateUserVariable,
    formatTemplate,
    getLabelDates,
    getMissingUserVarsInPastedCode,
    getUniqueTemplateIds,
    getRowsToAddForMissingVars,
    getMissingUserVarsInCode,
    getUserVariablesFromRow,
} from './utils';

describe('utils', () => {
    describe('randomId', () => {
        it('returns max printer_template_var_id + 1', () => {
            const rows = [
                { printer_template_var_id: 1 },
                { printer_template_var_id: 5 },
                { printer_template_var_id: 3 },
            ];
            expect(randomId(rows)).toEqual(6);
        });

        it('returns 1 when rows is empty', () => {
            expect(randomId([])).toEqual(1);
        });

        it('returns 1 when rows is undefined', () => {
            expect(randomId(undefined)).toEqual(1);
        });
    });

    describe('getCleanVarName', () => {
        it('removes spaces, braces, and uppercases the string', () => {
            expect(getCleanVarName('hello world')).toEqual('HELLOWORLD');
        });

        it('removes curly braces', () => {
            expect(getCleanVarName('{{name}}')).toEqual('NAME');
        });

        it('returns empty string for empty input', () => {
            expect(getCleanVarName('')).toEqual('');
        });

        it('returns empty string for undefined', () => {
            expect(getCleanVarName(undefined)).toEqual('');
        });

        it('uppercases and strips whitespace', () => {
            expect(getCleanVarName('  my Var  ')).toEqual('MYVAR');
        });
    });

    describe('getUserVariablePlaceholder', () => {
        it('wraps name in double curly braces', () => {
            expect(getUserVariablePlaceholder('TEST')).toEqual('{{TEST}}');
        });
    });

    describe('getSafeUserVariableNamePlaceholder', () => {
        it('cleans name and wraps in placeholder', () => {
            expect(getSafeUserVariableNamePlaceholder('my var')).toEqual('{{MYVAR}}');
        });

        it('handles name with braces', () => {
            expect(getSafeUserVariableNamePlaceholder('{{foo}}')).toEqual('{{FOO}}');
        });
    });

    describe('getSafeUserVariableValuePlaceholder', () => {
        it('returns string value as-is', () => {
            expect(getSafeUserVariableValuePlaceholder('hello')).toEqual('hello');
        });

        it('converts number to string', () => {
            expect(getSafeUserVariableValuePlaceholder(42)).toEqual('42');
        });
    });

    describe('transformRow', () => {
        it('transforms rows correctly', () => {
            const inputRow = [
                {
                    printer_template_id: 1,
                    printer_template_current_flag: 1,
                    identifiers: [
                        { printer_template_identifier_value: 'A' },
                        { printer_template_identifier_value: 'B' },
                    ],
                },
                {
                    printer_template_id: 2,
                    printer_template_current_flag: 0,
                    identifiers: [],
                },
            ];

            const result = transformRow(inputRow);

            expect(result[0].printer_template_current_flag_cb).toEqual(true);
            expect(result[0].printer_template_current_flag).toEqual('Yes');
            expect(result[0].identifiers_str).toEqual('A, B');

            expect(result[1].printer_template_current_flag_cb).toEqual(false);
            expect(result[1].printer_template_current_flag).toEqual('No');
            expect(result[1].identifiers_str).toEqual('');
        });
    });

    describe('transformUpdateRequest', () => {
        it('sets printer_template_current_flag to 1 when cb is true', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: [],
                vars: [],
            };
            const result = transformUpdateRequest(request);
            expect(result.printer_template_current_flag).toEqual(1);
            expect(result.printer_template_current_flag_cb).toBeUndefined();
        });

        it('sets printer_template_current_flag to 0 when cb is false', () => {
            const request = {
                printer_template_current_flag_cb: false,
                identifiers: [],
                vars: [],
            };
            const result = transformUpdateRequest(request);
            expect(result.printer_template_current_flag).toEqual(0);
        });

        it('converts string identifiers to objects', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: ['ID-001', 'ID-002'],
                vars: [],
            };
            const result = transformUpdateRequest(request);
            expect(result.identifiers).toEqual([
                { printer_template_identifier_value: 'ID-001' },
                { printer_template_identifier_value: 'ID-002' },
            ]);
        });

        it('keeps object identifiers as-is', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: [{ printer_template_identifier_value: 'ID-001', extra: 'data' }],
                vars: [],
            };
            const result = transformUpdateRequest(request);
            expect(result.identifiers).toEqual([{ printer_template_identifier_value: 'ID-001', extra: 'data' }]);
        });

        it('cleans vars and applies name/value placeholders', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: [],
                vars: [
                    {
                        printer_template_var_id: 10,
                        printer_template_var_name: 'my var',
                        printer_template_var_value: 'hello',
                        error: 'some error',
                        isNew: true,
                    },
                ],
            };
            const result = transformUpdateRequest(request);
            expect(result.vars[0].printer_template_var_name).toEqual('{{MYVAR}}');
            expect(result.vars[0].printer_template_var_value).toEqual('hello');
            expect(result.vars[0].error).toBeUndefined();
            expect(result.vars[0].isNew).toBeUndefined();
            expect(result.vars[0].printer_template_var_id).toEqual(10);
        });

        it('deletes isAdded and printer_template_var_id when isAdded is present', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: [],
                vars: [
                    {
                        printer_template_var_id: 99,
                        printer_template_var_name: 'new var',
                        printer_template_var_value: '0',
                        isAdded: true,
                    },
                ],
            };
            const result = transformUpdateRequest(request);
            expect(result.vars[0].isAdded).toBeUndefined();
            expect(result.vars[0].printer_template_var_id).toBeUndefined();
        });

        it('removes extra fields from request', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers_str: 'A, B',
                printer_template_department_slug: 'dept',
                created_at: '2024-01-01',
                updated_at: '2024-01-02',
                identifiers: [],
                vars: [],
            };
            const result = transformUpdateRequest(request);
            expect(result.identifiers_str).toBeUndefined();
            expect(result.printer_template_department_slug).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
        });

        it('handles missing identifiers and vars gracefully', () => {
            const request = {
                printer_template_current_flag_cb: true,
            };
            const result = transformUpdateRequest(request);
            expect(result.identifiers).toEqual([]);
            expect(result.vars).toEqual([]);
        });
    });

    describe('transformAddRequest', () => {
        it('sets printer_template_current_flag to 1 when cb is true', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: [],
                vars: [],
            };
            const result = transformAddRequest(request);
            expect(result.printer_template_current_flag).toEqual(1);
            expect(result.printer_template_current_flag_cb).toBeUndefined();
        });

        it('sets printer_template_current_flag to 0 when cb is false', () => {
            const request = {
                printer_template_current_flag_cb: false,
                identifiers: [],
                vars: [],
            };
            const result = transformAddRequest(request);
            expect(result.printer_template_current_flag).toEqual(0);
        });

        it('converts string identifiers to objects', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: ['ID-001', 'ID-002'],
                vars: [],
            };
            const result = transformAddRequest(request);
            expect(result.identifiers).toEqual([
                { printer_template_identifier_value: 'ID-001' },
                { printer_template_identifier_value: 'ID-002' },
            ]);
        });

        it('cleans vars and applies name/value placeholders', () => {
            const request = {
                printer_template_current_flag_cb: true,
                identifiers: [],
                vars: [
                    {
                        printer_template_var_id: 5,
                        printer_template_var_name: 'test var',
                        printer_template_var_value: '1',
                        error: 'err',
                        isNew: true,
                        isAdded: true,
                    },
                ],
            };
            const result = transformAddRequest(request);
            expect(result.vars[0].printer_template_var_name).toEqual('{{TESTVAR}}');
            expect(result.vars[0].printer_template_var_value).toEqual('1');
            expect(result.vars[0].error).toBeUndefined();
            expect(result.vars[0].isNew).toBeUndefined();
            expect(result.vars[0].isAdded).toBeUndefined();
            expect(result.vars[0].printer_template_var_id).toBeUndefined();
        });

        it('handles missing identifiers and vars gracefully', () => {
            const request = {
                printer_template_current_flag_cb: false,
            };
            const result = transformAddRequest(request);
            expect(result.identifiers).toEqual([]);
            expect(result.vars).toEqual([]);
        });
    });

    describe('actionReducer', () => {
        it('handles add action correctly', () => {
            const action = { type: 'add', title: 'Add Template' };
            const result = actionReducer(emptyActionState, action);
            expect(result).toEqual(
                expect.objectContaining({
                    isAdd: true,
                    isEdit: false,
                    isDelete: false,
                    title: 'Add Template',
                    row: {
                        printer_template_name: '',
                        identifiers: [],
                        vars: [],
                        printer_template_current_flag_cb: true,
                    },
                    props: {},
                    key: expect.stringMatching(/^add-\d+$/),
                }),
            );
        });

        it('handles edit action correctly', () => {
            const row = { printer_template_id: 7, printer_template_name: 'My Template' };
            const action = { type: 'edit', title: 'Edit Template', row };
            const result = actionReducer(emptyActionState, action);
            expect(result).toEqual(
                expect.objectContaining({
                    isAdd: false,
                    isEdit: true,
                    isDelete: false,
                    title: 'Edit Template',
                    row: { ...row, id: 7 },
                    props: {},
                    key: expect.stringMatching(/^edit-7-\d+$/),
                }),
            );
        });

        it('handles delete action correctly', () => {
            const row = { printer_template_id: 3, printer_template_name: 'To Delete' };
            const action = { type: 'delete', title: 'Delete Template', row };
            const result = actionReducer(emptyActionState, action);
            expect(result).toEqual({
                isAdd: false,
                isEdit: false,
                isDelete: true,
                title: 'Delete Template',
                row,
                props: {},
            });
        });

        it('handles clear action correctly', () => {
            const result = actionReducer(
                { isAdd: true, isEdit: false, isDelete: false, title: 'x', row: {} },
                {
                    type: 'clear',
                },
            );
            expect(result).toEqual(emptyActionState);
        });

        it('throws for unknown action type', () => {
            expect(() => actionReducer(emptyActionState, { type: 'unknown' })).toThrow("Unknown action 'unknown'");
        });
    });

    describe('validateTemplateUserVariable', () => {
        const validRow = {
            printer_template_var_name: 'ValidName',
            printer_template_var_label: 'Valid Label',
            printer_template_var_value: '5',
        };

        it('returns false for a valid row', () => {
            expect(validateTemplateUserVariable(validRow)).toEqual(false);
        });

        it('returns true when name is empty', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_name: '' })).toEqual(true);
        });

        it('returns true when name is null', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_name: null })).toEqual(true);
        });

        it('returns true when name exceeds 255 characters', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_name: 'a'.repeat(256) })).toEqual(
                true,
            );
        });

        it('returns false when label is empty', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_label: '' })).toEqual(false);
        });

        it('returns true when label exceeds 255 characters', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_label: 'b'.repeat(256) })).toEqual(
                true,
            );
        });

        it('returns true when value is null', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_value: null })).toEqual(true);
        });

        it('returns true when value is undefined', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_value: undefined })).toEqual(true);
        });

        it('returns true when value is empty string', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_value: '' })).toEqual(true);
        });

        it('returns true when value is not a valid integer string', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_value: 'abc' })).toEqual(true);
        });

        it('returns false when value is "0"', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_value: '0' })).toEqual(false);
        });

        it('returns true when value is a float string', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_value: '1.5' })).toEqual(true);
        });
    });

    describe('formatTemplate', () => {
        it('replaces user variable placeholders with their values', () => {
            const template = 'Hello {{NAME}}, you are {{AGE}} years old.';
            const templateData = [
                { printer_template_var_name: '{{NAME}}', printer_template_var_value: 'Alice' },
                { printer_template_var_name: '{{AGE}}', printer_template_var_value: '30' },
            ];
            expect(formatTemplate(template, templateData, {})).toEqual('Hello Alice, you are 30 years old.');
        });

        it('replaces inspection data placeholders with their values', () => {
            const template = 'Asset: {*ASSET_ID*}, Location: {*LOCATION*}';
            expect(formatTemplate(template, [], { asset_id: 'UQL001', location: 'Room 1' })).toEqual(
                'Asset: UQL001, Location: Room 1',
            );
        });

        it('replaces both user variable and inspection placeholders', () => {
            const template = '{{LABEL}}: {*ASSET_ID*}';
            const templateData = [{ printer_template_var_name: '{{LABEL}}', printer_template_var_value: 'ID' }];
            expect(formatTemplate(template, templateData, { asset_id: 'UQL999' })).toEqual('ID: UQL999');
        });

        it('returns template unchanged when templateData is empty and inspectionData is empty', () => {
            const template = 'No placeholders here';
            expect(formatTemplate(template, [], {})).toEqual('No placeholders here');
        });

        it('replaces all occurrences of a placeholder', () => {
            const template = '{{NAME}} and {{NAME}}';
            const templateData = [{ printer_template_var_name: '{{NAME}}', printer_template_var_value: 'Bob' }];
            expect(formatTemplate(template, templateData, {})).toEqual('Bob and Bob');
        });

        it('handles non-array templateData gracefully', () => {
            const template = 'Hello {*NAME*}';
            expect(formatTemplate(template, null, { name: 'World' })).toEqual('Hello World');
        });

        it('handles null inspectionData gracefully', () => {
            const template = '{{FOO}}';
            const templateData = [{ printer_template_var_name: '{{FOO}}', printer_template_var_value: 'bar' }];
            expect(formatTemplate(template, templateData, null)).toEqual('bar');
        });

        it('skips placeholder when printer_template_var_name is falsy', () => {
            const template = 'unchanged';
            const templateData = [{ printer_template_var_name: '', printer_template_var_value: 'value' }];
            expect(formatTemplate(template, templateData, {})).toEqual('unchanged');
        });
    });

    describe('getLabelDates', () => {
        it('returns testDate as YYYY-MM-DD of the given date', () => {
            const date = new Date('2024-06-15T00:00:00.000Z');
            const { testDate } = getLabelDates(date);
            expect(testDate).toEqual('2024-06-15');
        });

        it('returns dueDate as YYYY-MM-DD one year after the given date', () => {
            const date = new Date('2024-06-15T00:00:00.000Z');
            const { dueDate } = getLabelDates(date);
            expect(dueDate).toEqual('2025-06-15');
        });

        it('handles leap year: Feb 29 due date overflows to Mar 1 in a non-leap year', () => {
            const date = new Date('2024-02-29T00:00:00.000Z');
            const { dueDate } = getLabelDates(date);
            expect(dueDate).toEqual('2025-03-01');
        });

        it('handles end of year: Dec 31 + 1 year = Dec 31 next year', () => {
            const date = new Date('2023-12-31T00:00:00.000Z');
            const { dueDate } = getLabelDates(date);
            expect(dueDate).toEqual('2024-12-31');
        });

        it('returns both testDate and dueDate correctly together', () => {
            const date = new Date('2025-01-01T00:00:00.000Z');
            const { testDate, dueDate } = getLabelDates(date);
            expect(testDate).toEqual('2025-01-01');
            expect(dueDate).toEqual('2026-01-01');
        });
    });

    describe('getMissingUserVarsInPastedCode', () => {
        const existingRows = [
            { printer_template_var_name: '{{BARCODE}}' },
            { printer_template_var_name: '{{LOCATION}}' },
        ];

        it('returns placeholders in pasted text not already in rows', () => {
            const pasteValue = 'Print {{BARCODE}} at {{ASSET}} for {{UNIT}}';
            expect(getMissingUserVarsInPastedCode(existingRows, pasteValue)).toEqual(['{{ASSET}}', '{{UNIT}}']);
        });

        it('returns empty array when all placeholders already exist in rows', () => {
            const pasteValue = 'Use {{BARCODE}} and {{LOCATION}}';
            expect(getMissingUserVarsInPastedCode(existingRows, pasteValue)).toEqual([]);
        });

        it('returns empty array when pasted text has no placeholders', () => {
            expect(getMissingUserVarsInPastedCode(existingRows, 'no placeholders here')).toEqual([]);
        });

        it('deduplicates placeholders in pasted text', () => {
            const pasteValue = '{{NEW}} and {{NEW}} again';
            expect(getMissingUserVarsInPastedCode(existingRows, pasteValue)).toEqual(['{{NEW}}']);
        });

        it('returns empty array when rows is empty and paste has no placeholders', () => {
            expect(getMissingUserVarsInPastedCode([], 'plain text')).toEqual([]);
        });

        it('returns all placeholders when rows is empty', () => {
            const pasteValue = '{{A}} and {{B}}';
            expect(getMissingUserVarsInPastedCode([], pasteValue)).toEqual(['{{A}}', '{{B}}']);
        });
    });

    describe('getUniqueTemplateIds', () => {
        it('returns a Set of all printer_template_var_id values', () => {
            const rows = [
                { printer_template_var_id: 1 },
                { printer_template_var_id: 3 },
                { printer_template_var_id: 7 },
            ];
            const result = getUniqueTemplateIds(rows);
            expect(result).toBeInstanceOf(Set);
            expect([...result]).toEqual([1, 3, 7]);
        });

        it('returns an empty Set for an empty array', () => {
            expect([...getUniqueTemplateIds([])]).toEqual([]);
        });

        it('handles duplicate ids by returning unique values only', () => {
            const rows = [
                { printer_template_var_id: 2 },
                { printer_template_var_id: 2 },
                { printer_template_var_id: 5 },
            ];
            const result = getUniqueTemplateIds(rows);
            expect([...result]).toEqual([2, 5]);
        });
    });

    describe('getRowsToAddForMissingVars', () => {
        it('creates new rows for each missing var with unique IDs', () => {
            const currentRows = [
                { printer_template_var_id: 1, printer_template_var_name: '{{BARCODE}}' },
                { printer_template_var_id: 2, printer_template_var_name: '{{LOCATION}}' },
            ];
            const missing = ['{{ASSET}}', '{{UNIT}}'];
            const result = getRowsToAddForMissingVars(missing, currentRows);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                printer_template_var_id: 3,
                printer_template_var_label: '',
                printer_template_var_name: '{{ASSET}}',
                printer_template_var_value: '',
            });
            expect(result[1]).toEqual({
                printer_template_var_id: 4,
                printer_template_var_label: '',
                printer_template_var_name: '{{UNIT}}',
                printer_template_var_value: '',
            });
        });

        it('skips already-used IDs when assigning new IDs', () => {
            const currentRows = [{ printer_template_var_id: 1 }, { printer_template_var_id: 3 }];
            const result = getRowsToAddForMissingVars(['{{NEW}}'], currentRows);
            expect(result[0].printer_template_var_id).toEqual(2);
        });

        it('returns empty array when missing vars is empty', () => {
            const currentRows = [{ printer_template_var_id: 1 }];
            expect(getRowsToAddForMissingVars([], currentRows)).toEqual([]);
        });

        it('starts from ID 1 when current rows is empty', () => {
            const result = getRowsToAddForMissingVars(['{{FIRST}}'], []);
            expect(result[0].printer_template_var_id).toEqual(1);
        });

        it('sets label and value to empty strings', () => {
            const result = getRowsToAddForMissingVars(['{{X}}'], []);
            expect(result[0].printer_template_var_label).toEqual('');
            expect(result[0].printer_template_var_value).toEqual('');
        });
    });

    describe('getUserVariablesFromRow', () => {
        it('returns an array of printer_template_var_name from vars', () => {
            const row = {
                vars: [{ printer_template_var_name: '{{BARCODE}}' }, { printer_template_var_name: '{{LOCATION}}' }],
            };
            expect(getUserVariablesFromRow(row)).toEqual(['{{BARCODE}}', '{{LOCATION}}']);
        });

        it('returns empty array when vars is an empty array', () => {
            expect(getUserVariablesFromRow({ vars: [] })).toEqual([]);
        });

        it('returns empty array when vars is undefined', () => {
            expect(getUserVariablesFromRow({})).toEqual([]);
        });

        it('returns empty array when row is undefined', () => {
            expect(getUserVariablesFromRow(undefined)).toEqual([]);
        });

        it('returns empty array when row is null', () => {
            expect(getUserVariablesFromRow(null)).toEqual([]);
        });
    });

    describe('getMissingUserVarsInCode', () => {
        it('returns vars whose placeholder is not found in the code', () => {
            const userVariables = ['{{BARCODE}}', '{{LOCATION}}'];
            const code = 'Print {{BARCODE}} here';
            expect(getMissingUserVarsInCode(userVariables, code)).toEqual(['{{LOCATION}}']);
        });

        it('returns empty array when all vars are present in the code', () => {
            const userVariables = ['{{BARCODE}}', '{{LOCATION}}'];
            const code = '{{BARCODE}} at {{LOCATION}}';
            expect(getMissingUserVarsInCode(userVariables, code)).toEqual([]);
        });

        it('returns all vars when none are present in the code', () => {
            const userVariables = ['{{BARCODE}}', '{{LOCATION}}'];
            expect(getMissingUserVarsInCode(userVariables, 'no placeholders')).toEqual(['{{BARCODE}}', '{{LOCATION}}']);
        });

        it('returns empty array when userVariables is empty', () => {
            expect(getMissingUserVarsInCode([], '{{BARCODE}}')).toEqual([]);
        });

        it('applies getSafeUserVariableNamePlaceholder before matching — strips braces for lookup', () => {
            const userVariables = ['BARCODE'];
            const code = 'Print {{BARCODE}} here';
            expect(getMissingUserVarsInCode(userVariables, code)).toEqual([]);
        });
    });
});
