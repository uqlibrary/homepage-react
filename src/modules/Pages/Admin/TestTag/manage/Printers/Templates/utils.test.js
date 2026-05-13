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
            expect(result).toEqual({
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
            });
        });

        it('handles edit action correctly', () => {
            const row = { printer_template_id: 7, printer_template_name: 'My Template' };
            const action = { type: 'edit', title: 'Edit Template', row };
            const result = actionReducer(emptyActionState, action);
            expect(result).toEqual({
                isAdd: false,
                isEdit: true,
                isDelete: false,
                title: 'Edit Template',
                row: { ...row, id: 7 },
                props: {},
            });
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

        it('returns true when label is empty', () => {
            expect(validateTemplateUserVariable({ ...validRow, printer_template_var_label: '' })).toEqual(true);
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
});
