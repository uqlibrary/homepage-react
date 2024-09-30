import { getUrlForLearningResourceSpecificTab } from './subComponents/LearningResourcesPanel';

describe('Learning Resources panel', () => {
    it('test urls correct', () => {
        const aclass = {
            ACAD_CAREER: 'UGRD',
            ACAD_GROUP: 'SCI',
            CAMPUS: 'STLUC',
            CATALOG_NBR: '1201',
            DESCR: 'The Australian Experience',
            INSTRUCTION_MODE: 'IN',
            STRM: '7060',
            SUBJECT: 'HIST',
            classnumber: 'HIST1201',
            semester: 'Semester 2 2020',
        };
        const page = {
            search: '?keyword',
        };
        const pageNoParams = {};
        expect(getUrlForLearningResourceSpecificTab(aclass, page)).toEqual(
            '/learning-resources?keyword&coursecode=HIST1201&campus=St Lucia&semester=Semester 2 2020',
        );
        expect(getUrlForLearningResourceSpecificTab(aclass, page, true, true)).toEqual(
            'http://localhost/learning-resources?keyword&coursecode=HIST1201&campus=undefined&semester=Semester 2 2020',
        );
        expect(getUrlForLearningResourceSpecificTab(aclass, pageNoParams, true, true)).toEqual(
            'http://localhost/learning-resources?coursecode=HIST1201&campus=undefined&semester=Semester 2 2020',
        );
    });
});
