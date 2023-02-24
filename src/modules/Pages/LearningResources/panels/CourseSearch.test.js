import { isEnrolledInSubject } from './CourseSearch';

describe('CourseSearch component', () => {
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
