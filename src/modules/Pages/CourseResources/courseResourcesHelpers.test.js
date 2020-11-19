import { _pluralise, _courseLink, a11yProps, reverseA11yProps, extractSubjectCodeFromName } from './courseResourcesHelpers';

describe('filterProps helper', () => {
    it('should make plurals of words properly', () => {
        expect(_pluralise('paper', 0)).toBe('papers');
        expect(_pluralise('paper', 1)).toBe('paper');
        expect(_pluralise('paper', 2)).toBe('papers');
        expect(_pluralise('paper', 1234)).toBe('papers');
        expect(_pluralise('paper', 'A')).toBe('papers');
        expect(_pluralise('paper', -8)).toBe('papers');
    });

    it('should create course links properly', () => {
        expect(_courseLink('PHIL1111', 'https://example.com/[courseCode]')).toBe('https://example.com/PHIL1111');
        expect(_courseLink('', 'https://www.example.com/something?stub=')).toBe(
            'https://www.example.com/something?stub=',
        );
    });

    it('should create a11ylinks that are interdependant', () => {
        const a11yProps1 = a11yProps(1, 'top');
        const a11yReverseProps1 = reverseA11yProps(1, 'top');
        expect(a11yProps1.id).toEqual(a11yReverseProps1['aria-labelledby']);
        expect(a11yProps1['aria-controls']).toEqual(a11yReverseProps1.id);

        const a11yProps2 = a11yProps(1);
        expect(a11yProps2.id).toEqual('topmenu-1');

        const a11yReverseProps2 = reverseA11yProps(1);
        expect(a11yReverseProps2.id).toEqual('topmenu-panel-1');
    });

    it('should extract a subject code from a subject name', () => {
        expect(extractSubjectCodeFromName('CRIM1019 - Introduction to Criminal Justice')).toEqual('CRIM1019');
    });
});
