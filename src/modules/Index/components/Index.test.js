import Index from './Index';
import { getUrlForCourseResourceSpecificTab } from './subComponents/CourseResourcesPanel';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
    };
    return getElement(Index, props, args);
}

describe('Index page', () => {
    it('should render placeholders', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Course Resources panel', () => {
    it('something', () => {
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
        expect(getUrlForCourseResourceSpecificTab(aclass, page)).toEqual(
            '/courseresources?keyword&coursecode=HIST1201&campus=St Lucia&semester=Semester 2 2020',
        );
        expect(getUrlForCourseResourceSpecificTab(aclass, page, true, true)).toEqual(
            'http://localhost/courseresources?keyword&coursecode=HIST1201&campus=undefined&semester=Semester 2 2020',
        );
    });
});
