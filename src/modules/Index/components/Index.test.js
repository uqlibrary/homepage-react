// import Index from './Index';
import { getUrlForLearningResourceSpecificTab } from './subComponents/LearningResourcesPanel';
import { greeting } from './subComponents/PersonalisedPanel';

// function setup(testProps = {}, args = { isShallow: false }) {
//     const props = {
//         ...testProps,
//     };
//     return getElement(Index, props, args);
// }
//
// describe('Index page', () => {
//     it('should render placeholders', () => {
//         const wrapper = setup();
//         expect(toJson(wrapper)).toMatchSnapshot();
//     });
// });

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

describe('Personalised panel', () => {
    it('shows the correct greeting time', () => {
        expect(greeting(9)).toEqual('Good morning'); // 9am
        expect(greeting(13)).toEqual('Good afternoon'); // 1pm
        expect(greeting(21)).toEqual('Good evening'); // 9pm
    });
});
