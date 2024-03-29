import { default as locale } from './learningResources.locale';
import { isAString, isAValidLink, isPositiveInteger } from 'modules/testhelpers';

describe('learningResourcesLocale', () => {
    it('should have a valid locale', () => {
        // because the locale is meant to be maintained by the user, we check the file is valid
        isAString(locale.title);
        expect(typeof locale.search).toEqual('object');
        isAString(locale.search.title);

        isPositiveInteger(locale.notesTrimLength);

        expect(typeof locale.myCourses).toEqual('object');
        isAString(locale.myCourses.title);
        expect(typeof locale.myCourses.none).toEqual('object');
        isAString(locale.myCourses.none.title);
        expect(locale.myCourses.none.description.length).not.toBe(0);

        expect(typeof locale.myCourses.readingLists).toEqual('object');
        isAString(locale.myCourses.readingLists.title);

        expect(typeof locale.myCourses.examPapers).toEqual('object');
        isAString(locale.myCourses.examPapers.title);
        isAString(locale.myCourses.examPapers.unavailable);
        isAString(locale.myCourses.examPapers.none);
        expect(typeof locale.myCourses.examPapers.footer).toEqual('object');
        isAValidLink(locale.myCourses.examPapers.footer.noPastExams.linkOut);
        isAString(locale.myCourses.examPapers.footer.noPastExams.linkLabel);
        isAValidLink(locale.myCourses.examPapers.footer.morePastExams.linkOutPattern);
        isAString(locale.myCourses.examPapers.footer.morePastExams.linkLabel);
        isPositiveInteger(locale.myCourses.examPapers.visibleItemsCount);

        expect(typeof locale.myCourses.guides).toEqual('object');
        isAString(locale.myCourses.guides.title);
        isAString(locale.myCourses.guides.none);
        isAString(locale.myCourses.guides.unavailable);
        expect(typeof locale.myCourses.guides.footer).toEqual('object');
        expect(locale.myCourses.guides.footer.links.length).not.toBe(0);
        locale.myCourses.guides.footer.links.map(link => {
            expect(typeof link).toEqual('object');
            expect(link.icon).not.toBe(null);
            isAString(link.id);
            isAString(link.linkLabel);
            isAValidLink(link.linkTo);
        });
        isPositiveInteger(locale.myCourses.guides.visibleItemsCount);

        expect(typeof locale.myCourses.courseLinks).toEqual('object');
        isAString(locale.myCourses.courseLinks.title);
        expect(locale.myCourses.courseLinks.links.length).not.toBe(0);
        locale.myCourses.courseLinks.links.map(link => {
            expect(typeof link).toEqual('object');
            expect(link.icon).not.toBe(null);
            isAString(link.id);
            isAString(link.linkLabel);
            isAValidLink(link.linkOutPattern);
        });

        // Legal Research Essentials link is available to be added to the Course Links for LAWS subjects
        expect(typeof locale.myCourses.courseLinks.legalResearchEssentials).toEqual('object');
        expect(locale.myCourses.courseLinks.legalResearchEssentials.id).toEqual('legalResearchEssentials');
    });
});
