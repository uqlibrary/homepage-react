import { default as locale } from './courseResourcesLocale';

describe('courseResourcesLocale', () => {
    function isAString(text) {
        expect(typeof text).toEqual('string');
        expect(text.length).not.toBe(0);
    }

    function isAValidLink(link) {
        isAString(link);
        expect(link.indexOf('http') === 0).toBe(true);
    }

    const isAWholeNumber = value => value - Math.floor(value) === 0;

    function isPositiveInteger(value) {
        expect(typeof value).toEqual('number');
        expect(isAWholeNumber(value)).toBe(true);
        expect(value > 0).toBe(true);
    }

    it('should have a valid locale', () => {
        // because the locale is meant to be maintained by the user, we check the file is valid
        isAString(locale.title);
        isAString(locale.search.title);

        isAString(locale.studyHelp.title);
        isAString(locale.studyHelp.unavailable);
        expect(typeof locale.studyHelp.links).toEqual('object');
        expect(locale.studyHelp.links.length).not.toBe(0);
        locale.studyHelp.links.map(link => {
            expect(typeof link).toEqual('object');
            expect(link.icon).not.toBe(null);
            isAString(link.id);
            isAString(link.linkLabel);
            isAValidLink(link.linkTo);
        });
        isPositiveInteger(locale.visibleItemsCount.readingLists);
        isPositiveInteger(locale.visibleItemsCount.examPapers);
        isPositiveInteger(locale.visibleItemsCount.libGuides);
        isPositiveInteger(locale.notesTrimLength);

        isAString(locale.myCourses.title);
        isAString(locale.myCourses.none.title);
        expect(locale.myCourses.none.description.length).not.toBe(0);
        isAString(locale.myCourses.readingLists.title);
        isAString(locale.myCourses.readingLists.none);
        isAString(locale.myCourses.readingLists.unavailable);
        isAString(locale.myCourses.readingLists.multiple.title);
        isAString(locale.myCourses.readingLists.multiple.linkLabel);
        isAValidLink(locale.myCourses.readingLists.multiple.linkOut);
        isAString(locale.myCourses.readingLists.footer.linkLabel);

        isAString(locale.myCourses.examPapers.title);
        isAString(locale.myCourses.examPapers.unavailable);
        isAString(locale.myCourses.examPapers.none);
        isAString(locale.myCourses.examPapers.morePastExams);
        isAValidLink(locale.myCourses.examPapers.footer.linkOutPattern);
        isAString(locale.myCourses.examPapers.footer.linkLabel);

        isAString(locale.myCourses.guides.title);
        isAString(locale.myCourses.guides.none);
        isAString(locale.myCourses.guides.unavailable);
        isAString(locale.myCourses.guides.footer.linkOut);
        isAValidLink(locale.myCourses.guides.footer.linkOut);

        isAString(locale.myCourses.links.title);
        isAString(locale.myCourses.links.blackboard.title);
        isAValidLink(locale.myCourses.links.blackboard.linkOutPattern);
        isAString(locale.myCourses.links.ecp.title);
        isAValidLink(locale.myCourses.links.ecp.linkOutPattern);
    });
});
