import { getMapLabel } from './bookExamBoothHelper';

describe('helpers', () => {
    it('adds a "the" correctly when required or not required', () => {
        const sampleLocale = [
            {
                label: 'Central Library',
                needsDefiniteArticle: true,
            },
            {
                label: 'Gatton',
                needsDefiniteArticle: false,
            },
        ];
        const localeWithDefiniteArticle = sampleLocale[0];
        const localeWithOUTDefiniteArticle = sampleLocale[1];
        expect(getMapLabel(localeWithDefiniteArticle)).toEqual(
            'View a map showing the location of exams at the Central Library',
        );
        expect(getMapLabel(localeWithOUTDefiniteArticle)).toEqual('View a map showing the location of exams at Gatton');
    });
});
