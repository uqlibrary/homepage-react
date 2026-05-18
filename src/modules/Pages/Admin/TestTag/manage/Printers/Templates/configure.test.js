import config, { placeholderEditorColumns } from './configure';

describe('config', () => {
    describe('fields.printer_template_name.validate', () => {
        const { validate } = config.fields.printer_template_name;

        it('returns true when value is empty string', () => {
            expect(validate('')).toBe(true);
        });

        it('returns true when value is whitespace only', () => {
            expect(validate('   ')).toBe(true);
        });

        it('returns false when value is a valid name', () => {
            expect(validate('My Template')).toBe(false);
        });

        it('returns true when value exceeds 255 characters', () => {
            expect(validate('a'.repeat(256))).toBe(true);
        });

        it('returns false when value is exactly 255 characters', () => {
            expect(validate('a'.repeat(255))).toBe(false);
        });
    });

    describe('fields.identifiers.validate', () => {
        const { validate } = config.fields.identifiers;

        it('returns true when value is an empty array', () => {
            expect(validate([])).toBe(true);
        });

        it('returns false when value has valid unique string identifiers', () => {
            const value = ['ID-001', 'ID-002'];
            expect(validate(value)).toBe(false);
        });

        it('returns false when value has valid unique object identifiers', () => {
            const value = [
                { printer_template_identifier_value: 'ID-001' },
                { printer_template_identifier_value: 'ID-002' },
            ];
            expect(validate(value)).toBe(false);
        });

        it('returns true when there are duplicate string identifiers', () => {
            const value = ['ID-001', 'ID-001'];
            expect(validate(value)).toBe(true);
        });

        it('returns true when there are duplicate object identifiers', () => {
            const value = [
                { printer_template_identifier_value: 'ID-001' },
                { printer_template_identifier_value: 'ID-001' },
            ];
            expect(validate(value)).toBe(true);
        });

        it('returns true when a string identifier is empty', () => {
            const value = ['ID-001', ''];
            expect(validate(value)).toBe(true);
        });

        it('returns true when a string identifier exceeds 255 characters', () => {
            const value = ['ID-001', 'a'.repeat(256)];
            expect(validate(value)).toBe(true);
        });
    });

    describe('fields.vars.validate', () => {
        const { validate } = config.fields.vars;

        it('returns false when vars is empty and code is empty', () => {
            const row = { vars: [], printer_template_code: '' };
            expect(validate(null, row)).toBe(false);
        });

        it('returns false when all variable placeholders are present in the code', () => {
            const row = {
                vars: [{ printer_template_var_name: 'assetid' }, { printer_template_var_name: 'location' }],
                printer_template_code: 'Asset: {{ASSETID}} at {{LOCATION}}',
            };
            expect(validate(null, row)).toBe(false);
        });

        it('returns true when a variable placeholder is missing from the code', () => {
            const row = {
                vars: [{ printer_template_var_name: 'assetid' }, { printer_template_var_name: 'location' }],
                printer_template_code: 'Asset: {{ASSETID}}',
            };
            expect(validate(null, row)).toBe(true);
        });

        it('returns true when all placeholders are missing from the code', () => {
            const row = {
                vars: [{ printer_template_var_name: 'assetid' }],
                printer_template_code: 'No placeholders here',
            };
            expect(validate(null, row)).toBe(true);
        });

        it('returns false when vars is undefined', () => {
            const row = { printer_template_code: 'some code' };
            expect(validate(null, row)).toBe(false);
        });

        it('handles variable names with spaces and braces, matching clean placeholder', () => {
            const row = {
                vars: [{ printer_template_var_name: 'my var' }],
                printer_template_code: '{{MYVAR}}',
            };
            expect(validate(null, row)).toBe(false);
        });
    });

    describe('fields.printer_template_code.validate', () => {
        const { validate } = config.fields.printer_template_code;

        it('returns true when value is empty string', () => {
            expect(validate('')).toBe(true);
        });

        it('returns true when value is whitespace only', () => {
            expect(validate('   ')).toBe(true);
        });

        it('returns false when value has content', () => {
            expect(validate('ZPL code here')).toBe(false);
        });
    });

    describe('placeholderEditorColumns', () => {
        const getTestFunction = fieldName =>
            placeholderEditorColumns({
                rowModesModel: {},
                handleSaveClick: jest.fn(() => jest.fn()),
                handleCancelClick: jest.fn(() => jest.fn()),
                handleEditClick: jest.fn(() => jest.fn()),
                handleDeleteClick: jest.fn(() => jest.fn()),
            }).find(c => c.field === fieldName).preProcessEditCellProps;
        describe('printer_template_var_name.preProcessEditCellProps', () => {
            const testFunction = getTestFunction('printer_template_var_name');

            it('returns error: false for a valid value', () => {
                // const col = getColumn();
                const result = testFunction({ props: { value: 'ASSETID' } });
                expect(result.error).toBe(false);
            });

            it('returns error: true for an empty string', () => {
                const result = testFunction({ props: { value: '' } });
                expect(result.error).toBe(true);
            });

            it('returns error: true for whitespace-only string', () => {
                const result = testFunction({ props: { value: '   ' } });
                expect(result.error).toBe(true);
            });

            it('returns error: true when value exceeds 255 characters', () => {
                const result = testFunction({ props: { value: 'a'.repeat(256) } });
                expect(result.error).toBe(true);
            });

            it('returns error: false when value is exactly 255 characters', () => {
                const result = testFunction({ props: { value: 'a'.repeat(255) } });
                expect(result.error).toBe(false);
            });

            it('spreads original props into the return value', () => {
                const result = testFunction({ props: { value: 'VAR', id: 42 } });
                expect(result.id).toBe(42);
                expect(result.value).toBe('VAR');
            });
        });

        describe('printer_template_var_label.preProcessEditCellProps', () => {
            const testFunction = getTestFunction('printer_template_var_label');

            it('returns error: false for a valid label', () => {
                const result = testFunction({ props: { value: 'Asset ID' } });
                expect(result.error).toBe(false);
            });

            it('returns error: true for an empty string', () => {
                const result = testFunction({ props: { value: '' } });
                expect(result.error).toBe(true);
            });

            it('returns error: true when value exceeds 255 characters', () => {
                const result = testFunction({ props: { value: 'a'.repeat(256) } });
                expect(result.error).toBe(true);
            });

            it('returns error: false when value is exactly 255 characters', () => {
                const result = testFunction({ props: { value: 'a'.repeat(255) } });
                expect(result.error).toBe(false);
            });
        });

        describe('printer_template_var_value.preProcessEditCellProps', () => {
            const testFunction = getTestFunction('printer_template_var_value');

            it('returns error: false for an integer value', () => {
                const result = testFunction({ props: { value: 10 } });
                expect(result.error).toBe(false);
            });

            it('returns error: false for zero', () => {
                const result = testFunction({ props: { value: 0 } });
                expect(result.error).toBe(false);
            });

            it('returns error: true for a float value', () => {
                const result = testFunction({ props: { value: 1.5 } });
                expect(result.error).toBe(true);
            });

            it('returns error: true for a string value', () => {
                const result = testFunction({ props: { value: 'abc' } });
                expect(result.error).toBe(true);
            });

            it('returns error: true for null', () => {
                const result = testFunction({ props: { value: null } });
                expect(result.error).toBe(true);
            });

            it('spreads original props into the return value', () => {
                const result = testFunction({ props: { value: 5, id: 99 } });
                expect(result.id).toBe(99);
                expect(result.value).toBe(5);
            });

            it('returns error: true when props is undefined (covers catch block)', () => {
                const result = testFunction({ props: undefined });
                expect(result.error).toBe(true);
            });
        });
    });
});
