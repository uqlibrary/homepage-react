import { isEnrolledInSubject } from './SearchCourses';

describe('SearchCourses component', () => {
    it('should determine enrolment as false for invalid class', () => {
        const accountWithInvalidClass = {
            current_classes: [
                {
                    ACAD_CAREER: 'UGRD',
                },
            ],
        };
        expect(isEnrolledInSubject('test subject number', accountWithInvalidClass)).toBe(false);
    });

});
